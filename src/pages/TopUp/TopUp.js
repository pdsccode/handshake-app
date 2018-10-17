import React from 'react';
import PropTypes from 'prop-types';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import { Wallet } from '@/services/Wallets/Wallet';

import './TopUp.scss';

class TopUp extends React.Component {
  static propTypes = {
    balance: PropTypes.number,
    name: PropTypes.string,
  };

  static defaultProps = {
    balance: null,
    name: null,
  };

  state = {
    wallets: [],
  };

  componentDidMount() {
    const wallets = MasterWallet.getMasterWallet();
    this.setState({ wallets });
  }

  balance = (props) => {
    const { balance, name } = props || { balance: 0, name: 'ETH'};
    return (
      <div className="TopUpCard BalanceCard">
        <div className="Label">Your balance</div>
        <div className="Value">
          <span className="Number">{Number((parseFloat(balance)).toFixed(8))}</span>
          <span className="Unit">{name}</span>
        </div>
      </div>
    );
  };

  howTo = () => {
    return (
      <div className="TopUpCard HowToCard">
        <div className="Quest">How to top up?</div>
        <div className="Describe">Send ETH to your ninja prediction wallet address</div>
        <div className="WalletAddress">
          <span className="Address">0xc0ffee254729296a45a3885639</span>
          <span className="HelpIcon">?</span>
        </div>
      </div>
    );
  };

  render() {
    const { wallets } = this.state;
    const walletProps = wallets[0];
    return (
      <div className="TopUpContainer">
        { this.balance(walletProps) }
        { this.howTo() }
      </div>
    );
  }
}

export default TopUp;
