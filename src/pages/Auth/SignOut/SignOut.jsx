import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { signOut } from '@/reducers/auth/action';
import { URL, AUTH } from '@/config';
import { draft } from '@/pages/Business/Application/util';

class SignOut extends Component {
  static propTypes = {
    signOut: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    draft.remove();
    this.props.signOut(AUTH.BUSINESS);
    this.props.history.push(URL.BUSINESS.SIGN_IN);
  }

  render() {
    return (<div></div>);
  }
}

const mapState = (state) => ({});

const mapDispatch = {
  signOut,
};

export default connect(mapState, mapDispatch)(SignOut);
