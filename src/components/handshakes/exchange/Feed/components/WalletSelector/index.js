/* eslint camelcase:0 */
import React, { Component } from 'react';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import PropTypes from 'prop-types';
import {
  CRYPTO_CURRENCY,
  CRYPTO_CURRENCY_NAME,
} from '@/constants';

export default class WalletSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wallets: [],
      walletSelected: '',
    };
  }

  componentDidMount() {
    this.getListWallets();
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.walletSelectorType !== this.props.walletSelectorType) {
      this.updateWalletDefault(nextProps.walletSelectorType);
    }
  }

  onChange = (e) => {
    const address = e?.target?.value;
    this.changeWalletAddress(address);
  }

  getListWallets = async () => {
    try {
      const wallets = MasterWallet.getMasterWallet();
      this.setState({ wallets });
    } catch (e) {
      console.warn('updateWalletDefault', e);
    }
  }

  updateWalletDefault = async (currency) => {
    try {
      const walletDefault = await MasterWallet.getWalletDefault(currency);
      console.log(walletDefault)
      this.changeWalletAddress(walletDefault?.address);
    } catch (e) {
      console.warn('updateWalletDefault', e);
    }
  }

  shortIt = (str = '') => {
    return `${str.substr(3, 8)}...${str.substr(-10)}`;
  }

  changeWalletAddress = (address) => {
    this.setState({ walletSelected: address }, () => {
      const { onWalletChange } = this.props;
      if (typeof onWalletChange === 'function') {
        onWalletChange(address);
      }
    });
  }

  renderWallets = () => {
    const { wallets } = this.state;
    return (
      <React.Fragment>
        {wallets.map(wallet => {
          if (!wallet) return null;
          const { address, name } = wallet;
          return (
            <option key={address} value={address}>{`${name} - ${this.shortIt(address)}`}</option>
          );
        })}
        {wallets.length === 0 && <option value="">You have no wallet yet.</option>}
      </React.Fragment>
    );
  }

  render() {
    const { walletSelected } = this.state;
    return (
      <div>
        <select className="form-control" onChange={this.onChange} value={walletSelected}>
          {this.renderWallets()}
        </select>
      </div>
    );
  }
}

WalletSelector.defaultProps = {
  onWalletChange: () => {},
  walletSelectorType: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.BTC],
};

WalletSelector.propTypes = {
  onWalletChange: PropTypes.func,
  walletSelectorType: PropTypes.string,
};
