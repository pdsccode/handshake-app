import React, { Component } from 'react';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import PropTypes from 'prop-types';

export default class WalletSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wallets: [],
      walletSelected: null,
    };
  }

  componentDidMount() {
    this.getListWallets();
  }

  onChange = (e) => {
    const address = e?.target?.value;
    this.changeWalletAddress(address);
  }

  getListWallets = async () => {
    const currency = 'ETH';
    const walletDefault = await MasterWallet.getWalletDefault(currency);
    const wallets = MasterWallet.getMasterWallet();
    this.changeWalletAddress(walletDefault?.address);
    this.setState({ wallets });
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
            <option key={address} value={address}>{`${name} - ${address}`}</option>
          );
        })}
      </React.Fragment>
    );
  }

  render() {
    const { walletSelected } = this.state;
    return (
      <div>
        <select className="form-control" onChange={this.onChange} value={walletSelected}>
          <option>Select wallet</option>
          {this.renderWallets()}
        </select>
      </div>
    );
  }
}

WalletSelector.defaultProps = {
  onWalletChange: () => {},
};

WalletSelector.propTypes = {
  onWalletChange: PropTypes.func,
};
