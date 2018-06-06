import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// services
import createForm from '@/components/core/form/createForm';
import { setHeaderTitle, showAlert } from '@/reducers/app/action';
import { checkUsernameExist, authUpdate } from '@/reducers/auth/action';
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

const NumberPhoneForm = createForm({
  propsReduxForm: {
    form: 'NumberPhoneForm',
  },
});
const EmailForm = createForm({
  propsReduxForm: {
    form: 'EmailForm',
  },
});

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
    };
    // bind
    this.verifyPhone = ::this.verifyPhone;
    this.verifyEmail = ::this.verifyEmail;
    this.selectPhoneRegionCode = ::this.selectPhoneRegionCode;
    this.filterCountries = ::this.filterCountries;
    this.addUsername = ::this.addUsername;

    props.setHeaderTitle('My Profile');

    this.UsernameForm = createForm({
      propsReduxForm: {
        form: 'UsernameForm',
        initialValues: { username: props.auth.profile.username },
      },
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

  verifyPhone() {
    this.modalVerifyRef.open();
  }

  verifyEmail() {
    this.modalVerifyRef.open();
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

  render() {
    const { countryCode, countries } = this.state;
    const { UsernameForm } = this;
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
                <NumberPhoneForm onSubmit={this.verifyPhone}>
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
                      name="phone-number"
                      className="form-control-custom form-control-custom-ex phone-number"
                      component={fieldCleave}
                      propsCleave={{
                        options: { blocks: [4, 4, 4], delimiter: '-', numericOnly: true },
                      }}
                    />
                    <Button className="send-btn">Send</Button>
                  </div>
                  <p className="text">Enter verification code sent to your phone</p>
                  <Field
                    name="sms-code"
                    className="form-control-custom form-control-custom-ex w-100"
                    component={fieldCleave}
                    propsCleave={{
                      options: { blocks: [4], numericOnly: true },
                    }}
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
                <EmailForm onSubmit={this.verifyEmail}>
                  <Field
                    name="phone-number"
                    className="form-control-custom form-control-custom-ex w-100"
                    component={fieldCleave}
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
            <p>Your authentication phone number is verified</p>
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

const mapDispatch = ({
  showAlert,
  setHeaderTitle,
  checkUsernameExist,
  authUpdate,
});

export default connect(mapState, mapDispatch)(Profile);
