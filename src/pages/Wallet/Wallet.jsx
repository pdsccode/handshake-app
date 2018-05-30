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

window.Clipboard = (function(window, document, navigator) { var textArea, copy; function isOS() { return navigator.userAgent.match(/ipad|iphone/i); } function createTextArea(text) { textArea = document.createElement('textArea'); textArea.value = text; document.body.appendChild(textArea); } function selectText() { var range, selection; if (isOS()) { range = document.createRange(); range.selectNodeContents(textArea); selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); textArea.setSelectionRange(0, 999999); } else { textArea.select(); } } function copyToClipboard() { document.execCommand('copy'); document.body.removeChild(textArea); } copy = function(text) { createTextArea(text); selectText(); copyToClipboard(); }; return { copy: copy }; })(window, document, navigator);

const nameFormSendWallet = 'sendWallet';
const SendWalletForm = createForm({ propsReduxForm: { form: nameFormSendWallet }});

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
      walletSelected: null,      
      inputSendValue: '',
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

     // fill data:
     await this.splitWalletData(listWallet)

     // update balance for lst wallet:
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
          this.setState({walletSelected: wallet});
          this.toggleBottomSheet();
          this.modalSendRef.open();      
        }
      })
      
      obj.push({
        title: 'Fill up',
        handler: () => {
          this.setState({walletSelected: wallet});
          this.toggleBottomSheet();
          this.modalFillRef.open();    
        }
      })

      obj.push({
        title: 'Protected this wallet',
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
          Clipboard.copy(wallet.address);
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
      if (!wallet.isReward)
        obj.push({
          title: 'Remove',
          handler: () => {
            this.setState({walletSelected: wallet});          
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
    var walletTmp = this.state.walletSelected;
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

  sendCoin = () =>{
    if (this.state.inputAddressAmountValue == '')
      alert("Please input to address");
    else if (this.state.inputSendAmountValue == '' || this.state.inputSendAmountValue == 0)
      alert("Please input Amount value");
    else{
      
    this.state.walletSelected.transfer(this.state.inputAddressAmountValue, this.state.inputSendAmountValue).then(success => {
          alert(success);
          this.modalSendRef.close();
      })
    }
  }

  fillWallet = () =>{

  }

  updateSendAmountValue = (evt) => {
    this.setState({
      inputSendAmountValue: evt.target.value
    });
  }
  updateSendAddressValue = (evt) => {
    this.setState({
      inputAddressAmountValue: evt.target.value
    });
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
            <Button className="left" cssType="danger" onClick={this.removeWallet} >Yes</Button>
            <Button className="right" cssType="info" onClick={() => { this.modalBetRef.close(); }}>No</Button>
          </div>
        </ModalDialog>
        
        <Modal title="Send" onRef={modal => this.modalSendRef = modal}>
          <SendWalletForm className="sendwallet-wrapper" onSubmit={this.sendCoin}>
            <Input name="to_address" placeholder="To address" required
              onChange={evt => this.updateSendAddressValue(evt)} 
              Value={ this.state.walletSelected ? this.state.walletSelected.address : "" }
              />
            <Input name="amount" type="tel" required
              placeholder={ this.state.walletSelected ? "Amount ({0})".format(this.state.walletSelected.name) : "Amount "} 
              onChange={evt => this.updateSendAmountValue(evt)}
              />
            <Button type="submit" block={true}>Send</Button>
          </SendWalletForm>
        </Modal>

        <Modal title="Fill up" onRef={modal => this.modalFillRef = modal}>
          <SendWalletForm className="fillwallet-wrapper" onSubmit={this.fillWallet}>
            <Input name="amount" type="tel" required
              placeholder={ this.state.walletSelected ? "Amount ({0})".format(this.state.walletSelected.name) : "Amount "} 
              onChange={evt => this.updateSendAmountValue(evt)}
              />
            <Input name="fillup" placeholder="Equal to (USD)" required
              onChange={evt => this.updateSendAddressValue(evt)} 
              />
            <Input name="credit_card" placeholder="Credit card" required
              onChange={evt => this.updateSendAddressValue(evt)}
              />
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
          <Header title="Reward wallets" hasLink={false} />
        </Row>
        <Row className="list">
          {this.listRewardWalletBalance}
        </Row>

        <Row className="list">
          <Header title="Test net wallets" hasLink={false} />
        </Row>
        <Row className="list">
          {this.listTestWalletBalance}
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