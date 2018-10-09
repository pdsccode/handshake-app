import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirebase } from 'react-redux-firebase';
// contants
// actions
import { setFirebaseUser } from '@/reducers/app/action';
import { authUpdate } from '@/reducers/auth/action';
// components
import Loading from '@/components/core/presentation/Loading';
import Router from '@/components/Router/Router';
// chat
import md5 from 'md5';
import { isEmpty } from '@/utils/is';

class Handle extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    firebase: PropTypes.object.isRequired,
    authUpdate: PropTypes.func.isRequired,
    setFirebaseUser: PropTypes.func.isRequired,
    firebaseApp: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.firebase = ::this.firebase;
    this.notification = ::this.notification;

    this.state = {
      auth: this.props.auth,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.firebase();
    this.notification();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.auth.updatedAt !== prevState.auth.updatedAt) {
      return { auth: nextProps.auth };
    }
    return null;
  }

  firebase() {
    //console.log('app - handle - core - firebase');
    this.props.firebase.watchEvent('value', `/users/${this.state.auth.profile.id}`);
    this.props.firebase.watchEvent('value', `/config`);
  }

  signInFirebase(cb) {
    const { profile, token } = this.props.auth;
    if (isEmpty(profile) || isEmpty(token)) {
      setTimeout(() => {
        this.signInFirebase(cb);
      }, 100);
      return;
    }
    console.log('token', token, 'profile_id', profile.id);
    const username = `${md5(`${token}_${profile.id}`)}@handshake.autonomous.nyc`;
    const password = md5(token);

    this.props.firebase.auth().signOut().then(() => {
      this.props.firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          if (cb) {
            cb(user);
          }
        }
      });
      this.props.firebase.auth()
        .signInWithEmailAndPassword(username, password)
        .catch(() => {
          this.props.firebase.auth().createUserWithEmailAndPassword(username, password);
        });
    });
  }

  notification() {
    //console.log('app - handle - core - notification');
    try {
      const messaging = this.props.firebase.messaging();
      messaging
        .requestPermission()
        .then(() => messaging.getToken())
        .catch(e => console.log(e))
        .then((notificationToken) => {
          if (notificationToken) {
            const data = new FormData();
            data.append('fcm_token', notificationToken);
            this.props.authUpdate({
              PATH_URL: 'user/profile',
              data,
              METHOD: 'POST',
            });
          }
        })
        .catch(e => console.log(e));
    } catch (e) {
      console.log(e);
    }
    this.setState({ isLoading: false });
  }

  render() {
    if (this.state.isLoading) {
      return <Loading message={this.state.loadingText} />;
    }
    return (
      <Router />
    );
  }
}

export default compose(withFirebase, connect(state => ({
  auth: state.auth,
  app: state.app,
  firebaseApp: state.firebase,
}), {
  authUpdate,
  setFirebaseUser,
}))(Handle);
