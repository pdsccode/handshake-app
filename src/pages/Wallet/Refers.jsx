import React from 'react';
import { connect } from 'react-redux';
// service, constant
import { Grid, Row, Col } from 'react-bootstrap';

// components
import axios from 'axios';
import Button from '@/components/core/controls/Button';
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
import createForm from '@/components/core/form/createForm';
import { showAlert } from '@/reducers/app/action';
import { showLoading, hideLoading } from '@/reducers/app/action';
import iconSuccessChecked from '@/assets/images/icon/icon-checked-green.svg';
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
      telegram_count: 0,
      step1_value: "",
      step1: false,
      step2_value: "",
      step2: false,
      step3_value: "",
      step3: false
    }
  }

  componentWillMount(){
    console.log("componentWillMount");
  }

  componentDidMount(){
    this.resetForm();
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
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

  async resetForm(){
    // clear form:
    this.props.clearFields(nameFormStep1, false, false, "telegram_username");
    this.props.clearFields(nameFormStep2, false, false, "twitter_username");
    this.props.clearFields(nameFormStep3, false, false, "refer_email");

    // fill link ref:
    const profile = local.get(APP.AUTH_PROFILE);
    this.setState({profile: profile});
    alert(profile.username);
    this.props.rfChange(nameFormStep4, 'refer_link', profile != false ? "https://ninja.org/ref=?" + profile.username : '');
    console.log(profile, profile.email);
    if(profile && profile.email){
      this.setState({step3: true, step3_value: profile.email});
      this.props.rfChange(nameFormStep3, 'refer_email', profile && profile.email ? profile.email : '');
    }

    const refers = local.get(APP.REFERS);
    if(refers){
      if(refers.step1){console.log(refers);
        this.setState({step1: true, step1_value: refers.step1_value});
      }

      if(refers.step2){
        this.setState({step2: true, step2_value: refers.step2_value});
      }

      if(refers.step3){
        this.setState({step3: true, step3_value: refers.step3_value});
      }

      this.props.rfChange(nameFormStep1, 'telegram_username', refers && refers.step1_value ? refers.step1_value : '');
      this.props.rfChange(nameFormStep2, 'twitter_username', refers && refers.step2_value ? refers.step2_value : '');
      this.props.rfChange(nameFormStep3, 'refer_email', refers && refers.step3_value ? refers.step3_value : '');
    }

    if(this.state.step1 == false){
      this.setState({telegram_count: await this.getTelegramCount()});
    }
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

  updateSendAddressValue = (evt) => {
    this.setState({
      inputAddressAmountValue: evt.target.value,
    });
  }

  submitSendCoin=()=>{
    this.setState({isRestoreLoading: true});
    this.modalConfirmTranferRef.close();
  }

  submitStep1 = async() => {
    let old_count = this.state.step1_value,
      new_count = await this.getTelegramCount();

    if(old_count >= new_count && 1 != 1){
      this.showError("Not found your telegram in our community. Please reload page and try again.")
    }
    else{
      this.setState({step1: true});
      let refers = loget(APP.REFERS);
      if(!refers)
        refers = {};

      refers.step1 = this.state.step1;
      refers.step1_value = this.state.step1_value;
      local.save(APP.REFERS, refers);
      this.showSuccess("You joined our community telegram!")
    }
  }

  submitStep2 = async() => {
    if(this.getTwitter()){
      this.setState({step2: true});
      this.showSuccess("You followed our Twitter!");

      let refers = loget(APP.REFERS);
      if(!refers)
        refers = {};

      refers.step2 = this.state.step2
      refers.step2_value = this.state.step2_value;
      local.save(APP.REFERS, refers);
    }
    else{
      this.showError("Not found your following in our Twitter. Please try again.")
    }
  }

  submitStep3 = async() => {
    let old_count = this.state.telegram_count,
      new_count = await this.getTelegramCount();

    if(old_count >= new_count && 1 != 1){
      this.showError("Not found your telegram in our community. Please reload page and try again.")
    }
    else{
      this.setState({step1: true});
      this.showSuccess("You joined our community telegram!")
    }
  }

  async getTelegramCount(){
    const url = "https://api.telegram.org/bot558469151:AAFYugF0QeCEIT1iXQsgTTuZJ9_p7koaw70/getChatMembersCount?chat_id=@ninja_org";
    const response = await axios.get(url);
    if (response.status == 200 && response.data && response.data.ok) {
      return Number(response.data.result);
    }
  }

  async getTwitter(){
    const url = "https://api.twitter.com/1.1/followers/list.json?cursor=-1&screen_name=ninja_org&skip_status=true&include_user_entities=false";
    let oauth = {
      consumer_key: 'GcmABUZqxQ3ozWPkFLIXAwrHM',
      consumer_secret: 'XAliYph83XYA96l98l3maDTLooUG2dLC2Z9wtIZrzatBe1aAgp',
      token: "1002034013488336896-eCfCTuOwJ7PXuWb8JoiEMgp1kgvihP"
    };

    const response = await axios.get(url, oauth);
    console.log(response);
    if (response.status == 200) {

      return Number(response);
    }
  }

  updateTelegramUsernameValue = (evt) => {
    this.setState({
      step1_value: evt.target.value,
    });
  }

  updateTwitterUsernameValue = (evt) => {
    this.setState({
      step2_value: evt.target.value,
    });
  }

  renderStep1 = () => (
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
              value={this.state.step1_value}
              onChange={evt => this.updateTelegramUsernameValue(evt)}
              validate={[required]}
              disabled={this.state.step1}
          />
        </Col>
        <Col sm={4} md={4} xs={4} className="no-padding-left">
          <Button isLoading={this.state.isLoading} disabled={this.state.step1} block type="submit">{this.state.step1 ? "Verified" : "Verify"}</Button>
        </Col>
      </Row>
    </Step1Form>
  )

renderStep2= () => (
    <Step2Form onSubmit={this.submitStep2}>
        <h6>Step 2: Follow our Twitter</h6>
        <Row>
            <Col sm={8} md={8} xs={8}>
                <Field
                    name="twitter_username"
                    type="text"
                    className="form-control"
                    placeholder="Input your Twitter username"
                    component={fieldInput}
                    value={this.state.step2_value}
                    onChange={evt => this.updateTwitterUsernameValue(evt)}
                    validate={[required]}
                    disabled={this.state.step2}
                />
            </Col>
            <Col sm={4} md={4} xs={4} className="no-padding-left">
                <Button isLoading={this.state.isLoading} block disabled={this.state.step2} type="submit">{this.state.step2 ? "Verified" : "Verify"}</Button>
            </Col>
        </Row>
    </Step2Form>
)

renderStep3= () => (
  <Step3Form onSubmit={this.submitStep3}>
      <h6>Step 3: Input email to get more promotions</h6>
      <Row>
          <Col sm={8} md={8} xs={8}>
              <Field
                  name="refer_email"
                  type="text"
                  className="form-control"
                  placeholder="Your email address"
                  component={fieldInput}
                  value={this.state.step3_value}
                  onChange={evt => this.updateEmailValue(evt)}
                  validate={[required]}
                  disabled={this.state.step3}
              />
          </Col>
          <Col sm={4} md={4} xs={4} className="no-padding-left">
          <Button isLoading={this.state.isLoading} block disabled={this.state.step3} type="submit">{this.state.step3 ? "Verified" : "Verify"}</Button>
          </Col>
      </Row>
  </Step3Form>
)

<<<<<<< HEAD
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
                  component={fieldInput}
                //   value={this.state.inputLinkValue}
                  onChange={evt => this.updateLinkValue(evt)}
                  validate={[required]}
                  onFocus={() => { Clipboard.copy(JSON.stringify(this.state.inputLinkValue)); this.showToast('Referral link copied to clipboard.'); }}
              />
          </Col>
          <Col sm={4} md={4} xs={4} className="no-padding-left">
              <Button block type="submit">Done</Button>
          </Col>
      </Row>
  </Step4Form>
)

=======
>>>>>>> d83756b347f9572553961edad4c52bc95723a1a6
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
