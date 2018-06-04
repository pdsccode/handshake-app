export class Firechat {
  constructor(firebaseInstance, firebaseRef, options) {
    if (!firebaseInstance) {
      throw new Error('firebaseInstance is required to use Firechat');
    }

    this.firebaseInstance = firebaseInstance;
    // Cache the provided Database reference and the firebase.App instance
    this.firechatRef = firebaseRef;
    this.firebaseApp = firebaseRef.database.app;

    // User-specific instance variables.
    this.user = null;
    this.userId = null;
    this.userName = null;
    this.isModerator = false;

    // A unique id generated for each session.
    this.sessionId = null;

    // A mapping of event IDs to an array of callbacks.
    this.events = {};

    // A mapping of room IDs to a boolean indicating presence.
    this.rooms = {};

    // A mapping of operations to re-queue on disconnect.
    this.presenceBits = {};

    // Commonly-used Firebase references.
    this.userRef = null;
    this.messageRef = this.firechatRef.child('chat-room-messages');
    this.roomRef = this.firechatRef.child('chat-room-metadata');
    this.usersOnlineRef = this.firechatRef.child('chat-user-names-online');

    // Setup and establish default options.
    this.options = options || {};

    // The number of historical messages to load per room.
    this.options.numMaxMessages = this.options.numMaxMessages || 50;
  }

  // Load the initial metadata for the user's account and set initial state.
  loadUserMetadata(onComplete) {
    const self = this;

    // Update the user record with a default name on user's first visit.
    this.userRef.transaction((current) => {
      if (!current || !current.id || !current.name) {
        return {
          id: self.userId,
          name: self.userName,
        };
      }
    }, (error, committed, snapshot) => {
      self.user = snapshot.val();
      setTimeout(onComplete, 0);
    });
  }

  // Initialize Firebase listeners and callbacks for the supported bindings.
  setupDataEvents() {
    // Monitor connection state so we can requeue disconnect operations if need be.
    const connectedRef = this.firechatRef.root.child('.info/connected');
    connectedRef.on('value', (snapshot) => {
      if (snapshot.val() === true) {
        // We're connected (or reconnected)! Set up our presence state.
        Object.keys(this.presenceBits).forEach((path) => {
          const op = this.presenceBits[path];
          const { ref } = op;

          ref.onDisconnect().set(op.offlineValue);
          ref.set(op.onlineValue);
        });
      }
    }, this);

    // Queue up a presence operation to remove the session when presence is lost
    this.queuePresenceOperation(this.sessionRef, true, null);

    // Register our username in the public user listing.
    const usernameRef = this.usersOnlineRef.child(this.userId);
    this.queuePresenceOperation(usernameRef, {
      name: this.userName,
      shortName: this.userName.toLowerCase(),
      sessionId: this.sessionId,
      online: true,
    }, {
      name: this.userName,
      shortName: this.userName.toLowerCase(),
      sessionId: this.sessionId,
      online: false
    });
    // const usernameSessionRef = usernameRef.child(this.sessionId);
    // this.queuePresenceOperation(usernameSessionRef, {
    //   id: this.userId,
    //   name: this.userName,
    // }, null);

    // Listen for state changes for the given user.
    this.userRef.on('value', this.onUpdateUser, this);

    // Listen for chat invitations from other users.
    this.userRef.child('invites').on('child_added', this.onFirechatInvite, this);
  }

  // Append the new callback to our list of event handlers.
  addEventCallback(eventId, callback) {
    this.events[eventId] = this.events[eventId] || [];
    this.events[eventId].push(callback);
  }

  // Retrieve the list of event handlers for a given event id.
  getEventCallbacks(eventId) {
    if (Object.prototype.hasOwnProperty.call(this.events, eventId)) {
      return this.events[eventId];
    }
    return [];
  }


  // Invoke each of the event handlers for a given event id with specified data.
  invokeEventCallbacks(eventId, ...args) {
    let eventArgs = [];
    const callbacks = this.getEventCallbacks(eventId);

    Array.prototype.push.apply(eventArgs, args);
    eventArgs = args.slice(1);

    for (let i = 0; i < callbacks.length; i += 1) {
      callbacks[i].apply(null, args);
    }
  }

  // Keep track of on-disconnect events so they can be requeued if we disconnect the reconnect.
  queuePresenceOperation(ref, onlineValue, offlineValue) {
    ref.onDisconnect().set(offlineValue);
    ref.set(onlineValue);
    this.presenceBits[ref.toString()] = {
      ref,
      onlineValue,
      offlineValue,
    };
  }

  // Remove an on-disconnect event from firing upon future disconnect and reconnect.
  removePresenceOperation(ref, value) {
    const path = ref.toString();
    ref.onDisconnect().cancel();
    ref.set(value);
    delete this.presenceBits[path];
  }

  // Event to monitor current user state.
  onUpdateUser(snapshot) {
    this.user = snapshot.val();
    this.userName = this.user.name;
    this.invokeEventCallbacks('user-update', this.user);
  }

  // Event to monitor current auth + user state.
  onAuthRequired() {
    this.invokeEventCallbacks('auth-required');
  }

  // Events to monitor room entry / exit and messages additional / removal.
  onEnterRoom(room) {
    this.invokeEventCallbacks('room-enter', room);
  }

  onNewMessage(roomId, snapshot) {
    const message = snapshot.val();
    message.id = snapshot.key;
    this.invokeEventCallbacks('message-add', roomId, message);
  }

  onRemoveMessage(roomId, snapshot) {
    const messageId = snapshot.key;
    this.invokeEventCallbacks('message-remove', roomId, messageId);
  }

  onLeaveRoom(roomId) {
    this.invokeEventCallbacks('room-exit', roomId);
  }

  // Event to listen for notifications from administrators and moderators.
  onNotification(snapshot) {
    const notification = snapshot.val();
    if (!notification.read) {
      if (notification.notificationType !== 'suspension' || notification.data.suspendedUntil < new Date().getTime()) {
        snapshot.ref.child('read').set(true);
      }
      this.invokeEventCallbacks('notification', notification);
    }
  }

  // Events to monitor chat invitations and invitation replies.
  onFirechatInvite(snapshot) {
    const self = this;
    const invite = snapshot.val();

    // Skip invites we've already responded to.
    if (invite.status) {
      return;
    }

    invite.id = invite.id || snapshot.key;
    self.getRoom(invite.roomId, (room) => {
      invite.toRoomName = room.name;
      self.invokeEventCallbacks('room-invite', invite);
    });
  }

  onFirechatInviteResponse(snapshot) {
    const invite = snapshot.val();

    invite.id = invite.id || snapshot.key;
    this.invokeEventCallbacks('room-invite-response', invite);
  }

  setUser(userId, userName, callback) {
    const self = this;

    self.firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        self.userId = userId.toString();
        self.userName = userName.toString();
        self.userRef = self.firechatRef.child('chat-users').child(self.userId);
        self.sessionRef = self.userRef.child('sessions').push();
        self.sessionId = self.sessionRef.key;

        self.loadUserMetadata(() => {
          setTimeout(() => {
            callback(self.user);
            self.setupDataEvents();
          }, 0);
        });
      } else {
        self.warn('Firechat requires an authenticated Firebase reference. Pass an authenticated reference before loading.');
      }
    });
  }

  resumeSession() {
    const self = this;
    this.userRef.child('rooms').once('value', (snapshot) => {
      const rooms = snapshot.val() || {};
      Object.keys(rooms).forEach((roomId) => {
        self.enterRoom(rooms[roomId].id);
      });
    }, /* onError */() => { }, /* context */ this);
  }

  on(eventType, cb) {
    this.addEventCallback(eventType, cb);
  }

  createRoom(roomName, roomType, callback) {
    const self = this;
    const newRoomRef = this.roomRef.push();

    const newRoom = {
      id: newRoomRef.key,
      name: roomName,
      type: roomType || 'public',
      createdByUserId: this.userId,
      createdAt: this.firebaseInstance.database.ServerValue.TIMESTAMP,
    };

    if (roomType === 'private') {
      newRoom.authorizedUsers = {};
      newRoom.authorizedUsers[this.userId] = true;
    }

    newRoomRef.set(newRoom, (error) => {
      if (!error) {
        self.enterRoom(newRoomRef.key);
      }
      if (callback) {
        callback(newRoomRef.key);
      }
    });
  }

  enterRoom(roomId) {
    const self = this;
    self.getRoom(roomId, (room) => {
      const { name: roomName, createdByUserId, createdAt } = room;

      if (!roomId || !roomName) return;

      // Skip if we're already in this room.
      if (self.rooms[roomId]) {
        return;
      }

      self.rooms[roomId] = true;

      if (self.user) {
        // Save entering this room to resume the session again later.
        self.userRef.child('rooms').child(roomId).set({
          id: roomId,
          name: roomName,
          active: true,
        });

        // Set presence bit for the room and queue it for removal on disconnect.
        const presenceRef = self.firechatRef.child('chat-room-users').child(roomId).child(self.userId).child(self.sessionId);
        presenceRef.set({
          id: self.userId,
          name: self.userName,
        });
        // self.queuePresenceOperation(presenceRef, {
        //   id: self.userId,
        //   name: self.userName,
        // }, null);
      }

      // Invoke our callbacks before we start listening for new messages.
      self.onEnterRoom({
        id: roomId, name: roomName, createdByUserId, createdAt,
      });

      // Setup message listeners
      self.roomRef.child(roomId).once('value', () => {
        self.messageRef.child(roomId).limitToLast(self.options.numMaxMessages).on('child_added', (snapshot) => {
          self.onNewMessage(roomId, snapshot);
        }, /* onCancel */() => {
          // Turns out we don't have permission to access these messages.
          self.leaveRoom(roomId);
        }, /* context */ self);

        self.messageRef.child(roomId).limitToLast(self.options.numMaxMessages).on('child_removed', (snapshot) => {
          self.onRemoveMessage(roomId, snapshot);
        }, /* onCancel */() => { }, /* context */ self);
      }, /* onFailure */() => { }, self);
    });
  }

  leaveRoom(roomId) {
    const self = this;
    const userRoomRef = self.firechatRef.child('chat-room-users').child(roomId);

    // Remove listener for new messages to this room.
    self.messageRef.child(roomId).off();

    if (self.user) {
      const presenceRef = userRoomRef.child(self.userId).child(self.sessionId);

      // Remove presence bit for the room and cancel on-disconnect removal.
      self.removePresenceOperation(presenceRef, null);

      // Remove session bit for the room.
      self.userRef.child('rooms').child(roomId).remove();
    }

    delete self.rooms[roomId];

    // Invoke event callbacks for the room-exit event.
    self.onLeaveRoom(roomId);
  }

  sendMessage(roomId, messageContent, messageType, cb) {
    const self = this;
    const message = {
      userId: self.userId,
      name: self.userName,
      timestamp: this.firebaseInstance.database.ServerValue.TIMESTAMP,
      message: messageContent,
      type: messageType || 'default',
    };

    if (!self.user) {
      self.onAuthRequired();
      if (cb) {
        cb(new Error('Not authenticated or user not set!'));
      }
      return;
    }

    const newMessageRef = self.messageRef.child(roomId).push();
    newMessageRef.setWithPriority(message, this.firebaseInstance.database.ServerValue.TIMESTAMP, cb);
  }

  deleteMessage(roomId, messageId, cb) {
    this.messageRef.child(roomId).child(messageId).remove(cb);
  }

  // Mute or unmute a given user by id. This list will be stored internally and
  // all messages from the muted clients will be filtered client-side after
  // receipt of each new message.
  toggleUserMute(userId, cb) {
    if (!this.user) {
      this.onAuthRequired();
      if (cb) {
        cb(new Error('Not authenticated or user not set!'));
      }
      return;
    }

    this.userRef.child('muted').child(userId).transaction(isMuted => ((isMuted) ? null : true), cb);
  }

  sendInvite(userId, roomId) {
    const self = this;
    const inviteRef = self.firechatRef.child('chat-users').child(userId).child('invites').push();
    inviteRef.set({
      id: inviteRef.key,
      fromUserId: self.userId,
      fromUserName: self.userName,
      roomId,
    });

    // Handle listen unauth / failure in case we're kicked.
    inviteRef.on('value', self.onFirechatInviteResponse, () => { }, self);
  }

  // Invite a user to a specific chat room.
  inviteUser(userId, roomId) {
    const self = this;

    if (!self.user) {
      self.onAuthRequired();
      return;
    }

    self.getRoom(roomId, (room) => {
      if (room.type === 'private') {
        const authorizedUserRef = self.roomRef.child(roomId).child('authorizedUsers');
        authorizedUserRef.child(userId).set(true, (error) => {
          if (!error) {
            self.sendInvite(userId, roomId);
          }
        });
      } else {
        self.sendInvite(userId, roomId);
      }
    });
  }

  acceptInvite(inviteId, cb) {
    const self = this;

    self.userRef.child('invites').child(inviteId).once('value', (snapshot) => {
      const invite = snapshot.val();
      if (invite === null && cb) {
        return cb(new Error(`acceptInvite(${inviteId}): invalid invite id`));
      }

      self.enterRoom(invite.roomId);
      self.userRef.child('invites').child(inviteId).update({
        status: 'accepted',
        toUserName: self.userName,
        toUserId: self.userId,
      }, cb);
      return true;
    }, self);
  }

  declineInvite(inviteId, cb) {
    const self = this;
    const updates = {
      status: 'declined',
      toUserName: self.userName,
    };

    self.userRef.child('invites').child(inviteId).update(updates, cb);
  }

  getRoomList(cb) {
    const self = this;

    self.roomRef.once('value', (snapshot) => {
      cb(snapshot.val());
    });
  }

  getUsersByRoom(...args) {
    const self = this;
    const roomId = args[0];
    let query = self.firechatRef.child('chat-room-users').child(roomId);
    const cb = args[arguments.length - 1];
    let limit = null;

    if (arguments.length > 2) {
      [limit] = args;
    }

    query = (limit) ? query.limitToLast(limit) : query;

    query.once('value', (snapshot) => {
      const usernames = snapshot.val() || {};
      const usernamesUnique = {};

      Object.keys(usernames).forEach((username) => {
        Object.keys(usernames[username]).forEach((session) => {
          usernamesUnique[username] = usernames[username][session];
          return false;
        });
      });

      setTimeout(() => {
        cb(usernamesUnique);
      }, 0);
    });
  }

  getUsersByPrefix(prefix, startAt, endAt, limit, cb) {
    let query = this.usersOnlineRef;
    const prefixLower = prefix.toLowerCase();
    query = query.orderByChild('shortName');

    if (startAt) {
      query = query.startAt(null, startAt);
    } else if (endAt) {
      query = query.endAt(null, endAt);
    } else {
      query = (prefixLower) ? query.startAt(null, prefixLower) : query.startAt();
    }

    query = (limit) ? query.limitToLast(limit) : query;

    query.once('value', (snapshot) => {
      const usernames = snapshot.val() || {};
      const usernamesFiltered = {};

      Object.keys(usernames).forEach((userId) => {
        const userInfo = usernames[userId];
        let userName = userInfo.name;
        let isOnline = userInfo.online;

        if (userId == this.user.id || (prefix.length > 0) && (userName.toLowerCase().indexOf(prefixLower) !== 0)) {
          return true;
        }

        usernamesFiltered[userName] = {
          name: userName,
          id: userId,
          online: isOnline,
        };

        return true;
      });

      setTimeout(() => {
        cb(usernamesFiltered);
      }, 0);
    });
  }

  // Miscellaneous helper methods.
  getRoom(roomId, callback) {
    this.roomRef.child(roomId).once('value', (snapshot) => {
      callback(snapshot.val());
    });
  }

  warn(msg) {
    let warnMsg = msg;
    if (console) {
      warnMsg = `Firechat Warning: ${warnMsg}`;
      if (typeof console.warn === 'function') {
        console.warn(warnMsg);
      } else if (typeof console.log === 'function') {
        console.log(warnMsg);
      }
    }
  }
}

export default Firechat;
