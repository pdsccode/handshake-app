import React from 'react';
import { connect } from 'react-redux';
import { Col } from 'react-bootstrap';
import {Bitcoin} from '@/models/Bitcoin.js' 
import {Ethereum} from '@/models/Ethereum.js' 
import dontIcon from '@/assets/images/icon/3-dot-icon.svg';
import iconSafe from '@/assets/images/icon/icon-safe.svg';
import iconWarning from '@/assets/images/icon/icon-warning.svg';

import PropTypes from 'prop-types';
import './Wallet.scss';

import Button from '@/components/core/controls/Button';
import Modal from '@/components/core/controls/Modal';
import createForm from '@/components/core/form/createForm';


class WalletProtect extends React.Component {
	constructor(props) {

    super(props);
    this.state = {
    };
  }

	async componentDidMount() {

   
	}
	
	render(){ 
		const {} = this.props;
			
		return  ( 
      <div class="protectwallet-wrapper">
        <div id="msg1">
          Storing a passphrase will allow you to recover your funds 
          if your phone is ever lost or stolen.
        </div>
        <div id="msg2">
          It is important to store this passphrase securely where nobody else can access it, 
          such as on a piece of paper or in a password manager.
        </div>
        <div id="msg3">
          I understand that if I lose my passphrase, 
          I will be unable to recover access to my account.
        </div>

        <Button block type="submit">Continue</Button>
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