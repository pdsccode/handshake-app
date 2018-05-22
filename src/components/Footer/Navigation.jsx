import React from 'react';
import { Link } from 'react-router-dom';
import { URL } from '@/config';

class Navigation extends React.Component {
  render() {
    return (
      <footer className="footer">
        <ul>
          <li><Link to={URL.HANDSHAKE_ME_INDEX}>Me</Link></li>
          <li><Link to={URL.HANDSHAKE_DISCOVER_INDEX}>Discover</Link></li>
          <li><Link to={URL.HANDSHAKE_CREATE_INDEX}>Create</Link></li>
          <li><Link to={URL.HANDSHAKE_CHAT_INDEX}>Chat</Link></li>
          <li><Link to={URL.HANDSHAKE_WALLET_INDEX}>Wallet</Link></li>
        </ul>
      </footer>
    );
  }
}

export default Navigation;
