import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import { injectIntl } from 'react-intl';

import { URL } from '@/constants';
import { clearHeaderBack } from '@/reducers/app/action';
import meIcon from '@/assets/images/navigation/ic_private.svg.raw';
import discoverIcon from '@/assets/images/navigation/ic_discover.svg.raw';
import chatIcon from '@/assets/images/navigation/ic_chat.svg.raw';
import walletIcon from '@/assets/images/navigation/ic_wallet.svg.raw';
import createIcon from '@/assets/images/navigation/ic_add.svg.raw';
 
import home_icon from '@/assets/icons/home.svg.raw';
import cam_icon from '@/assets/icons/qa.png';


import { 
  Responsive,  
  Menu,
  Image,
} from 'semantic-ui-react'

class Navigation extends React.Component {
  static propTypes = {
    clearHeaderBack: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired, 
  };

  constructor(props) {
    super(props);

    this.state = {
      currentPath: this.props.location.pathname,
      isNotFound: this.props.app.isNotFound,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.location.pathname !== prevState.currentPath) {
      return { currentPath: nextProps.location.pathname };
    }
    if (nextProps.app.isNotFound !== prevState.isNotFound) {
      return { isNotFound: nextProps.app.isNotFound };
    }
    return null;
  }
 


  checkSelected(_URL) {
    return this.state.currentPath.startsWith(_URL) && !this.state.isNotFound ? 'selected' : '';
  }

  render() { 
    return (
      <Responsive {...Responsive.onlyMobile}>
      <footer className="footer">
        <ul>
          <li className={cn(this.checkSelected(URL.DATA_SET_FEED_MINE_INDEX))}>
            <Link to={URL.DATA_SET_FEED_MINE_INDEX} onClick={this.props.clearHeaderBack}>
              <div className="me-icon" dangerouslySetInnerHTML={{ __html: home_icon }} />
              <span>{this.props.intl.messages.app.navigation.mine}</span>
            </Link>
          </li>
          <li className={cn(this.checkSelected(URL.DATA_SET_DISCOVER_INDEX))}>
            <Link to={URL.DATA_SET_DISCOVER_INDEX} onClick={this.props.clearHeaderBack}>
              <div dangerouslySetInnerHTML={{ __html: discoverIcon }} />
              <span>{this.props.intl.messages.app.navigation.discover}</span>
            </Link>
          </li>
          <li>
            {
              this.props.location.pathname === URL.DATA_SET_UPLOAD_INDEX
              ? (
                <a>
                  {/* <div className="create" dangerouslySetInnerHTML={{ __html: cambtn }} /> */}
                  <Image  className="create" src={cam_icon} />
                </a>
              )
              : (
                <Link to={URL.DATA_SET_UPLOAD_INDEX}>
                  {/* <div className="create" dangerouslySetInnerHTML={{ __html: cambtn }} /> */}
                  <Image  className="create" src={cam_icon} />
                </Link>
              )
            }
          </li>
          <li className={cn(this.checkSelected(URL.DATA_SET_HISTORY_INDEX))}>
            <Link to={URL.DATA_SET_HISTORY_INDEX} onClick={this.props.clearHeaderBack}>
              <div className="chat-icon" dangerouslySetInnerHTML={{ __html: chatIcon }} />
              <span>{this.props.intl.messages.app.navigation.history}</span>
            </Link>
          </li>
          <li className={cn((this.state.currentPath.startsWith(URL.HANDSHAKE_WALLET_INDEX) && !this.state.isNotFound ? 'selected' : ''))}>
            <Link to={URL.HANDSHAKE_WALLET_INDEX} onClick={this.props.clearHeaderBack}>
              <div dangerouslySetInnerHTML={{ __html: walletIcon }} />
              <span>{this.props.intl.messages.app.navigation.wallet}</span>
            </Link>
          </li>
        </ul>
      </footer>
      </Responsive >
    );
  }
}

export default injectIntl(connect(state => ({ app: state.app }), { clearHeaderBack })(Navigation));
