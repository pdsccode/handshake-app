import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { URL } from '@/config';
import { clearHeaderBack } from '@/reducers/app/action';

class Navigation extends React.Component {
  static propTypes = {
    clearHeaderBack: PropTypes.func.isRequired,
  };

  render() {
    return (
      <footer className="footer">
        <ul>
          <li>
            <Link to={URL.HANDSHAKE_ME_INDEX} onClick={this.props.clearHeaderBack}>
              <div dangerouslySetInnerHTML={{__html: require(`@/assets/images/navigation/ic_private.svg.raw`) }}/>
              <label>Me</label>
            </Link>
          </li>
          <li>
            <Link to={URL.HANDSHAKE_DISCOVER_INDEX} onClick={this.props.clearHeaderBack}>
              <div dangerouslySetInnerHTML={{__html: require(`@/assets/images/navigation/ic_discover.svg.raw`) }}/>
              <label>Discover</label>
            </Link>
          </li>
          <li>
            <Link to={URL.HANDSHAKE_CREATE_INDEX}>
              <div className="create" dangerouslySetInnerHTML={{__html: require(`@/assets/images/navigation/ic_add.svg.raw`) }}/>
            </Link>
          </li>
          <li>
            <Link to={URL.HANDSHAKE_CHAT_INDEX} onClick={this.props.clearHeaderBack}>
              <div dangerouslySetInnerHTML={{__html: require(`@/assets/images/navigation/ic_chat.svg.raw`) }}/>
              <label>Chat</label>
            </Link>
          </li>
          <li>
            <Link to={URL.HANDSHAKE_WALLET_INDEX} onClick={this.props.clearHeaderBack}>
              <div dangerouslySetInnerHTML={{__html: require(`@/assets/images/navigation/ic_wallet.svg.raw`) }}/>
              <label>Wallet</label>
            </Link>
          </li>
        </ul>
      </footer>
    );
  }
}

export default connect(null, ({ clearHeaderBack }))(Navigation);
