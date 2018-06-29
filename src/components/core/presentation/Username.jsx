import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'redux';
import { showAlert } from '@/reducers/app/action';

class Username extends React.PureComponent {
  static propTypes = {
    username: PropTypes.any.isRequired,
    showAlert: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { username: this.props.username?.toString() };
    this.state.username = this.walletAddressHandle(this.state.username);

    this.clickToCopy = ::this.clickToCopy;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.username !== prevState.username) {
      return { username: this.walletAddressHandle(nextProps.username) };
    }
    return null;
  }

  walletAddressHandle(address) {
    if ((address.startsWith('0x') && address.length === 42) || address.length === 34 || address.length >= 20) {
      return `${address.substr(0, 5)}...${address.substr(-5)}`;
    }
    return address;
  }

  clickToCopy() {
    this.props.showAlert({
      message: 'Copied to clipboard!',
      timeOut: false,
      isShowClose: true,
      type: 'success',
      callBack: () => {},
    });
  }

  render() {
    return <span onClick={this.clickToCopy}>{this.state.username}</span>;
  }
}

export default connect(null, ({ showAlert }))(Username);
