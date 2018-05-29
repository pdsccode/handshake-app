import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// service, constant
import { load } from '@/reducers/discover/action';
// components
import { Grid, Row, Col } from 'react-bootstrap';
import Button from '@/components/core/controls/Button';
import { handShakeList } from '@/data/shake.js';
import {MasterWallet} from '@/models/MasterWallet'
import Input from '@/components/core/forms/Input/Input';

import dontIcon from '@/assets/images/icon/3-dot-icon.svg';
import iconSafe from '@/assets/images/icon/icon-safe.svg';
import iconWarning from '@/assets/images/icon/icon-warning.svg';
import Header from './Header';
import HeaderMore from './HeaderMore';
import WalletItem from './WalletItem';
import ReactBottomsheet from 'react-bottomsheet';
// var ReactBottomsheet = require('react-bottomsheet');
import { setHeaderRight } from '@/reducers/app/action';

// style
import './Wallet.scss';
import { Bitcoin } from '@/models/Bitcoin';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Modal from '@/components/core/controls/Modal';

import createForm from '@/components/core/form/createForm';
import { required } from '@/components/core/form/validation';
import { Field } from "redux-form";
import { initHandshake } from '@/reducers/handshake/action';

const nameFormSendWallet = 'sendWallet';
const SendWalletForm = createForm({
  propsReduxForm: {
    form: nameFormSendWallet,
  },
});

class Wallet extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      data: {},
      isLoading: false,
      error: null,
      listMainWalletBalance: [],
      listTestWalletBalance: [],
      listRewardWalletBalance: [],
      bottomSheet: false,
      listMenu: [],
      walletNeedRemove: null,
      walletSend: null
    };
    this.props.setHeaderRight(this.headerRight());    
  }

  headerRight() {
    return (<HeaderMore onHeaderMoreClick={this.onIconRightHeaderClick} />);
  }

  splitWalletData(listWallet){

    let listMainWallet = [];
    let listTestWallet = [];
    let listRewardWallet = [];

    listWallet.forEach(wallet => {
      // is reward wallet:
      if (wallet.isReward){        
        listRewardWallet.push(wallet);
      }
      // is Mainnet
      else if (wallet.network === MasterWallet.ListCoin[wallet.className].Network.Mainnet){        
        listMainWallet.push(wallet);
      }
      else{
        // is Testnet        
        listTestWallet.push(wallet);
      }
    });

    this.setState({isLoading: true, listMainWalletBalance: listMainWallet, listTestWalletBalance: listTestWallet, listRewardWalletBalance: listRewardWallet});
  }

   async componentDidMount() {

    // console.log('getWalletDefault()', MasterWallet.getWalletDefault());

    let listWallet = await MasterWallet.getMasterWallet();

    if (listWallet == false){
      listWallet = await MasterWallet.createMasterWallet();
    }
     /*var btc = new Bitcoin();
     var tx = await btc.transfer("tprv8ccSMiuz5MfvmYHzdMbz3pjn5uW3G8zxM975sv4MxSGkvAutv54raKHiinLsxW5E4UjyfVhCz6adExCmkt7GjC41cYxbNxt5ZqyJBdJmqPA","mrPJ6rBHpJGnsLK3JGfJQjdm5vkjeAb63M", 0.0001);

     console.log(tx)*/

     await this.splitWalletData(listWallet)

     await this.getListBalace();
  }

  getAllWallet(){
    return this.state.listMainWalletBalance.concat(this.state.listTestWalletBalance).concat(this.state.listRewardWalletBalance);
  }

  async getListBalace() {

    let listWallet = this.getAllWallet();

    const pros = []

    listWallet.forEach(wallet => {
      pros.push(new Promise((resolve, reject) => {
        wallet.getBalance().then(balance => {
          wallet.balance = balance;
          resolve(wallet);
        })
      }));
    });

    await Promise.all(pros);

    await this.splitWalletData(listWallet);


    // var btcTestnet = new Bitcoin(Bitcoin.Network.Testnet);
    // var balance = await btcTestnet.getBalance("n1MZwXhWs1unyuG6qNbEZRZV4qjzd3ZMyz");
    // console.log("btcTestnet", balance);

    // var ethRinkeby = new Ethereum (Ethereum.Network.Rinkeby);
    // balance = await ethRinkeby.getBalance("0xe70adf9aE4d5F68E80A8E2C5EA3B916Dd49C6D87");
    // console.log("ethRinkeby", balance);
  }

  toggleBottomSheet () {
    let obj = (this.state.bottomSheet) ? { 'bottomSheet': false } : { 'bottomSheet': true }
    this.setState(obj)
  }  

  copyToClipboard =(text) => {
    var textField = document.createElement('textarea')
    textField.innerText = text
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }
  
  // create list menu of wallet item when click Show more ...
  creatSheetMenuItem(wallet){
    let obj = [];
      obj.push({
        title: 'Send',
        handler: () => {
          this.setState({walletSend: wallet});          
          this.modalBetRef.open();   
          this.toggleBottomSheet();   
        }
      })
      obj.push({
        title: 'Fill up',
        handler: () => {

        }
      })
      obj.push({
        title: 'Protected your coin',
        handler: () => {

        }
      })
      obj.push({
        title: 'Transaction history',
        handler: () => {

        }
      })
      obj.push({
        title: 'Copy address',
        handler: () => {
          this.copyToClipboard(wallet.address);
          this.toggleBottomSheet(); 
        }
      })

      obj.push({
        title: 'Make it default ' + (wallet.default ? "✓ " : ""),
        handler: () => {          
          wallet.default = !wallet.default;    
          this.toggleBottomSheet(); 
          // reset all wallet defaul:
          let lstWalletTemp = this.getAllWallet();
          if (wallet.default) lstWalletTemp.forEach(wal => {if (wal != wallet){wal.default = false;}})          
          // Update wallet master from local store:
          MasterWallet.UpdateLocalStore(lstWalletTemp);
        }
      })
      obj.push({
        title: 'Remove',
        handler: () => {
          this.setState({walletNeedRemove: wallet});          
          this.modalBetRef.open();   
          this.toggleBottomSheet();   
        }
      })

      return obj;
  }

  // Remove wallet function:
  removeWallet = () =>{
    let lstWalletTemp = this.getAllWallet();
    var index = -1;
    var walletTmp = this.state.walletNeedRemove;
    if (walletTmp != null){
        // Find index for this item:
        lstWalletTemp.forEach(function (wal, i) {if (wal === walletTmp){index = i}});   
        // Remove item:
        if (index > -1) {
          lstWalletTemp.splice(index, 1)
          // Update wallet master from local store:
          MasterWallet.UpdateLocalStore(lstWalletTemp);
          this.splitWalletData(lstWalletTemp);
        };       
    }    
    this.modalBetRef.close();     

  }

  sendWallet = () =>{
    
    this.modalBetRef.close();     

  }

  // Menu for Right header bar
  creatSheetMenuHeaderMore(){
    let obj = [];
    obj.push({
      title: "Add new",
      handler: () => {

      }
    })
    obj.push({
      title: 'Export wallets',
      handler: () => {

      }
    })
    obj.push({
      title: 'Restore wallets',
      handler: () => {

      }
    })
    return obj;
  }

  onIconRightHeaderClick = () =>{
    this.setState({listMenu: this.creatSheetMenuHeaderMore()})
    this.toggleBottomSheet();

  }

  onMoreClick = (wallet) => {
    this.setState({listMenu: this.creatSheetMenuItem(wallet)})
    this.toggleBottomSheet();
  }
  onWarningClick = (wallet) => {
    alert("onWarningClick ->" + wallet.address);
  }

  get listMainWalletBalance() {
    return this.state.listMainWalletBalance.map((wallet) => {
      return <WalletItem wallet={wallet} onMoreClick={() => this.onMoreClick(wallet)} onWarningClick={() => this.onWarningClick(wallet)} />
    });
  }
  get listTestWalletBalance() {
    return this.state.listTestWalletBalance.map((wallet) => {
      return <WalletItem wallet={wallet} onMoreClick={() => this.onMoreClick(wallet)} onWarningClick={() => this.onWarningClick(wallet)} />
    });
  }

  get listRewardWalletBalance(){
    return this.state.listRewardWalletBalance.map((wallet) => {
      return <WalletItem wallet={wallet} onMoreClick={() => this.onMoreClick(wallet)} onWarningClick={() => this.onWarningClick(wallet)} />
    });
  }

  render() {

    return (

      <Grid>
        <ReactBottomsheet
          visible={this.state.bottomSheet}
          onClose={this.toggleBottomSheet.bind(this)}
          list={this.state.listMenu} />
        
        <ModalDialog title="Confirmation" onRef={modal => this.modalBetRef = modal}>
          <div><span>Are you sure to want to remove this wallet?</span></div>
          <div className='bodyConfirm'>
            <Button className="left" type="primary" cssType="primary" onClick={this.removeWallet} >Yes, remove</Button>
            <Button className="right" type="warning" cssType="warning" onClick={() => { this.modalBetRef.close(); }}>No</Button>
          </div>
        </ModalDialog>
        <Modal title="Send" onRef={modal => this.modalBetRef = modal}>
          <SendWalletForm className="sendwallet-wrapper" onSubmit={this.onSubmit}>
            <Input name="to_ddress" placeholder="To address"></Input>
            <Input name="amount" placeholder="Amount (BTC)" type="tel"></Input>
            <Button type="submit" block={true}>Send</Button>
          </SendWalletForm>
        </Modal>
        <Row className="list">
          <Header title="Main net wallets" hasLink={false} linkTitle="+ Add new" onLinkClick={this.onLinkClick} />
        </Row>
        <Row className="list">
          {this.listMainWalletBalance}
        </Row>
        <Row className="list">
          <Header title="Test net wallets" hasLink={false} />
        </Row>
        <Row className="list">
          {this.listTestWalletBalance}
        </Row>

        <Row className="list">
          <Header title="Reward wallets" hasLink={false} />
        </Row>
        <Row className="list">
          {this.listRewardWalletBalance}
        </Row>

      </Grid>
    );
  }

}

Wallet.propTypes = {
  discover: PropTypes.object,
  load: PropTypes.func
};

const mapState = (state) => ({
  discover: state.discover,
});

const mapDispatch = ({
  setHeaderRight
});

export default connect(mapState, mapDispatch)(Wallet);