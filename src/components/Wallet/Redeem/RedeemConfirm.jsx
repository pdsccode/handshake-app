import React from 'react';
import { FormattedDate, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { hideLoading, showAlert, showLoading } from '@/reducers/app/action';
import Image from '@/components/core/presentation/Image';
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow.svg';
import { referredInfo } from '@/reducers/auth/action';
import { StringHelper } from '@/services/helper';
import './Redeem.scss';
import local from '@/services/localStore';
import { APP } from '@/constants';
import { getReferalInfo } from '@/reducers/exchange/action';
import { shortenUser } from '@/services/offer-util';
import Button from '@/components/core/controls/Button';
import Input from '../Input';
import ConfirmButton from '@/components/Wallet/ConfirmButton';

import gitfBox from '@/assets/images/wallet/images/gift-gift-box.svg';
import iconArrowDown from '@/assets/images/icon/expand-arrow.svg';

import ListCoin from '@/components/Wallet/ListCoin';
import Modal from '@/components/core/controls/Modal';

class Redeem extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {

      giftcardValue: 0,
      cryptoValue: "",

      code: '',
      isLoading: false,

      walletSelected: false,
      modalListCoin: '',
    };
  }


  showAlert(msg, type = 'success', timeOut = 3000, icon = '') {
    this.props.showAlert({
      message: <div className="textCenter">{icon}{msg}</div>,
      timeOut,
      type,
      callBack: () => {
      },
    });
  }

  showToast(mst) {
    this.showAlert(mst, 'primary', 3000);
  }

  showLoading(status) {
    this.props.showLoading({ message: '' });
  }

  hideLoading() {
    this.props.hideLoading();
  }

  showLoading = () => {
    this.props.showLoading({ message: '' });
  }

  hideLoading = () => {
    this.props.hideLoading();
  }

  handleNameChange =(value)=>{
    this.setState({code: value});
  }

  onRedeemConfirm=()=>{

  }
  openListCoin=()=>{
    this.setState({modalListCoin:
      <ListCoin
        wallets={this.state.wallets}
        walletSelected={this.state.walletSelected}
        onSelect={wallet => { this.selectWallet(wallet); }}
      />
    }, ()=> {
      this.modalListCoinRef.open();
    });
  }
  selectWallet = async (walletSelected) => {

    this.setState({walletSelected, modalListCoin: ''}, ()=> {      
      this.modalListCoinRef.close();
    });
  
    if(walletSelected.name != this.state.currency){
      await this.setRate(walletSelected.name);      
    }
  }
  

  get showWallet(){
    const walletSelected = this.state.walletSelected;
    let icon = '';
    try{
      if(walletSelected)
        icon = require("@/assets/images/icon/wallet/coins/" + walletSelected.name.toLowerCase() + '.svg');
    } catch (ex){console.log(ex)};
    return (
      <div className="walletSelected" onClick={() => {this.openListCoin() }}>
        <div className="row">
          <div className="col-2 icon"><img src={icon} /></div>
          <div className="col-5">
            <div className="name">{walletSelected && walletSelected.title}</div>
            <div className="address">{walletSelected && walletSelected.getShortAddress()}</div>
          </div>
          <div className="col-5 lastCol">
            <div className="balance">{walletSelected && walletSelected.balance + " " + walletSelected.name}</div>
            <div className="arrow"><img src={iconArrowDown} /></div>
          </div>
        </div>
      </div>);
  }


  render() {
    const { messages } = this.props.intl;
    const { referalInfo } = this.props;

    return (
     <div className="redeem-page">        
        <div className="title">
          <img src={gitfBox} /> 
          <div>{messages.wallet.action.redeem.title}</div>
        </div>
        <div className="body">
            <div>
              <Input required placeholder={messages.wallet.action.redeem.your_code} maxLength="40" value={this.state.code} onChange={(value) => {this.handleNameChange(value)}} /> 
            </div>         
            <div><span>{messages.wallet.action.redeem.giftcard}:</span> <span>${this.state.giftcardValue}</span></div>         
            <div><span>{messages.wallet.action.redeem.value}:</span> <span>{this.state.cryptoValue}</span></div>         
            
            <div className ="dropdown-wallet-tranfer ">
              <p className="labelText">{messages.wallet.action.transfer.label.from_wallet}</p>
              {this.showWallet}

              <div className="wallets-wrapper">
                <Modal title={messages.wallet.action.transfer.placeholder.select_wallet} onRef={modal => this.modalListCoinRef = modal}>
                  {this.state.modalListCoin}
                </Modal>
              </div>


            </div>
            
            <div className="term">
              {messages.wallet.action.redeem.agree_text}
            </div>
            <div className="buttonRedeem">              
              <ConfirmButton onConfirmed={this.onRedeemConfirm} buttonText={messages.wallet.action.redeem.swipe_button_redeem}/>
            </div>
            <div className="findcode">
              <a href="#">
                {messages.wallet.action.redeem.find_code}
              </a>
            
            </div>
        </div>
     </div>
    );
  }
}

const mapStateToProps = (state) => ({
  referalInfo: state.exchange.referalInfo,
});

const mapDispatchToProps = (dispatch) => ({
  showAlert: bindActionCreators(showAlert, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),  
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Redeem));
