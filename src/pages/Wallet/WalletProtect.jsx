import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import {Bitcoin} from '@/models/Bitcoin.js' 
import {Ethereum} from '@/models/Ethereum.js' 
import dontIcon from '@/assets/images/icon/3-dot-icon.svg';
import iconSafe from '@/assets/images/icon/icon-safe.svg';
import iconWarning from '@/assets/images/icon/icon-warning.svg';

import PropTypes from 'prop-types';
import './Wallet.scss';

import Button from '@/components/core/controls/Button';
import Checkbox from '@/components/core/forms/Checkbox/Checkbox';
import Modal from '@/components/core/controls/Modal';
import ModalDialog from '@/components/core/controls/ModalDialog';
import createForm from '@/components/core/form/createForm';
import { differenceWith } from 'lodash';

class WalletProtect extends React.Component {
	constructor(props) {

    super(props);
    this.state = {
      step1_confirm: false,
      step: props.step,
      arr_random: [],
      arr_confirm: []
    };

    console.log("constructor", this.state.step);
  }

	async componentDidMount() {
    //reset state

    //this.setState({step1_confirm: false, step: 1, arr_confirm: []});
    console.log(this.state.step);
	}
  
  get showStep1() {
    return this.state.step == 1 ?
    (
      <div class="protectwallet-wrapper" >
          <div class="msg1">
            Storing a passphrase will allow you to recover your funds 
            if your phone is ever lost or stolen.
          </div>
          <div class="msg2">
            It is important to store this passphrase securely where nobody else can access it, 
            such as on a piece of paper or in a password manager.
          </div>
          <div class="msg3">
            <Checkbox label="I understand that if I lose my passphrase, I will be unable to recover access to my account." 
              onClick={() => { this.setState({step1_confirm: !this.state.step1_confirm}); }} />
          </div>
          <footer class="footer">
            <Button block disabled={!this.state.step1_confirm} type="submit" onClick={this.doStep1}>Continue</Button>
          </footer>
        </div>
    )
    : "";
  }

  get showStep2() {
    const {wallet} = this.props;
    let arr_phrase  = wallet && wallet.mnemonic ? wallet.mnemonic.split(' ') : [];
    return this.state.step == 2 ?
    (
      <div class="protectwallet-wrapper" >
          <div class="msg1">
            Carefully write down the words. Don’t email it or screenshot it.
          </div>
          <div class="pass_phrase">
            {/* fill pass phrase */}
            {arr_phrase.map((str) => {
              return <div class="btn btn-light">{str}</div>
            })}
          </div>
          <footer class="footer">
            <Button block type="submit" onClick={this.doStep2}>Verify your passsphrase</Button>
          </footer>
        </div>
    )
    : "";
  }

  get showStep3() {
    
    return this.state.step == 3 ?
    (
      <div class="protectwallet-wrapper" >
          <div class="msg1">
            Tap the words to put them next to each other in the correct order.
          </div>
          <div class="confirm_pass_phrase">
            {this.state.arr_confirm.map((str) => {
              return <div class="btn btn-light" onClick={() => this.pickPassPhrase(str, false)}>{str}</div>
            })}
          </div>
          <div class="pass_phrase">
            {/* fill pass phrase */}
            {this.state.arr_random.map((str) => {
              return <div class="btn btn-light" onClick={() => this.pickPassPhrase(str, true)}>{str}</div>
            })}
          </div>
          <footer class="footer">
            <Button block type="submit" onClick={this.doStep3} >Verify your passsphrase</Button>
          </footer>
        </div>
    )
    : "";
  }

  arraySortRandom(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  pickPassPhrase = (phrase, isPick) => {
    let arr1 = [], arr2 = [];
    if(isPick){
      arr1 = this.state.arr_confirm;
      arr2 = this.state.arr_random;
    }
    else{// for undo
      arr1 = this.state.arr_random;
      arr2 = this.state.arr_confirm;
    }

    arr1.push(phrase);//add to array 1

    let index = arr2.indexOf(phrase);
    if (index > -1) {
      arr2.splice(index, 1);
    }// remove from array 2

    if(isPick){
      this.setState({arr_confirm: arr1, arr_random: arr2});
    }
    else{// for undo
      this.setState({arr_confirm: arr2, arr_random: arr1});
    }
  }

  doStep1 = () => {
    this.setState({arr_confirm: [], step: 2});
  }

  doStep2 = () => {
    const {wallet} = this.props;
    let arr_phrase = wallet && wallet.mnemonic ? wallet.mnemonic.split(' ') : [], arr_random = []; 
    if(arr_phrase.length > 0){
      arr_random = this.arraySortRandom(arr_phrase);
    }

    this.setState({arr_random: arr_random, arr_confirm: [], step: 3});
  }

  tryDoStep3 = () => {
    this.doStep2(); //reuse step2 
    this.modalConfirmRef.close();
  }

  doStep3 = () => {
    const {wallet} = this.props;
    let arr_confirm = this.state.arr_confirm, arr_phrase = wallet && wallet.mnemonic ? wallet.mnemonic.split(' ') : [], arr_random = [];
    let bMatch = true, i = 0;
    console.log(arr_confirm, arr_phrase);
    while(bMatch && i < arr_phrase.length){
      bMatch = arr_confirm[i] ==  arr_phrase[i];
      i++;
    }
    //bMatch = true;
    console.log(bMatch);
    if(bMatch){
      this.setState({step1_confirm: false, step: 1, arr_confirm: [], arr_random: []});

      //callback close form
      const { callbackSuccess } = this.props;
  
      if (callbackSuccess) {
        callbackSuccess();
      }
    }
    else{
      this.modalConfirmRef.open();
    }
  }

  openWalletProtect(){
    alert('me');
  }

	render(){ 
    const { step} = this.props;
    //this.setState({step: step});
    console.log('step change', step)
		return (
      <div>
        {this.showStep1}
        {this.showStep2}
        {this.showStep3}
        <ModalDialog title="Not correct" onRef={modal => this.modalConfirmRef = modal}>
          <div class="wrong-pass-phrase">The ordered of words you typed is not correct. Please try again.</div>
          <div class="text-center p-3 ">
            <button class="btn-block text-primary p-2" onClick={this.tryDoStep3} >Try again</button>
          </div>
        </ModalDialog>
      </div>
		);
	}
}

WalletProtect.propTypes = {    
  wallet: PropTypes.object,
  step: PropTypes.object
};

const mapState = (state) => ({
  
});

const mapDispatch = ({
});

export default connect(mapState, mapDispatch)(WalletProtect);