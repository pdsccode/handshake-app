import React from 'react';
import { connect } from 'react-redux';

// components
import axios from 'axios';
import Button from '@/components/core/controls/Button';
import {
    fieldInput
  } from '@/components/core/form/customField';
import { verifyEmail } from '@/reducers/auth/action';
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

window.Clipboard = (function (window, document, navigator) {
  let textArea,
    copy; function isOS() { return navigator.userAgent.match(/ipad|iphone/i); } function createTextArea(text) { textArea = document.createElement('textArea'); textArea.value = text; document.body.appendChild(textArea); } function selectText() {
    let range,
      selection; if (isOS()) { range = document.createRange(); range.selectNodeContents(textArea); selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); textArea.setSelectionRange(0, 999999); } else { textArea.select(); }
  } function copyToClipboard() { document.execCommand('copy'); document.body.removeChild(textArea); } copy = function (text) { createTextArea(text); selectText(); copyToClipboard(); }; return { copy };
}(window, document, navigator));

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
      step3: 0,
      profile: {}
    }
  }

  componentDidMount(){
    this.resetForm();
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

    if(profile && profile.email){
      this.setState({step3: 2, step3_value: profile.email});
      this.props.rfChange(nameFormStep3, 'refer_email', profile && profile.email ? profile.email : '');
    }

    let refers = local.get(APP.REFERS);
    if(refers){
      if(refers.step1){
        this.setState({step1: true, step1_value: refers.step1_value});
      }

      if(refers.step2){
        this.setState({step2: true, step2_value: refers.step2_value});
      }

      if(profile && profile.email) {
        refers.step3 = 2;
        refers.step3_value = profile.email;
        local.save(APP.REFERS, refers);
      }
      else if(refers.step3){
        this.setState({step3: refers.step3, step3_value: refers.step3_value});
      }

      this.props.rfChange(nameFormStep1, 'telegram_username', refers && refers.step1_value ? refers.step1_value : '');
      this.props.rfChange(nameFormStep2, 'twitter_username', refers && refers.step2_value ? refers.step2_value : '');
      this.props.rfChange(nameFormStep3, 'refer_email', refers && refers.step3_value ? refers.step3_value : '');

      if(refers.step1 && refers.step2 && refers.step3 == 2){console.log(profile.username);
        let referLink = profile && profile.username ? "https://ninja.org/ref=?" + profile.username : '';
        this.setState({referLink: referLink});
        this.props.rfChange(nameFormStep4, 'refer_link', referLink);
      }
    }
    else{
      if(profile && profile.email) {
        refers = {};
        refers.step3 = 2;
        refers.step3_value = profile.email;
        local.save(APP.REFERS, refers);
      }
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
    let old_count = this.state.telegram_count,
      new_count = await this.getTelegramCount();

    console.log(old_count , new_count);
    if(old_count >= new_count){
      this.showError("Not found your telegram in our community. Please reload page and try again.")
    }
    else{
      this.setState({step1: true});
      let refers = local.get(APP.REFERS);
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
      let refers = local.get(APP.REFERS);
      if(!refers)
        refers = {};

      refers.step2 = true;
      refers.step2_value = this.state.step2_value;
      local.save(APP.REFERS, refers);
      this.showSuccess("You followed our Twitter!");
    }
    else{
      this.showError("Not found your following in our Twitter. Please try again.")
    }
  }

  submitStep3 = () => {
    let refers = local.get(APP.REFERS);
    if(!refers) refers = {};

    if(this.state.step3 && this.state.step3 == 1){
      let profile = local.get(APP.AUTH_PROFILE);
      if(profile && profile.email){
        refers.step3 = 2;
        refers.step3_value = profile.email;

        local.save(APP.REFERS, refers);
        this.setState({step3: refers.step3, step3_value: refers.step3_value, referLink: profile && profile.username ? "https://ninja.org/ref=?" + profile.username : ''});
      }
    }
    else{
      let email = this.state.step3_value;
      this.props.verifyEmail({
        PATH_URL: `user/verification/email/start?email=${email}`,
        METHOD: 'POST',
        successFn: (data) => {
          if (data.status) {
            this.showToast("Sent verify email, please check your email!");

            local.save(APP.EMAIL_NEED_VERIFY, email);
            this.setState({step3: 1});

            refers.step3 = 1;
            refers.step3_value = email;
            local.save(APP.REFERS, refers);
          }
        },
        errorFn: (e) => {
          console.log("errorFn", e);
          this.showError("Can\'t send verify email");
        },
      });
    }
    // if(old_count >= new_count && 1 != 1){
    //   this.showError("Not found your telegram in our community. Please reload page and try again.")
    // }
    // else{
    //   this.setState({step1: true});
    //   this.showSuccess("You joined our community telegram!")
    // }
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

  updateEmailValue= (evt) => {
    this.setState({
      step3_value: evt.target.value,
    });
  }

  updateTwitterUsernameValue = (evt) => {
    this.setState({
      step2_value: evt.target.value,
    });
  }

renderStep1 = () => (
  <Step1Form onSubmit={this.submitStep1} className="refers-wrapper">
    <h6><a href="https://t.me/ninja_org" target="_blank">Insult us on telegram</a>. Be creative. There’s a leaderboard.</h6>
    <div className="col2">
      <Button isLoading={this.state.isLoading} disabled={this.state.step1} block type="submit">{this.state.step1 ? "done" : "bite me"}</Button>
    </div>
    <div className="col1">
      <Field
        name="telegram_username"
        type="text"
        className="form-control"
        placeholder="your telegram alias"
        component={fieldInput}
        value={this.state.step1_value}
        onChange={evt => this.updateTelegramUsernameValue(evt)}
        validate={[required]}
        disabled={this.state.step1}
      />
    </div>
  </Step1Form>
)

renderStep2= () => (
  <Step2Form onSubmit={this.submitStep2} className="refers-wrapper">
    <h6>Our social media guy says we need followers on <a href="https://twitter.com/ninja_org" target="_blank">twitter</a>.</h6>
    <div className="col2">
        <Button isLoading={this.state.isLoading} block disabled={this.state.step2} type="submit">{this.state.step2 ? "done" : "bite me"}</Button>
    </div>
    <div className="col1">
      <Field
        name="twitter_username"
        type="text"
        className="form-control"
        placeholder="your twitter username"
        component={fieldInput}
        value={this.state.step2_value}
        onChange={evt => this.updateTwitterUsernameValue(evt)}
        validate={[required]}
        disabled={this.state.step2}
      />
    </div>
  </Step2Form>
)

renderStep3= () => (
  <Step3Form onSubmit={this.submitStep3} className="refers-wrapper">
    <h6>Receive your randomly generated ninja name.</h6>
    <div className="col2"> {this.renderStep3_labelButton()}</div>
    <div className="col1">
      <Field
          name="refer_email"
          type="text"
          className="form-control"
          placeholder="your favourite fake email to receive free stuff at"
          component={fieldInput}
          value={this.state.step3_value}
          onChange={evt => this.updateEmailValue(evt)}
          validate={[required]}
          disabled={this.state.step3 && this.state.step3 > 1}
      />
    </div>
    {
      this.state.step1 && this.state.step2 && this.state.step3 > 1 ?
      <div className="col100 token">
        <Button block type="submit">just give me tokens</Button>
      </div> : ""
    }

  </Step3Form>
)

renderStep3_labelButton= () => {
  switch(this.state.step3) {
    case 1:
      return <Button isLoading={this.state.isLoading} block type="submit">confirm</Button>
    case 2:
      return <Button isLoading={this.state.isLoading} block disabled type="submit">done</Button>
    default:
      return <Button isLoading={this.state.isLoading} block type="submit">bite me</Button>
  }
}
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
                  onClick={() => { alert('ga'); Clipboard.copy(JSON.stringify(this.state.inputLinkValue)); this.showToast('Referral link copied to clipboard.'); }}
              />
          </Col>
          <Col sm={4} md={4} xs={4} className="no-padding-left">
              <Button block type="submit">Done</Button>
          </Col>
      </Row>
  </Step4Form>
)

renderLinkRefer = () => (
  this.state.step1 && this.state.step2 && this.state.step3 > 1 ?
  <Step4Form onSubmit={this.submitStep4} className="refers-wrapper">
    <h6>This is your super sexy referral link. You get 20 shurikens for every new ninja.</h6>
    <div className="col100">
        <Field
            name="refer_link"
            type="text"
            className="form-control"
            placeholder=""
            component={fieldInput}
            onChange={evt => this.updateLinkValue(evt)}
            validate={[required]}
            onFocus={() => { Clipboard.copy(this.state.referLink); this.showToast('Referral link copied to clipboard.'); }}
        />
    </div>
    <div className="col100">
        <Button block type="submit">Done</Button>
    </div>
  </Step4Form> :
  ""
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
  verifyEmail: bindActionCreators(verifyEmail, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Refers);
