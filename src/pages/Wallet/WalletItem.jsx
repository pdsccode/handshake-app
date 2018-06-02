import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';

import dontIcon from '@/assets/images/icon/3-dot-icon.svg';
import iconSafe from '@/assets/images/icon/icon-safe.svg';
import iconWarning from '@/assets/images/icon/icon-warning.svg';

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
  }

  async componentWillMount() {
    const balance = await this.state.wallet.getBalance();
    this.setState({ balance, isFetchedBalance: true });
  }

  onMoreClick() {
    alert('click more');
  }

  onWarningClick() {
    alert('click warning');
  }

  getBgClass() {
    const { blockchain } = this.state.wallet;

    if (blockchain.isTest) {
      return 'feed testnet-wallet-bg';
    }

    if (blockchain.isBTC) {
      return 'feed btc-wallet-bg';
    }

    if (blockchain.isERC20) {
      return 'feed eth-wallet-bg';
    }

    if (blockchain.isXRP) {
      return 'feed xrp-wallet-bg';
    }

    return 'feed testnet-wallet-bg';
  }

  render() {
    const { wallet, blockchain } = this.state.wallet;

    const iconProtected = !wallet.isProtected ? iconWarning : iconSafe;
    return (
      <Col sm={6} md={6} xs={6} key={this.state.wallet.getAppKed()} className="feed-wrapper">
        <div className={this.getBgClass()}>
          <p className="name">{blockchain.name}</p>
          <p className="balance">{(this.state.isFetchedBalance) ? this.state.balance : '...'} {blockchain.unit}</p>
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
          <p className="address">{this.state.wallet.getShortAddress()}</p>
        </div>
      </Col>
    );
  }
}

export default WalletItem;
