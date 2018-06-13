import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// service, constant
import { Grid, Row, Col } from 'react-bootstrap';
// components
import { load } from '@/reducers/discover/action';
import Button from '@/components/core/controls/Button';
import { MasterWallet } from '@/models/MasterWallet';
import Input from '@/components/core/forms/Input/Input';
import { StringHelper } from '@/services/helper';
import {
    fieldCleave,
    fieldDropdown,
    fieldInput,
    fieldNumericInput,
    fieldPhoneInput,
    fieldRadioButton
  } from '@/components/core/form/customField';
  import {required} from '@/components/core/form/validation';
  import {change, Field, formValueSelector, clearFields} from 'redux-form';
  import {bindActionCreators} from 'redux';
  import ModalDialog from '@/components/core/controls/ModalDialog';
  import Modal from '@/components/core/controls/Modal';
  import createForm from '@/components/core/form/createForm';

  import ReactBottomsheet from 'react-bottomsheet';
  import { showAlert } from '@/reducers/app/action';
  import { showLoading, hideLoading } from '@/reducers/app/action';
  import { Input as Input2, InputGroup, InputGroupAddon } from 'reactstrap';
  import local from '@/services/localStore';
import {APP} from '@/constants';

import "./Refers.scss"

  // 3 step Form
const nameFormStep1 = 'referStep1';
const Step1Form = createForm({ propsReduxForm: { form: nameFormStep1}});

const nameFormStep2 = 'referStep2';
const Step2Form = createForm({ propsReduxForm: { form: nameFormStep2}});

const nameFormStep3 = 'referStep3';
const Step3Form = createForm({ propsReduxForm: { form: nameFormStep3}});

const nameFormStep4 = 'referStep4';
const Step4Form = createForm({ propsReduxForm: { form: nameFormStep4}});

class Refers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1, profile: false
    }    
  }

  showAlert(msg, type = 'success', timeOut = 3000, icon = '') {
    this.props.showAlert({
      message: <div className="textCenter">{icon}{msg}</div>,
      timeOut,
      type,
      callBack: () => {},
    });
  }
  showToast(mst) {
    this.showAlert(mst, 'primary', 2000);
  }
  showError(mst) {
    this.showAlert(mst, 'danger', 3000);
  }
  showSuccess(mst) {
    this.showAlert(mst, 'success', 4000, <img className="iconSuccessChecked" src={iconSuccessChecked} />);
  }
  showLoading(status) {
    this.props.showLoading({ message: '' });
  }
  hideLoading() {
    this.props.hideLoading();
  }

  componentDidMount() {    
    this.resetForm();
  }

  resetForm(){
    // clear form:
    this.props.clearFields(nameFormStep1, false, false, "telegram_username");    
    this.props.clearFields(nameFormStep2, false, false, "twitter_username");    
    this.props.clearFields(nameFormStep3, false, false, "refer_email"); 
    
    // fill link ref:
    const profile = local.get(APP.AUTH_PROFILE);
    this.setState({profile: profile});    
    this.props.rfChange(nameFormStep4, 'refer_link', profile != false ? "https://ninja.org/ref=?" + profile.username : '');
    
  }

  componentWillUnmount() {
    
  }

  onFinish = () => {
    
    const { onFinish } = this.props;

    if (onFinish) {      
      onFinish();
    } else {
      
    }
  }


  sendCoin = () => {    
      this.modalConfirmTranferRef.open();    
  }

  updateSendAmountValue = (evt) => {
    this.setState({
      inputSendAmountValue: evt.target.value,
    });
  }

  updateSendAddressValue = (evt) => {
    this.setState({
      inputAddressAmountValue: evt.target.value,
    });
  }

submitSendCoin=()=>{
  this.setState({isRestoreLoading: true});
  this.modalConfirmTranferRef.close();    
}

    renderStep1= () => (
        <Step1Form onSubmit={this.submitStep1}>
            <h6>Step 1: Join community telegram</h6>
            <Row>
                <Col sm={8} md={8} xs={8}>
                    <Field
                        name="telegram_username"
                        type="text"
                        className="form-control"
                        placeholder="Input your Telegram username"
                        component={fieldInput}
                        value={this.state.inputTelegramUsernameValue}
                        onChange={evt => this.updateTelegramUsernameValue(evt)}
                        validate={[required]}
                    /> 
                </Col> 
                <Col sm={4} md={4} xs={4} className="no-padding-left">
                    <Button isLoading={this.state.isLoading} block  type="submit">Verify</Button>
                </Col>
            </Row>
        </Step1Form>
    )

    renderStep2= () => (
        <Step2Form onSubmit={this.submitStep1}>
            <h6>Step 2: Follow our Twitter</h6>
            <Row>
                <Col sm={8} md={8} xs={8}>
                    <Field
                        name="twitter_username"
                        type="text"
                        className="form-control"
                        placeholder="Input your Twitter username"
                        component={fieldInput}
                        value={this.state.inputTwitterUsernameValue}
                        onChange={evt => this.updateTwitterUsernameValue(evt)}
                        validate={[required]}
                    /> 
                </Col> 
                <Col sm={4} md={4} xs={4} className="no-padding-left">
                    <Button isLoading={this.state.isLoading} block  type="submit">Verify</Button>
                </Col>
            </Row>
        </Step2Form>
    )

    renderStep3= () => (
        <Step3Form onSubmit={this.submitStep1}>
            <h6>Step 3: Input email to get more promotions</h6>
            <Row>
                <Col sm={8} md={8} xs={8}>
                    <Field
                        name="refer_email"
                        type="text"
                        className="form-control"
                        placeholder="Your email address"
                        component={fieldInput}
                        value={this.state.inputEmailValue}
                        onChange={evt => this.updateEmailValue(evt)}
                        validate={[required]}
                    /> 
                </Col> 
                <Col sm={4} md={4} xs={4} className="no-padding-left">
                <Button isLoading={this.state.isLoading} block type="submit">Receive token</Button>
                </Col>
            </Row>
        </Step3Form>
    )

    renderLinkRefer= () => (
        <Step4Form onSubmit={this.submitStep4}>
            <h6>Final: Share this link to friend to get extra 20 Shuriken</h6>
            <p>Referral link:</p>
            <Row>
                <Col sm={8} md={8} xs={8}>                    
                    <Field
                        name="refer_link"
                        type="text"
                        className="form-control"
                        placeholder=""
                        readOnly                        
                        component={fieldInput}                        
                        validate={[required]}
                    />
                </Col>
                <Col sm={4} md={4} xs={4} className="no-padding-left">
                    <Button block type="submit">Done</Button>
                </Col>
            </Row>
        </Step4Form>        
    )

  
  render() {

    const {formAddress, toAddress, amount, coinName } = this.props;  
    
    return ( 
      <div className="refers">                       
        
          
          {this.renderStep1()}
          {this.renderStep2()}
          {this.renderStep3()}
          {this.renderLinkRefer()}

        </div>
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
  clearFields: bindActionCreators(clearFields, dispatch),
  
});

export default connect(mapStateToProps, mapDispatchToProps)(Refers);
