import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// services
import createForm from '@/components/core/form/createForm';
import { setHeaderTitle, showAlert } from '@/reducers/app/action';
import { verifyPhone, submitPhone, verifyEmail, submitEmail, checkUsernameExist, authUpdate } from '@/reducers/auth/action';
import COUNTRIES from '@/data/country-dial-codes.js';
// components
import { Grid, Row, Col } from 'react-bootstrap';
import Image from '@/components/core/presentation/Image';
import Button from '@/components/core/controls/Button';
import { Field } from 'redux-form';
import { fieldCleave } from '@/components/core/form/customField';
import ModalDialog from '@/components/core/controls/ModalDialog';
// style
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow.svg';
import CheckedSVG from '@/assets/images/icon/checked.svg';
import { success } from '@/reducers/comment/action';

import './Profile.scss';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: COUNTRIES,
      countryCode: COUNTRIES[0], // default is US
      usernameCollapse: false,
      phoneCollapse: false,
      emailCollapse: false,
      isShowCountryCode: false,
      phoneStart: false,
      emailStart: false,
      phone: '',
      email: '',
      sms: '',
      successMessage: '',
    };
    // bind
    this.onSubmitVerifyPhone = ::this.onSubmitVerifyPhone;
    this.onSubmitVerifyEmail = ::this.onSubmitVerifyEmail;
    this.selectPhoneRegionCode = ::this.selectPhoneRegionCode;
    this.filterCountries = ::this.filterCountries;
    this.onTextFieldChange = ::this.onTextFieldChange;
    this.addUsername = ::this.addUsername;

    props.setHeaderTitle('My Profile');

    this.UsernameForm = createForm({
      propsReduxForm: {
        form: 'UsernameForm',
        initialValues: { username: props.auth.profile.username },
      },
    });
    this.NumberPhoneForm = createForm({
      propsReduxForm: {
        form: 'NumberPhoneForm',
        initialValues: { phone: props.auth.profile.phone },
      },
    });
    this.EmailForm = createForm({
      propsReduxForm: {
        form: 'EmailForm',
        initialValues: { username: props.auth.profile.email },
      },
    });
  }

  componentDidMount() {
    const { auth } = this.props;
    console.log(auth);
    if (auth && auth.isLogged) {
      console.log({ phone: auth.profile.phone, email: auth.profile.email });
      this.setState((state) => (Object.assign({}, state, { phone: auth.profile.phone, email: auth.profile.email })), () => {
        console.log(this.state);
      })
    }
  }

  updateProfile(data = {}) {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams();
      for (var k in data) {
        params.append(k, data[k]);
      }
      authUpdate({
        PATH_URL: 'user/profile',
        data: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        METHOD: 'POST',
        successFn: async (data) => {
          resolve(data);
        },
        errorFn: async (data) => {
          reject(data);
          console.log('fail', data);
        }
      });
    });
  }

  addUsername(values) {
    if (values.username) {
      this.props.checkUsernameExist({
        PATH_URL: 'user/username-exist',
        qs: { username: values.username },
        successFn: (res) => {
          if (!res.data) {
            const params = new URLSearchParams();
            params.append('username', values.username);
            this.props.authUpdate({
              PATH_URL: 'user/profile',
              data: params,
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              METHOD: 'POST',
              successFn: () => {
                this.props.showAlert({
                  message: <div className="text-center">Updated your username</div>,
                  timeOut: 3000,
                  type: 'success',
                });
              },
            });
          } else {
            this.props.showAlert({
              message: <div className="text-center">This username has exist</div>,
              timeOut: 3000,
              type: 'danger',
            });
          }
        },
      });
    } else {
      this.props.showAlert({
        message: <div className="text-center">Username is required</div>,
        timeOut: 3000,
        type: 'danger',
      });
    }
  }

  onSubmitVerifyPhone() {
    const { verifyPhone, submitPhone, authUpdate} = this.props;
    const { countryCode, phone, phoneStart, sms } = this.state;
    if (phoneStart !== phone) {
      console.log('onSubmitVerifyPhone start', countryCode, phone);
      verifyPhone({
        PATH_URL: `user/verification/phone/start?country=${countryCode.dialCode.replace('+', '')}&phone=${phone}`,
        METHOD: 'POST',
        successFn: async () => {
          this.setState(() => ({ phoneStart: phone }));
        },
        errorFn: async () => {
          console.log('fail', data);
        }
      });
    } else {
      console.log('onSubmitVerifyPhone submit', countryCode, phone, sms);
      submitPhone({
        PATH_URL: `user/verification/phone/check?country=${countryCode.dialCode.replace('+', '')}&phone=${phone}&code=${sms}`,
        METHOD: 'POST',
        successFn: async (data) => {
          try { 
            await this.updateProfile({phone:phone});
            this.setState(() => ({ successMessage: 'Your phone number is verified', phoneStart: false }), () => {
              this.modalVerifyRef.open();
            })
          } catch (e) {
            console.log('update profile failed.');
            this.setState(() => ({ successMessage: '', phoneStart: false }))
          }
        },
        errorFn: async (data) => {
          console.log('fail', data);
        }
      });
    }
  }

  onSubmitVerifyEmail() {
    const { verifyEmail, submitEmail, authUpdate } = this.props;
    const { email } = this.state;
    console.log('onSubmitVerifyPhone', email);
    verifyEmail({
      PATH_URL: `user/verification/email/start?email=${email}`,
      METHOD: 'POST',
      successFn: async (data) => {
        console.log(data);
      },
      errorFn: async (data) => {
        console.log(data);
      }
    });
  }

  selectPhoneRegionCode(country) {
    this.setState({
      countryCode: country,
      isShowCountryCode: false,
    });
  }

  filterCountries(value) {
    clearTimeout(this.searchTimeOut);
    this.searchTimeOut = setTimeout(() => {
      const compareCountryName = name => name.toLowerCase().indexOf(value.trim().toLowerCase()) !== -1;
      this.setState({
        countries: COUNTRIES.filter(country => compareCountryName(country.name)),
      });
    }, 200);
  }

  onTextFieldChange(name, value) {
    this.setState(() => ({ [name]: value }));
  }

  render() {
    const { countryCode, countries, phone, sms, email } = this.state;
    const { UsernameForm, NumberPhoneForm, EmailForm } = this;
    console.log('re-render?', email, sms, phone);
    return (
      <Grid className="profile">
        <Row>
          <Col md={12}>
            <div className="collapse-custom">
              <div
                className="head"
                onClick={
                  () => this.setState(state => ({
                    usernameCollapse: !state.usernameCollapse,
                  }))
                }
              >
                <p className="label">
                  Username
                </p>
                <div className="extend">
                  <Image className={this.state.phoneCollapse ? 'rotate' : ''} src={ExpandArrowSVG} alt="arrow" />
                </div>
              </div>
              <div className={`content ${this.state.usernameCollapse ? '' : 'd-none'}`}>
                <p className="text">Enter username</p>
                <UsernameForm onSubmit={this.addUsername}>
                  <Field
                    name="username"
                    className="form-control-custom form-control-custom-ex w-100"
                    component={fieldCleave}
                  />
                  <Button className="submit-btn">Save your username</Button>
                </UsernameForm>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className="collapse-custom">
              <div className="head" onClick={() => this.setState(state => ({ phoneCollapse: !state.phoneCollapse }))}>
                <p className="label">
                  Phone Number
                  <span>
                    To send you free ETH sometimes, we’ll need your phone number to verify that you are not a robot. This is optional.
                  </span>
                </p>
                <div className="extend">
                  <Image className={this.state.phoneCollapse ? 'rotate' : ''} src={ExpandArrowSVG} alt="arrow" />
                </div>
              </div>
              <div className={`content ${this.state.phoneCollapse ? '' : 'd-none'}`}>
                <p className="text">We only send humans rewards. Please verify your phone number.</p>
                <p className="text">Enter phone number</p>
                <NumberPhoneForm onSubmit={this.onSubmitVerifyPhone}>
                  <div className="phone-block">
                    <div className="dropdown country-code">
                      <button
                        className="btn btn-secondary dropdown-toggle"
                        onClick={() => this.setState(state => ({ isShowCountryCode: !state.isShowCountryCode }))}
                        type="button"
                      >
                        {countryCode.dialCode}
                      </button>
                      <div className={`dropdown-menu ${this.state.isShowCountryCode ? 'show' : ''}`}>
                        <div className="dropdown-item">
                          <input className="search-country" type="text" onChange={e => this.filterCountries(e.target.value)} />
                        </div>
                        {
                          countries.map(country => (
                            <div
                              key={country.code}
                              className="dropdown-item"
                              onClick={() => this.selectPhoneRegionCode(country)}
                            >
                              {country.flag}{country.name}&nbsp;({country.dialCode})
                            </div>
                          ))
                        }
                      </div>
                    </div>
                    <Field
                      name="phone"
                      className="form-control-custom form-control-custom-ex phone-number"
                      component={fieldCleave}
                      propsCleave={{
                        options: { blocks: [4, 4, 4], delimiter: '-', numericOnly: true },
                      }}
                      onChange={(evt, value, unknown, name) => {
                        this.onTextFieldChange(name, value);
                      }}
                    />
                    <Button className="send-btn">Send</Button>
                  </div>
                  <p className="text">Enter verification code sent to your phone</p>
                  <Field
                    name="sms"
                    className="form-control-custom form-control-custom-ex w-100"
                    component={fieldCleave}
                    propsCleave={{
                      options: { blocks: [6], numericOnly: true },
                    }}
                    onChange={(evt, value, unknown, name) => {
                      this.onTextFieldChange(name, value);
                    }}
                    value={sms}
                  />
                  <Button className="submit-btn">Verify your number</Button>
                </NumberPhoneForm>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className="collapse-custom">
              <div className="head" onClick={() => this.setState(state => ({ emailCollapse: !state.emailCollapse }))}>
                <p className="label">
                  Email Verification
                  <span>You may prefer to receive updates and notifications via email. This is also optional.</span>
                </p>
                <div className="extend">
                  <Image className={this.state.emailCollapse ? 'rotate' : ''} src={ExpandArrowSVG} alt="arrow" />
                </div>
              </div>
              <div className={`content ${this.state.emailCollapse ? '' : 'd-none'}`}>
                <p className="text">Prefer to receive notifications and updates via email?</p>
                <p className="text">Enter your email</p>
                <EmailForm onSubmit={this.onSubmitVerifyEmail}>
                  <Field
                    name="email"
                    className="form-control-custom form-control-custom-ex w-100"
                    component={fieldCleave}
                    onChange={(evt, value, unknown, name) => {
                      this.onTextFieldChange(name, value);
                    }}
                    value={email}
                  />
                  <Button className="submit-btn">Verify your email</Button>
                </EmailForm>
              </div>
            </div>
          </Col>
        </Row>
        <ModalDialog onRef={modal => this.modalVerifyRef = modal}>
          <div className="modal-verify">
            <Image src={CheckedSVG} alt="checked" />
            <p>Successed!</p>
            <p>{ this.state.successMessage ? this.state.successMessage : 'Your authentication is verified' }</p>
          </div>
        </ModalDialog>
      </Grid>
    );
  }
}

Profile.propTypes = {
  showAlert: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  setHeaderTitle: PropTypes.func.isRequired,
  checkUsernameExist: PropTypes.func.isRequired,
  authUpdate: PropTypes.func.isRequired,
};

const mapState = state => ({
  auth: state.auth,
});

const mapDispatch = {
  setHeaderTitle,
  verifyPhone,
  submitPhone,
  verifyEmail,
  submitEmail,
  showAlert,
  checkUsernameExist,
  authUpdate,
};

export default connect(mapState, mapDispatch)(Profile);
