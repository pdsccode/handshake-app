import React, { Component } from 'react';
import 'react-chat-elements/dist/main.css';
import { ChatList, MessageList, Input, Button } from 'react-chat-elements';
import { Firechat } from './Firechat';

const moment = require('moment');
const Identicon = require('identicon.js');
const firebase = require('firebase');
require('firebase/database');

class Chat extends Component {
  constructor(props) {
    super(props);
    this.user = null;

    const config = {
      apiKey: 'AIzaSyDBZMfls5cTmY7coHYdJr7BoX98HTz_REQ',
      authDomain: 'handshake-ce73c.firebaseapp.com',
      databaseURL: 'https://handshake-ce73c.firebaseio.com',
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }

    // Get a reference to the Firebase Realtime Database
    const chatRef = firebase.database().ref();

    // Create an instance of Firechat
    this.chat = new Firechat(firebase, chatRef);

    // Listen for authentication state changes
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // If the user is logged in, set them as the Firechat user
        this.setUser(user.uid, `Anonymous${user.uid.substr(10, 8)}`);
      } else {
        // If the user is not logged in, sign them in anonymously
        firebase.auth().signInAnonymously().catch((error) => {
          console.log('Error signing user in anonymously:', error);
        });
      }
    });

    this.state = {
      chatSource: {},
      chatDetail: null,
      currentMessage: '',
    };

    this.chatInputComponent = React.createRef();

    this.renderChatList = this.renderChatList.bind(this);
    this.renderChatDetail = this.renderChatDetail.bind(this);
    this.onChatItemClicked = this.onChatItemClicked.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentWillMount() {
    this.bindDataEvents();
  }

  onUpdateUser(user) {
    // Update our current user state and render latest user name.
    this.user = user;

    // Update our interface to reflect which users are muted or not.
    // const mutedUsers = this.user.muted || {};
    // $('[data-event="firechat-user-mute-toggle"]').each(function(i, el) {
    //   var userId = $(this).closest('[data-user-id]').data('user-id');
    //   $(this).toggleClass('red', !!mutedUsers[userId]);
    // });

    // // Ensure that all messages from muted users are removed.
    // for (var userId in mutedUsers) {
    //   $('.message[data-user-id="' + userId + '"]').fadeOut();
    // }
  }

  onEnterRoom(room) {
    // this.attachTab(room.id, room.name);
    console.log('enter room', room);
    const { id: roomId } = room;

    this.setState((prevState) => {
      const prevChatSource = prevState.chatSource;
      prevChatSource[roomId] = room;

      return {
        chatSource: prevState.chatSource,
      };
    });
  }

  onLeaveRoom(roomId) {
    // this.removeTab(roomId);

    // Auto-enter rooms in the queue
    // if ((this._roomQueue.length > 0)) {
    //   this._chat.enterRoom(this._roomQueue.shift(roomId));
    // }
  }

  onNewMessage(roomId, message) {
    // console.log('onNewMessage', roomId, message);
    const {
      userId: fromUserId, name: fromUserName,
    } = message;
    const { chatSource } = this.state;

    console.log(message, fromUserId, this.user.id, roomId);

    if (Object.prototype.hasOwnProperty.call(chatSource, roomId)) {
      const room = chatSource[roomId];
      room.froms = room.froms || {};
      room.messages = room.messages || [];
      room.froms[fromUserId] = fromUserName;
      room.messages.push(message);
      chatSource[roomId] = room;

      this.setState({
        chatSource,
      });
    }

    // var userId = message.userId;
    // if (!this._user || !this._user.muted || !this._user.muted[userId]) {
    //   this.showMessage(roomId, message);
    // }
  }

  onRemoveMessage(roomId, messageId) {
    // this.removeMessage(roomId, messageId);
  }

  // Events related to chat invitations.
  onChatInvite(invitation) {
    console.log('chat invitation', invitation);
    this.chat.acceptInvite(invitation.id);
    // var self = this;
    // var template = FirechatDefaultTemplates["templates/prompt-invitation.html"];
    // var $prompt = this.prompt('Invite', template(invitation));
    // $prompt.find('a.close').click(function() {
    //   $prompt.remove();
    //   self._chat.declineInvite(invitation.id);
    //   return false;
    // });

    // $prompt.find('[data-toggle=accept]').click(function() {
    //   $prompt.remove();
    //   self._chat.acceptInvite(invitation.id);
    //   return false;
    // });

    // $prompt.find('[data-toggle=decline]').click(function() {
    //   $prompt.remove();
    //   self._chat.declineInvite(invitation.id);
    //   return false;
    // });
  }

  onChatInviteResponse(invitation) {
    console.log('onChatInviteResponse', invitation);
    // if (!invitation.status) return;

    // var self = this,
    //     template = FirechatDefaultTemplates["templates/prompt-invite-reply.html"],
    //     $prompt;

    // if (invitation.status && invitation.status === 'accepted') {
    //   $prompt = this.prompt('Accepted', template(invitation));
    //   this._chat.getRoom(invitation.roomId, function(room) {
    //     self.attachTab(invitation.roomId, room.name);
    //   });
    // } else {
    //   $prompt = this.prompt('Declined', template(invitation));
    // }

    // $prompt.find('a.close').click(function() {
    //   $prompt.remove();
    //   return false;
    // });
  }

  onChatItemClicked(room) {
    console.log(room);
    this.setState({
      chatDetail: room,
      currentMessage: '',
    });
  }

  setUser(userId, userName) {
    console.log('setUser', userId, userName);
    const self = this;

    // Initialize data events
    self.chat.setUser(userId, userName, (user) => {
      self.user = user;
      self.chat.resumeSession();
    });
  }

  getLastMessages() {
    const { chatSource } = this.state;
    const messages = [];

    Object.keys(chatSource).forEach((roomId) => {
      const room = chatSource[roomId];
      if (room.froms && room.messages && room.messages.length > 0) {
        const fromNames = Object.keys(room.froms).filter(userId => (userId !== this.user.id)).map(userId => (room.froms[userId])).join(', ');
        const lastMessage = room.messages[room.messages.length - 1];
        const lastMessageTime = lastMessage.timestamp;
        const lastMessageContent = lastMessage.message;
        const lastMessageUserId = lastMessage.userId;
        messages.push({
          id: room.id,
          avatar: this.getUserAvatar(lastMessageUserId),
          avatarFlexible: true,
          // statusColor: 'lightgreen',
          alt: fromNames,
          title: fromNames,
          date: new Date(),
          subtitle: lastMessageContent,
          unread: 0,
          dateString: moment(new Date(lastMessageTime)).format('HH:mm'),
          roomData: room,
        });
      }
    });

    return messages;
  }

  getUserAvatar(userId) {
    return `data:image/png;base64,${new Identicon(userId).toString()}`;
  }

  sendMessage() {
    const { chatDetail, currentMessage } = this.state;
    if (currentMessage && chatDetail) {
      const { id: roomId } = chatDetail;
      this.chat.sendMessage(roomId, currentMessage, null, () => {
        if (this.chatInputComponent) {
          console.log(this.chatInputComponent.clear);
          this.chatInputComponent.clear();
        }
      });
    }
  }

  bindDataEvents() {
    this.chat.on('user-update', this.onUpdateUser.bind(this));

    // Bind events for new messages, enter / leaving rooms, and user metadata.
    this.chat.on('room-enter', this.onEnterRoom.bind(this));
    this.chat.on('room-exit', this.onLeaveRoom.bind(this));
    this.chat.on('message-add', this.onNewMessage.bind(this));
    this.chat.on('message-remove', this.onRemoveMessage.bind(this));

    // Bind events related to chat invitations.
    this.chat.on('room-invite', this.onChatInvite.bind(this));
    this.chat.on('room-invite-response', this.onChatInviteResponse.bind(this));
  }

  renderChatList() {
    const chatSource = this.getLastMessages();
    return (
      <ChatList
        dataSource={chatSource}
        onClick={this.onChatItemClicked}
      />
    );
  }

  renderChatDetail(room) {
    const { roomData } = room;
    const { messages } = roomData;
    let prevUserId = null;

    const messageList = messages.map((message) => {
      const { message: messageContent, name: messageName, userId } = message;
      const notch = userId !== prevUserId;
      prevUserId = userId;

      return {
        avatar: this.getUserAvatar(message.userId),
        position: message.userId !== this.user.id ? 'left' : 'right',
        type: 'text',
        title: messageName,
        text: messageContent,
        notch,
        dateString: moment(new Date(message.timestamp)).format('HH:mm'),
      };
    });

    return (
      <div>
        <MessageList
          dataSource={messageList}
        />
        <Input
          placeholder="Type a message..."
          multiline={false}
          ref={(ref) => { this.chatInputComponent = ref; }}
          onChange={(e) => { this.setState({ currentMessage: e.target.value }); }}
          rightButtons={
            <Button
              color="white"
              backgroundColor="black"
              text="Send"
              onClick={this.sendMessage}
            />
          }
        />
      </div>
    );
  }

  render() {
    const { chatDetail } = this.state;
    if (chatDetail) {
      return (
        <div>
          {this.renderChatDetail(chatDetail)}
        </div>
      );
    }

    return (
      <div>
        {this.renderChatList()}
      </div>
    );
  }
}

export default Chat;
