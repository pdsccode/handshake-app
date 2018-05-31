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
import createForm from '@/components/core/form/createForm';


class WalletProtect extends React.Component {
	constructor(props) {

    super(props);
    this.state = {
      step1_confirm: false,
      step: 1
    };
  }

	async componentDidMount() {
    this.setState({step1_confirm: false, step: 1});
	}
  
  get showStep1() {
    //console.log("Khoa");
    //console.log(wallet);
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
          <footer>
            <Button block disabled={!this.state.step1_confirm} type="submit" onClick={() => { this.setState({step: 2}) }}>Continue</Button>
          </footer>
        </div>
    )
    : "";
  }

  get showStep2() {
    return this.state.step == 2 ?
    (
      <div class="protectwallet-wrapper" >
          <div class="msg1">
            Carefully write down the words. Don’t email it or screenshot it.
          </div>
          <div class="pass_phrase">
            <div class="btn btn-light">rural</div>
            <div class="btn btn-light">tired</div>
            <div class="btn btn-light">eager</div>
            <div class="btn btn-light">blouse</div>
          </div>
          <div class="link">
            <a>Copy to clipboard</a>
          </div>
          <footer>
            <Button block type="submit" onClick={() => { this.setState({step: 3}) }}>Verify your passsphrase</Button>
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

          </div>
          <div class="pass_phrase">
            <div class="btn btn-light">rural</div>
            <div class="btn btn-light">tired</div>
            <div class="btn btn-light">eager</div>
            <div class="btn btn-light">blouse</div>
          </div>
          <footer>
            <Button block type="submit" >Verify your passsphrase</Button>
          </footer>
        </div>
    )
    : "";
  }

	render(){ 
		const {wallet} = this.props;
			
		return (
      <div>
        {this.showStep1}
        {this.showStep2}
        {this.showStep3}
      </div>
		);
	}
}

WalletProtect.propTypes = {    
	wallet: PropTypes.object
};

const mapState = (state) => ({
});

const mapDispatch = ({
});

export default connect(mapState, mapDispatch)(WalletProtect);