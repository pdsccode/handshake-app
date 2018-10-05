import React from 'react';
import { FormattedDate, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { verifyRedeemCode } from '@/reducers/auth/action';
import Image from '@/components/core/presentation/Image';
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow.svg';
import { referredInfo } from '@/reducers/auth/action';
import { StringHelper } from '@/services/helper';
import './Redeem.scss';
import local from '@/services/localStore';
import { APP } from '@/constants';
import { getReferalInfo } from '@/reducers/exchange/action';
import Modal from '@/components/core/controls/Modal';
import ConfirmButton from '@/components/Wallet/ConfirmButton';

import gitfBox from '@/assets/images/wallet/images/gift-gift-box.svg';
import { MasterWallet } from '@/services/Wallets/MasterWallet';

import ListCoin from '@/components/Wallet/ListCoin';

function changeIconConfirmButton(icon){
  try{
    document.querySelector(".confirm-button .rangeslider__handle").style.backgroundImage = 'url("'+icon+'")';    
  }
  catch (e){}
  
}


class RedeemConfirm extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {      
      redeemCode: this.props.redeemCode || '',
      error: '',
      giftcardValue: 0,
      cryptoValue: "",      
      walletSelected: null,
      listWalletCoin: [],
      contentWalletSelected: '',
      modalListCoin: '',      
      contentConfirmButton: '',
    };    
  }

  componentDidMount(){
    this.getWalletDefault();
  }

  checkRedeemCode=()=>{
    this.props.verifyRedeemCode({
      PATH_URL: 'user/verification/redeem-code/check?code='+this.state.redeemCode,
      METHOD: 'POST',
      successFn: (res) => {        
        if(res){
          this.modalRedeemConfirmRef.open();
        }        
      },
      errorFn: (e) =>{ 
        if (e.message)       
          this.setState({error: e.message});
        else
          console.log(e);
      }
    });
  }

  getWalletDefault = () =>{    

    let support = ["ETH", "BTC", "BCH"];

    let wallets = MasterWallet.getMasterWallet();
    
    // set name + value for list:
    let listWalletCoin = [];
    let walletSelected = this.state.walletSelected;
    
    if (wallets.length > 0){
    
      wallets.forEach((wallet) => {
         if (support.indexOf(wallet.name) != -1){
            wallet.text = wallet.getShortAddress() + " (" + wallet.name + "-" + wallet.getNetworkName() + ")";
            if (process.env.isLive){
              wallet.text = wallet.getShortAddress() + " (" + wallet.className + " " + wallet.name + ")";
            }
            wallet.id = wallet.address + wallet.getNetworkName() + wallet.name;
            listWalletCoin.push(wallet);        
         }          
      });
    }
    
    
    if (listWalletCoin.length > 0){
      walletSelected = listWalletCoin[0];
    }    
    
    this.setState({listWalletCoin: listWalletCoin, walletSelected: walletSelected}, ()=>{
      this.genWalletSelect();
    });

  }

  selectWallet=(wallet)=>{
    this.setState({walletSelected: wallet}, ()=> {    
      this.genWalletSelect();  
      this.modalListCoinRef.close();
    });
  }

  onCloseSelectCoin=()=>{
    this.setState({modalListCoin: ''});
  }

  openListCoin=()=>{
    this.setState({modalListCoin:
      <div className="wallets-wrapper"><ListCoin
        wallets={this.state.listWalletCoin}
        walletSelected={this.state.walletSelected}
        onSelect={wallet => { this.selectWallet(wallet); }}
      /></div>
    }, ()=> {
      this.modalListCoinRef.open();
    });
  }
  
  genWalletSelect=()=>{
    
    const { messages } = this.props.intl;    

    if(this.state.walletSelected){
      let icon = ''; try{ icon = require("@/assets/images/icon/wallet/coins/" + this.state.walletSelected.name.toLowerCase() + '.svg')} catch (ex){};
      
      this.setState({
        contentWalletSelected: 
          <div className="wallet-from" onClick={() => {this.openListCoin() }}>
            <img className="logo" src={icon} alt=""/>
            <span className="re-name"> {this.state.walletSelected.title} </span> <span className="re-address">({this.state.walletSelected.getShortAddress()})</span>
            <img className="arrow-down" src={ExpandArrowSVG} />
          </div>
        , contentConfirmButton: <ConfirmButton onConfirmed={this.onRedeemConfirm} buttonText={messages.wallet.action.redeem.swipe_button_redeem + " " + this.state.walletSelected.name}/>
      }, ()=>{
        changeIconConfirmButton(icon);
      })            
    }
  }


  render() {
    const { messages } = this.props.intl;        
            
    return (                      
        <div className="redeem-page"> 

            <Modal onClose={()=> {this.onCloseSelectCoin();}} title={messages.wallet.action.transfer.placeholder.select_wallet} onRef={modal => this.modalListCoinRef = modal}>
                {this.state.modalListCoin}
            </Modal>

            < div className="titleBox"> 
                <img src={gitfBox} /> 
                <div className="title code">{this.state.redeemCode}</div>                  
            </div>
            <div><span>{messages.wallet.action.redeem.giftcard}:</span> <span>${this.state.giftcardValue}</span></div>         
            <div><span>{messages.wallet.action.redeem.value}:</span> <span>{this.state.cryptoValue}</span></div>         

            {/* wallet receive  */}
            {this.state.contentWalletSelected}

            <div className="term">
              {messages.wallet.action.redeem.agree_text}
            </div>
            <div className="buttonRedeem">              
              {this.state.contentConfirmButton}
            </div>
        </div>       
    );
  }
}

const mapStateToProps = (state) => ({
  referalInfo: state.exchange.referalInfo,
});

const mapDispatchToProps = (dispatch) => ({  
  verifyRedeemCode: bindActionCreators(verifyRedeemCode, dispatch),   
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(RedeemConfirm));
