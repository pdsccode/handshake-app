import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { URL } from '@/constants';
// import MultiLanguage from '@/components/core/controls/MultiLanguage';
import meIcon from '@/assets/images/navigation/ic_ninja_logo.svg.raw';
import walletIcon from '@/assets/images/navigation/ic_wallet_white.svg.raw';
import { MasterWallet } from "@/services/Wallets/MasterWallet";
// import predictionIcon from '@/assets/images/categories/chip.svg';

class HeaderBar extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    titleBar: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    titleBar: '',
  };

  state = {
    wallets: [],
  };

  componentDidMount() {
    const wallets = MasterWallet.getMasterWallet();
    this.setState({ wallets });
  }

  me = () => {
    return (
      <Link to={URL.HANDSHAKE_ME_INDEX} className="me-icon">
        <div dangerouslySetInnerHTML={{ __html: meIcon }} />
      </Link>
    );
  };

  wallet = (walletProps) => {
    if (!walletProps) return this.topUp();
    const { balance, name } = walletProps;
    if (!balance) return this.topUp();
    return (
      <Link to={URL.WALLET_EXTENSION} className="wallet">
        <span className="balance">{Number((parseFloat(balance)).toFixed(6))}</span>
        <span className="name">{name}</span>
      </Link>
    );
  };

  topUp = () => {
    return (
      <Link to={URL.WALLET_EXTENSION} className="wallet btn btn-primary">
        <span className="TopUp">Top up</span>
      </Link>
    );
  };

  caption = (title) =>{
    return (
      <Link to={URL.HANDSHAKE_PREDICTION} className="Caption">
        {/* <img src={predictionIcon} alt="" /> */}
        <span>{title}</span>
      </Link>
    );
  };

  buyCrypto = () => {
    return (
      <Link to={URL.BUY_BY_CC_URL} className="BuyCrypto">
        <span>Buy crypto with credit card</span>
      </Link>
    );
  };

  render() {
    const { props, state } = this;
    const { className, titleBar } = props;
    const { pathname } = window.location;

    const { wallets } = state;
    const walletProps = wallets[0];

    return (
      <div className={className}>
        {this.me()}
        {this.caption(titleBar)}
        {/* <MultiLanguage /> */}
        {this.wallet(walletProps)}
        {/* { (pathname === URL.HANDSHAKE_WALLET) && BuyCrypto()} */}
      </div>
    );
  }
}

export default HeaderBar;
