import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';

import dontIcon from '@/assets/images/icon/3-dot-icon.svg';
import iconSafe from '@/assets/images/icon/icon-safe.svg';
import iconWarning from '@/assets/images/icon/icon-warning.svg';
import iconChecked from '@/assets/images/icon/icon-checked.svg';
import iconQRCode from '@/assets/images/icon/icon-qr-code.png';

import './Wallet.scss';

class WalletItem extends React.Component {
  static propTypes = {
    wallet: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      wallet: this.props.wallet.action,
      balance: 0,
      isFetchedBalance: false,
    };

    this.getBgClass = ::this.getBgClass;
    this.onMoreClickDo = ::this.onMoreClickDo;
    this.onMoreClick = ::this.onMoreClick;
    this.onWarningClickDo = ::this.onWarningClickDo;
    this.onWarningClick = ::this.onWarningClick;
    this.onAddressClickDo = ::this.onAddressClickDo;
    this.onAddressClick = ::this.onAddressClick;
  }

  async componentWillMount() {
    const balance = await this.state.wallet.getBalance();
    this.setState({ balance, isFetchedBalance: true });
  }

  onMoreClickDo() {
    alert('click more');
  }

  onMoreClick(e) {
    if (e.keyCode) {
      if (e.keyCode === 13) {
        this.onMoreClickDo();
      }
    } else {
      this.onMoreClickDo();
    }
  }

  onWarningClickDo() {
    alert('click warning');
  }

  onWarningClick(e) {
    if (e.keyCode) {
      if (e.keyCode === 13) {
        this.onWarningClickDo();
      }
    } else {
      this.onWarningClickDo();
    }
  }

  onAddressClickDo() {
    alert('click warning');
  }

  onAddressClick(e) {
    if (e.keyCode) {
      if (e.keyCode === 13) {
        this.onWarningClickDo();
      }
    } else {
      this.onWarningClickDo();
    }
  }

  getBgClass() {
    const { wallet } = this.state.wallet;

    if (wallet.isTest) {
      return 'feed testnet-wallet-bg';
    }

    if (wallet.isBTC) {
      return 'feed btc-wallet-bg';
    }

    if (wallet.isERC20) {
      return 'feed eth-wallet-bg';
    }

    if (wallet.isXRP) {
      return 'feed xrp-wallet-bg';
    }

    return 'feed testnet-wallet-bg';
  }

  render() {
    const { wallet: walletAction } = this.state;
    const { wallet, blockchain } = this.state.wallet;

    const iconProtected = !wallet.isProtected ? iconWarning : iconSafe;

    return (
      <Col sm={6} md={6} xs={6} key={walletAction.getAppKed()} className="feed-wrapper">
        <div className={this.getBgClass()}>
          <p className="name">
            {blockchain.name}
            {wallet.isDefault ? <img className="iconDefault" src={iconChecked} alt="" /> : ''}
          </p>
          <p className="balance">
            {(this.state.isFetchedBalance) ? this.state.balance : '...'} {blockchain.unit}
          </p>
          <div
            className="more"
            role="button"
            tabIndex="0"
            onClick={this.onMoreClick}
            onKeyDown={this.onMoreClick}
          >
            <img alt="" src={dontIcon} />
          </div>
          <div
            className="safe"
            role="button"
            tabIndex="0"
            onClick={this.onWarningClick}
            onKeyDown={this.onWarningClick}
          >
            <img alt="" src={iconProtected} />
          </div>
          <span
            className="address"
            onClick={this.onAddressClick}
            onKeyDown={this.onAddressClick}
            role="link"
            tabIndex="0"
          >
            <img src={iconQRCode} alt="" />{walletAction.getShortAddress()}
          </span>
        </div>
      </Col>
    );
  }
}

export default WalletItem;
