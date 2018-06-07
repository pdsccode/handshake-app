import React, { Component } from 'react';
import './Firechat.scss';
import { MessageList, ChatList, Input, Button } from 'react-chat-elements';
import { Firechat } from './Firechat';
import { setHeaderLeft, setHeaderTitle } from '@/reducers/app/action';
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SearchBar from '@/components/core/controls/SearchBar';
import IconBtnSend from '@/assets/images/icon/ic-btn-send.svg';
import IconBackBtn from '@/assets/images/icon/back-chevron.svg';

const moment = require('moment');
const Identicon = require('identicon.js');
const firebase = require('firebase');
const md5 = require('md5');
require('firebase/database');
// Get a reference to the Firebase Realtime Database
const chatRef = firebase.database().ref();
let isInitialized = false;

// Create an instance of Firechat
export const chatInstance = new Firechat(firebase, chatRef);

class Chat extends Component {
  constructor(props) {
    super(props);

    this.user = null;

    this.state = {
      chatSource: {},
      chatDetail: null,
      currentMessage: '',
      searchUserString: '',
      searchUsers: [],
    };

    this.chatInputRef = React.createRef();
    this.messageListRef = null;
    this.searchBtnRef = null;
    this.maxUserSearchResult = 100;
    this.isInChatTab = true;

    this.renderChatList = this.renderChatList.bind(this);
    this.renderChatDetail = this.renderChatDetail.bind(this);
    this.onChatItemClicked = this.onChatItemClicked.bind(this);
    this.onSearchUserClicked = this.onSearchUserClicked.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.onSearchUser = this.onSearchUser.bind(this);
    this.onBackButtonClicked = this.onBackButtonClicked.bind(this);

    this.chatTo = props.match.params.username;

    this.bindDataEvents();
    this.signIn(null);
  }

  componentDidMount() {
    this.updateHeaderLeft();
  }

  componentWillUnmount() {
    this.isInChatTab = false;
  }

  onBackButtonClicked() {
    this.setCustomState({
      chatDetail: null,
    }, () => {
      this.updateHeaderLeft();
    });
    this.setCurrentUserName();
  }

  onUpdateUser(user) {
    // Update our current user state and render latest user name.
    console.log('update user', user);
    this.user = user;
    if (!this.state.chatDetail) {
      this.setCurrentUserName();
    }
  }

  onEnterRoom(room) {
    console.log('enter room', room);
    const { id: roomId, authorizedUsers } = room;
    const { chatSource } = this.state;

    if (Object.prototype.hasOwnProperty.call(chatSource, roomId)) {
      room.froms = chatSource[roomId].froms;
    }
    room.froms = room.froms || {};
    room.messages = room.messages || [];
    Object.keys(authorizedUsers).forEach((userId) => {
      room.froms[userId] = authorizedUsers[userId].name;
    });
    this.setChatSourceState(roomId, room);
  }

  onLeaveRoom(roomId) {

  }

  onNewMessage(roomId, message) {
    console.log('new message', message, 'roomId', roomId, 'chatsource', JSON.parse(JSON.stringify(this.state.chatSource)));
    const {
      userId: fromUserId, name: fromUserName,
    } = message;
    const { chatSource, chatDetail } = this.state;

    if (Object.prototype.hasOwnProperty.call(chatSource, roomId)) {
      const room = chatSource[roomId];
      console.log('new message', roomId, 'room', room);
      // room.froms = room.froms || {};
      // room.froms[fromUserId] = fromUserName;
      if (Object.prototype.hasOwnProperty.call(room.froms, fromUserId) && room.froms[fromUserId]) {
        message.name = room.froms[fromUserId];
      }
      room.messages = room.messages || [];
      room.messages.push(message);
      chatSource[roomId] = room;

      if (chatDetail && chatDetail.roomData.id == roomId) {
        chatDetail.roomData = room;
      }

      this.setCustomState({
        chatSource,
        chatDetail,
      }, () => {
        console.log('after receive new message', JSON.parse(JSON.stringify(this.state.chatSource)));
      });

      if (this.state.chatDetail) {
        this.scrollToBottom();
      }
    }
  }

  onRemoveMessage(roomId, messageId) {

  }

  // Events related to chat invitations.
  onChatInvite(invitation) {
    chatInstance.acceptInvite(invitation.id);
  }

  onChatInviteResponse(invitation) {
    console.log('new invitation response', invitation);
    if (!invitation.status) return;

    const { chatSource } = this.state;

    if (Object.prototype.hasOwnProperty.call(chatSource, invitation.roomId)) {
      const room = chatSource[invitation.roomId];
      room.froms = room.froms || {};
      room.froms[invitation.fromUserId] = invitation.fromUserName;

      this.setCustomState((prevState) => {
        const prevChatSource = prevState.chatSource;
        prevChatSource[invitation.roomId] = room;
        return {
          chatSource: prevChatSource,
        }
      });

      console.log('enter here', room);

      this.enterMessageRoom(this.generateMessageRoomData(room.id, invitation.fromUserId, invitation.fromUserName, room));
    } else {
      chatInstance.getRoom(invitation.roomId, (room) => {
        room.messages = room.messages || [];
        room.froms = room.froms || {};
        room.froms[invitation.toUserId] = invitation.toUserName;
        room.froms[invitation.fromUserId] = invitation.fromUserName;

        this.setCustomState((prevState) => {
          const prevChatSource = prevState.chatSource;
          prevChatSource[invitation.roomId] = room;
          return {
            chatSource: prevChatSource,
          }
        });

        this.enterMessageRoom(this.generateMessageRoomData(room.id, invitation.fromUserId, invitation.fromUserName, room));
      });
    }
  }

  onChatItemClicked(room) {
    // console.log('onChatItemClicked', room);
    this.enterMessageRoom(room);
  }

  onSearchUserClicked(user) {
    this.chatWithUser(user.userData);
  }

  onSearchUser(e) {
    const query = e.target.value;
    this.setCustomState({
      searchUserString: query,
    })
    chatInstance.getUsersByPrefix(query, null, null, this.maxUserSearchResult, (userListFiltered) => {
      // console.log(userListFiltered);
      if (!query) {
        userListFiltered = [];
      }
      this.setCustomState({
        searchUsers: userListFiltered,
      })
    });
    e.preventDefault();
  }

  getLastMessages() {
    const { chatSource } = this.state;
    const messages = [];

    Object.keys(chatSource).forEach((roomId) => {
      const room = chatSource[roomId];
      if (room.froms && room.messages && room.messages.length > 0) {
        const fromNamesFiltered = Object.keys(room.froms).filter(userId => (userId !== this.user.id));
        const fromNames = fromNamesFiltered.map(userId => (room.froms[userId])).join(', ');
        const fromUserIds = fromNamesFiltered.map(userId => (userId)).join(',');
        const lastMessage = room.messages[room.messages.length - 1];
        const lastMessageTime = lastMessage.timestamp;
        const lastMessageContent = lastMessage.message;
        messages.push({
          id: room.id,
          avatar: this.getUserAvatar(fromUserIds),
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

  getListSearchUsersSource(users) {
    const usersData = [];
    Object.keys(users).forEach((userName) => {
      const user = users[userName];
      const { online, name, id: userId } = user;

      usersData.push({
        id: userId,
        avatar: this.getUserAvatar(userId),
        avatarFlexible: true,
        statusColor: online ? 'lightgreen' : false,
        alt: name,
        title: name,
        subtitle: '',
        unread: 0,
        date: null,
        dateString: '',
        userData: user,
      });
    });

    return usersData;
  }

  getUserAvatar(userId) {
    return `data:image/png;base64,${new Identicon(md5(userId)).toString()}`;
  }

  generateMessageRoomData(roomId, userId, userName, room) {
    return {
      id: roomId,
      avatar: this.getUserAvatar(userId),
      avatarFlexible: true,
      // statusColor: 'lightgreen',
      alt: userName,
      title: userName,
      date: new Date(),
      subtitle: '',
      unread: 0,
      dateString: moment(new Date()).format('HH:mm'),
      roomData: room,
    };
  }

  updateCurrentUserName(userName, roomId) {
    if (chatInstance) {
      chatInstance.updateUserName(userName, roomId);
    }
  }

  setCurrentUserName() {
    console.log('set current user name');
    if (this.isInChatTab) {
      this.props.setHeaderTitle(this.user.name);
    }
  }

  setUser(userId, userName) {
    const self = this;

    // Initialize data events
    chatInstance.setUser(userId, userName, (user) => {
      self.user = user;

      const historyState = this.loadDataFromLocalStorage();
      if (historyState && isInitialized) {
        this.setCustomState(historyState);
      }

      isInitialized = true;

      chatInstance.resumeSession();
      this.updateCurrentUserName(userName);

      if (this.chatTo) {
        chatInstance.getUserById(this.chatTo, (user) => {
          if (user) {
            this.chatWithUser(user);
          }
        });
      }
    });
  }

  setChatSourceState(roomId, room) {
    this.setCustomState((prevState) => {
      const prevChatSource = prevState.chatSource;
      prevChatSource[roomId] = room;

      return {
        chatSource: prevState.chatSource,
      };
    });
  }

  setCustomState(state, cb) {
    this.setState(state, () => {
      if (cb) {
        setTimeout(() => {
          this.saveCurrentDataToLocalStorage();
        }, 0);
        cb();
      }
    });
  }

  loadDataFromLocalStorage() {
    return JSON.parse(localStorage.getItem('chat_data'));
  }

  saveCurrentDataToLocalStorage() {
    localStorage.setItem('chat_data', JSON.stringify(this.state));
  }

  mixString(textOne, textTwo) {
    let result = '';
    const maxLength = textOne.length > textTwo.length ? textOne.length : textTwo.length;
    for (let i = 0; i < maxLength; i += 1) {
      const textOneCharCode = i < textOne.length ? textOne[i].charCodeAt() : 0;
      const textTwoCharCode = i < textTwo.length ? textTwo[i].charCodeAt() : 0;

      result += String.fromCharCode(textOneCharCode + textTwoCharCode);
    }

    return result;
  }

  updateHeaderLeft() {
    this.props.setHeaderLeft(this.state.chatDetail ? this.renderBackButton() : this.renderSearchButton());
  }

  signIn(user) {
    if (user) {
      const { profile } = this.props.auth;
      const userName = profile ? profile.username : `${user.uid.substr(10, 8)}`;
      this.setUser(user.uid, userName);
      return;
    }

    const { profile, token } = this.props.auth;

    if (!profile || !token) {
      console.log('You have not authorized to sign in to chat');
      return;
    }

    const username = `${md5(`${token}_${profile.id}`)}@handshake.autonomous.nyc`;
    const password = md5(token);
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInWithEmailAndPassword(username, password)
          .then((user) => {
            if (user) {
              // If the user is logged in, set them as the Firechat user
              this.signIn(user.user);
            } else {
              // console.log('cannot sign in into chat');
            }
          })
          .catch((error) => {
            firebase.auth().createUserWithEmailAndPassword(username, password).then((user) => {
              this.signIn(user.user);
            });
          });
      } else {
        this.signIn(user);
      }
    });
  }

  clearSearch() {
    if (this.searchBtnRef) {
      this.searchBtnRef.value = '';
      this.setCustomState({
        searchUserString: '',
        searchUsers: [],
      })
    }
  }

  enterMessageRoom(room) {
    this.setCustomState({
      chatDetail: room,
      currentMessage: '',
    }, () => {
      this.updateHeaderLeft();
      this.scrollToBottom();
    });
    this.clearSearch();
    this.props.setHeaderTitle(Object.keys(room.roomData.froms).filter(userId => (userId !== this.user.id)).map(userId => (room.roomData.froms[userId])).join(', '));
  }

  scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  sendMessage(e) {
    const { chatDetail, currentMessage } = this.state;
    if (currentMessage && chatDetail) {
      const { id: roomId } = chatDetail;
      chatInstance.sendMessage(roomId, currentMessage, null, () => {
        if (this.chatInputRef) {
          this.chatInputRef.clear();
          this.chatInputRef.input.focus();
          this.scrollToBottom();
        }
      });
    }
    if (e) {
      e.preventDefault();
    }
  }

  chatWithUser(user) {
    const { id: userId, name: userName } = user;
    const roomId = md5(this.mixString(userId, this.user.id));

    if (Object.prototype.hasOwnProperty.call(this.state.chatSource, roomId)) {
      this.enterMessageRoom(this.generateMessageRoomData(roomId, userId, userName, this.state.chatSource[roomId]));
    } else {
      chatInstance.createRoom(roomId, (room) => {
        chatInstance.inviteUser(userId, userName, roomId);
        room.messages = room.messages || [];
        room.froms = {
          [userId]: userName,
          [this.user.id]: this.user.name,
        };

        console.log('enterRoom', roomId, 'room data', room);

        this.setCustomState((prevState) => {
          const prevChatSource = prevState.chatSource;
          prevChatSource[roomId] = room;
          return {
            searchUsers: [],
            chatSource: prevChatSource,
          }
        }, () => {
          console.log('onsearchuser click roomId', roomId, 'chatsource', JSON.parse(JSON.stringify(this.state.chatSource)));
          this.enterMessageRoom(this.generateMessageRoomData(roomId, userId, userName, room));
        });
      });
    }
  }

  bindDataEvents() {
    chatInstance.on('user-update', this.onUpdateUser.bind(this));

    // Bind events for new messages, enter / leaving rooms, and user metadata.
    chatInstance.on('room-enter', this.onEnterRoom.bind(this));
    chatInstance.on('room-exit', this.onLeaveRoom.bind(this));
    chatInstance.on('message-add', this.onNewMessage.bind(this));
    chatInstance.on('message-remove', this.onRemoveMessage.bind(this));

    // Bind events related to chat invitations.
    chatInstance.on('room-invite', this.onChatInvite.bind(this));
    chatInstance.on('room-invite-response', this.onChatInviteResponse.bind(this));
  }

  renderChatList() {
    const { searchUsers, searchUserString } = this.state;
    const isInSearchMode = !!searchUserString;
    const chatSource = isInSearchMode ? this.getListSearchUsersSource(searchUsers) : this.getLastMessages();

    return chatSource.length > 0 ? (
      <div>
        <ChatList
          dataSource={chatSource}
          onClick={isInSearchMode ? this.onSearchUserClicked : this.onChatItemClicked}
        />
      </div>
    ) : this.renderEmptyMessage(isInSearchMode ? 'The Ninja you are looking for is not here. Perhaps you have their name wrong.' : 'NO MESSAGE YET');
  }

  renderBackButton() {
    return (<img src={IconBackBtn} onClick={this.onBackButtonClicked} />)
  }

  renderSearchButton() {
    return (
      <input
        ref={(ref) => { this.searchBtnRef = ref; }}
        type="search"
        className="rce-search-input"
        onChange={this.onSearchUser}
        onBlur={() => { setTimeout(() => { this.clearSearch() }, 100); }}
        placeholder='Search for your fellow ninjas by their code name'
      />
    )
  }

  renderEmptyMessage(message) {
    return (
      <div className={'no-data'}>
        <p className={'text'}>{message}</p>
      </div>
    )
  }

  renderChatDetail(room) {
    // console.log('render chat detail', room);
    const { roomData } = room;
    const { messages } = roomData;
    let prevUserId = null;

    const messageList = messages.map((message) => {
      const { message: messageContent, name: messageName, userId } = message;
      const notch = userId !== prevUserId;
      prevUserId = userId;

      return {
        avatar: notch && userId !== this.user.id ? this.getUserAvatar(userId) : null,
        position: userId !== this.user.id ? 'left' : 'right',
        type: 'text',
        title: null,
        text: messageContent,
        notch,
        dateString: moment(new Date(message.timestamp)).format('HH:mm'),
      };
    });

    return (
      <div>
        <MessageList
          ref={(ref) => { this.messageListRef = ref; }}
          dataSource={messageList}
          toBottomHeight={'100%'}
          downButton={true}
        />
        <Input
          placeholder="Type a message..."
          multiline={false}
          ref={(ref) => { this.chatInputRef = ref; }}
          onFocus={(e) => { this.scrollToBottom(); }}
          onKeyDown={(e) => {
            if (e.keyCode == 13) {
              this.sendMessage();
              e.preventDefault();
              return false;
            }
          }}
          onChange={(e) => { this.setCustomState({ currentMessage: e.target.value }); }}
          rightButtons={
            <img
              src={IconBtnSend}
              onClick={this.sendMessage}
            />
          }
        />
      </div>
    );
  }

  render() {
    const { chatDetail } = this.state;
    return (
      <div className={'chat-container'}>
        {chatDetail ? this.renderChatDetail(chatDetail) : this.renderChatList()}
      </div>
    )
  }
}

Chat.propTypes = {
  discover: PropTypes.object,
};

const mapState = (state) => ({
  auth: state.auth,
});

export default connect(mapState, ({ setHeaderLeft, setHeaderTitle }))(Chat);
