import React from 'react';
import {Field, formValueSelector} from "redux-form";
import {connect} from "react-redux";
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import createForm from '@/components/core/form/createForm'
import { change } from 'redux-form'
import {fieldDropdown, fieldInput, fieldRadioButton} from '@/components/core/form/customField'
import {required} from '@/components/core/form/validation'
import {MasterWallet} from "@/models/MasterWallet";
import { bindActionCreators } from "redux";
import {showAlert} from '@/reducers/app/action';
import { showLoading, hideLoading } from '@/reducers/app/action';
import QrReader from 'react-qr-reader';
import { Input as Input2, InputGroup, InputGroupAddon } from 'reactstrap';

const nameFormSendWallet = 'sendWallet';
const SendWalletForm = createForm({ propsReduxForm: { form: nameFormSendWallet, enableReinitialize: true, clearSubmitErrors: true}});


class Transfer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      
    }
    
  }

  async componentDidMount() {    
    // clear form:
    this.props.clearFields(nameFormSendWallet, false, false, "to_address", "from_address", "amount");
  }

  componentWillUnmount() {
    
  }

  showLoading = () => {
    this.props.showLoading({message: '',});
  }

  hideLoading = () => {
    this.props.hideLoading();
  }


  handleBuySuccess = () => {
    
    const { callbackSuccess } = this.props;
    

    if (callbackSuccess) {
        callbackSuccess();
    } else {
      
    }
  }

  sendCoin = () => {    
      this.modalConfirmSendRef.open();    
  }

  
  render() {

    const {formAddress, toAddress, amount, coinName } = this.props;
    
    return (                        
        <SendWalletForm className="sendwallet-wrapper" onSubmit={this.sendCoin} validate={this.invalidateTransferCoins}>
        
        {/* Dialog confirm transfer coin */}
        <ModalDialog title="Confirmation" onRef={modal => this.modalConfirmSendRef = modal}>
            <div className="bodyConfirm"><span>Are you sure you want to transfer out {this.state.inputSendAmountValue} {this.state.walletSelected ? this.state.walletSelected.name : ''}?</span></div>
            <div className="bodyConfirm">
                <Button className="left" cssType="danger" onClick={this.submitSendCoin} >Confirm</Button>
                <Button className="right" cssType="secondary" onClick={() => { this.modalConfirmSendRef.close(); }}>Cancel</Button>
            </div>
        </ModalDialog>

        <p className="labelText">Receiving address</p>
        <div className="div-address-qr-code">

          <Field
                name="to_address"
                type="text"
                className="form-control input-address-qr-code"
                placeholder="Specify receiving..."
                component={fieldInput}
                value={this.state.inputAddressAmountValue}
                onChange={evt => this.updateSendAddressValue(evt)}
                validate={[required]}
              />          
          {!isIOs ? <img onClick={() => { this.openQrcode() }} className="icon-qr-code-black" src={iconQRCodeBlack} /> : ""}
        </div>
        <p className="labelText">{ this.state.walletSelected ? StringHelper.format("Amount ({0})", this.state.walletSelected.name) : "Amount "}</p>          
          <Field
                name="amount"
                type={isIOs ? "number" : "tel"}
                className="form-control"
                component={fieldInput}
                value={this.state.inputSendAmountValue}
                onChange={evt => this.updateSendAmountValue(evt)}
                placeholder={"0.0"}
                validate={[required, amountValid]}
                // validate={[required, amountValid, balanceValid(this.state.walletSelected ? this.state.walletSelected.balance : "", this.state.walletSelected ? this.state.walletSelected.name : "")]}
              />

              <label className='label-balance'>Your balance: { this.state.walletSelected ? StringHelper.format("{0} {1}", this.state.walletSelected.balance, this.state.walletSelected.name) : ""}</label>

          <Button className="button-wallet" isLoading={this.state.isRestoreLoading}  type="submit" block={true}>Transfer</Button>
        </SendWalletForm>
    )
  }
}

const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = (dispatch) => ({  
  rfChange: bindActionCreators(change, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(FeedCreditCard));
