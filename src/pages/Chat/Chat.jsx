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

class Chat extends Component {
  constructor(props) {
    super(props);
    this.user = null;
    // Get a reference to the Firebase Realtime Database
    const chatRef = firebase.database().ref();

    // Create an instance of Firechat
    this.chat = new Firechat(firebase, chatRef);

    this.state = {
      chatSource: {},
      chatDetail: null,
      currentMessage: '',
      searchUserString: '',
      searchUsers: [],
    };

    this.chatInputRef = React.createRef();
    this.messageListRef = null;
    this.maxUserSearchResult = 100;

    this.renderChatList = this.renderChatList.bind(this);
    this.renderChatDetail = this.renderChatDetail.bind(this);
    this.onChatItemClicked = this.onChatItemClicked.bind(this);
    this.onSeachUserClicked = this.onSeachUserClicked.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.onSearchUser = this.onSearchUser.bind(this);
    this.onBackButtonClicked = this.onBackButtonClicked.bind(this);

    this.bindDataEvents();
    this.signIn(null);
  }

  componentDidMount() {
    this.updateHeaderLeft();
  }

  updateHeaderLeft() {
    this.props.setHeaderLeft(this.state.chatDetail ? this.renderBackButton() : this.renderSearchButton());
  }

  signIn(user) {
    if (user) {
      this.setUser(user.uid, `${user.uid.substr(10, 8)}`);
      return;
    }

    const { profile, token } = this.props.auth;
    const username = `${md5(`${token}_${profile.id}`)}@handshake.autonomous.nyc`;
    const password = md5(token);
    firebase.auth().signInWithEmailAndPassword(username, password)
      .then((user) => {
        if (user) {
          // If the user is logged in, set them as the Firechat user
          this.signIn(user.user);
        } else {
          console.log('cannot sign in into chat');
        }
      })
      .catch((error) => {
        firebase.auth().createUserWithEmailAndPassword(username, password).then((user) => {
          this.signIn(user.user);
        });
      });
  }

  onBackButtonClicked() {
    this.setState({
      chatDetail: null,
    }, () => {
      this.updateHeaderLeft();
    });
    this.setCurrentUserName();
  }

  onUpdateUser(user) {
    // Update our current user state and render latest user name.
    this.user = user;
    this.setCurrentUserName();
  }

  onEnterRoom(room) {
    // console.log('enter room', room);
    const { id: roomId } = room;

    this.setChatSourceState(roomId, room);

    this.chat.getUsersByRoom(roomId, (users) => {
      room.froms = {};
      Object.keys(users).forEach((userId) => {
        room.froms[userId] = users[userId].name;
      });
      this.setChatSourceState(roomId, room);
    });
  }

  setChatSourceState(roomId, room) {
    this.setState((prevState) => {
      const prevChatSource = prevState.chatSource;
      prevChatSource[roomId] = room;

      return {
        chatSource: prevState.chatSource,
      };
    });
  }

  onLeaveRoom(roomId) {

  }

  onNewMessage(roomId, message) {
    // console.log('new message', message);
    const {
      userId: fromUserId, name: fromUserName,
    } = message;
    const { chatSource } = this.state;

    if (Object.prototype.hasOwnProperty.call(chatSource, roomId)) {
      const room = chatSource[roomId];
      room.messages = room.messages || [];
      room.messages.push(message);
      chatSource[roomId] = room;

      this.setState({
        chatSource,
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
    this.chat.acceptInvite(invitation.id);
  }

  onChatInviteResponse(invitation) {
    // console.log('new invitation response', invitation);
    if (!invitation.status) return;

    this.chat.getRoom(invitation.roomId, (room) => {
      room.messages = room.messages || [];
      room.froms = {
        [invitation.toUserId]: invitation.toUserName,
        [invitation.fromUserId]: invitation.fromUserId,
      };

      this.setState((prevState) => {
        const prevChatSource = prevState.chatSource;
        prevChatSource[invitation.roomId] = room;
        return {
          searchUsers: [],
          chatSource: prevChatSource,
        }
      });

      this.enterMessageRoom({
        id: room.id,
        avatar: this.getUserAvatar(invitation.fromUserId),
        avatarFlexible: true,
        // statusColor: 'lightgreen',
        alt: invitation.fromUserName,
        title: invitation.fromUserName,
        date: new Date(),
        subtitle: '',
        unread: 0,
        dateString: moment(new Date()).format('HH:mm'),
        roomData: room,
      });
    });
  }

  onChatItemClicked(room) {
    // console.log('onChatItemClicked', room);
    this.enterMessageRoom(room);
  }

  onSeachUserClicked(user) {
    const { id: userId, name: userName } = user.userData;
    this.chat.createRoom([userName, this.user.name].join(','), 'private', (roomId) => {
      // console.log('created room', roomId);
      this.chat.inviteUser(userId, roomId);
      // console.log(`invite user ${userName}-${userId} in to chat`);
    });
  }

  onSearchUser(e) {
    const query = e.target.value;
    this.setState({
      searchUserString: query,
    })
    this.chat.getUsersByPrefix(query, null, null, this.maxUserSearchResult, (userListFiltered) => {
      // console.log(userListFiltered);
      if (!query) {
        userListFiltered = [];
      }
      this.setState({
        searchUsers: userListFiltered,
      })
    });
    e.preventDefault();
  }

  enterMessageRoom(room) {
    this.setState({
      chatDetail: room,
      currentMessage: '',
    }, () => {
      this.scrollToBottom();
      this.updateHeaderLeft();
    });
    this.props.setHeaderTitle(Object.keys(room.roomData.froms).filter(userId => (userId !== this.user.id)).map(userId => (room.roomData.froms[userId])).join(', '));
  }

  setCurrentUserName() {
    this.props.setHeaderTitle(this.user.name);
  }

  setUser(userId, userName) {
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

  getListSeachUsersSource(users) {
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

  scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  getUserAvatar(userId) {
    return `data:image/png;base64,${new Identicon(md5(userId)).toString()}`;
  }

  sendMessage(e) {
    const { chatDetail, currentMessage } = this.state;
    if (currentMessage && chatDetail) {
      const { id: roomId } = chatDetail;
      this.chat.sendMessage(roomId, currentMessage, null, () => {
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
    const { searchUsers, searchUserString } = this.state;
    const isInSearchMode = !!searchUserString;
    const chatSource = isInSearchMode ? this.getListSeachUsersSource(searchUsers) : this.getLastMessages();

    return chatSource.length > 0 ? (
      <div>
        <ChatList
          dataSource={chatSource}
          onClick={isInSearchMode ? this.onSeachUserClicked : this.onChatItemClicked}
        />
      </div>
    ) : this.renderEmptyMessage(isInSearchMode ? 'NO RESULT FOUND' : 'NO MESSAGE YET');
  }

  renderBackButton() {
    return (<img src={IconBackBtn} onClick={this.onBackButtonClicked} />)
  }

  renderSearchButton() {
    return (<input type="search" className="rce-search-input" onChange={this.onSearchUser} />)
  }

  renderEmptyMessage(message) {
    return (
      <div className={'no-data'}>
        <p className={'text'}>{message}</p>
      </div>
    )
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
          onKeyDown={(e) => {
            if (e.keyCode == 13) {
              this.sendMessage();
              e.preventDefault();
              return false;
            }
          }}
          onChange={(e) => { this.setState({ currentMessage: e.target.value }); }}
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
