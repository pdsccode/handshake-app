import React, { Component } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { renderField } from '@/pages/CreateMarket/form';
import { codeValidator, emailValidator, required } from '@/pages/CreateMarket/validate';
import { Field, formValueSelector } from 'redux-form';
import { sendEmailCode, verifyEmail } from '@/pages/CreateMarket/action';
import { createEventFormName } from '@/pages/CreateMarket/constants';
import { isValidEmailCode } from '@/pages/CreateMarket/selector';

class EmailVerification extends Component {
  static displayName = 'EmailVerification';
  static propTypes = {
    className: PropTypes.string,
    email: PropTypes.string,
    emailCode: PropTypes.string,
    hasEmail: PropTypes.any,
    dispatch: PropTypes.func.isRequired,
    isValidCode: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    email: undefined,
    emailCode: undefined,
    hasEmail: undefined,
    isValidCode: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      isEmailSent: false,
    };
  }

  sendEmail = () => {
    this.props.dispatch(sendEmailCode({
      email: this.props.email,
    }));
    this.setState({
      isEmailSent: true,
    });
  }

  sendCode = () => {
    this.props.dispatch(verifyEmail({
      email: this.props.email,
      code: this.props.emailCode,
    }));
  }

  renderEmailBox = (props, state) => {
    return (
      <div className="FlexRow">
        <Field
          name="email"
          type="text"
          fieldClass="form-control"
          placeholder="e.g. ninja@gmail.com"
          component={renderField}
          validate={[required, emailValidator]}
          className="EmailCodeField"
          disabled={state.isEmailSent}
        />
        <button
          type="button"
          className="btn btn-primary EmailBtn"
          onClick={this.sendEmail}
          disabled={state.isEmailSent}
        >
          {state.isEmailSent ? 'Sent' : 'Send'}
        </button>
      </div>
    );
  }

  renderCodeBox = (props, state) => {
    if (!state.isEmailSent) return null;
    const validate = props.isValidCode ? [required] : [required, codeValidator];
    return (
      <React.Fragment>
        <span>Enter the secret code</span>
        <div className="FlexRow">
          <Field
            name="emailCode"
            type="text"
            fieldClass="form-control"
            placeholder="e.g. 0312"
            component={renderField}
            validate={validate}
            className="EmailCodeField"
            disabled={props.isValidCode}
          />
          <button
            type="button"
            className="EmailBtn btn btn-primary'"
            onClick={this.sendCode}
            disabled={props.isValidCode}
          >
            Verify
          </button>
        </div>
      </React.Fragment>
    );
  }

  renderHasEmail = (props) => {
    return (
      <React.Fragment>
        <span>Ninja will send you notifications via</span>
        <input
          className="form-control"
          name="email"
          type="text"
          disabled
          value={props.hasEmail}
        />
      </React.Fragment>
    );
  }

  renderComponent = (props, state) => {
    if (props.hasEmail) {
      return this.renderHasEmail(props, state);
    }
    return (
      <React.Fragment>
        <span>Ninja needs to send you notifications.</span>
        {this.renderEmailBox(props, state)}
        {this.renderCodeBox(props, state)}
      </React.Fragment>
    );
  };

  render() {
    const cls = cx(EmailVerification.displayName, {
      [this.props.className]: !!this.props.className,
    });
    return (
      <div className={cls}>
        <div className="CreateEventFormGroupTitle">Notification</div>
        {this.renderComponent(this.props, this.state)}
      </div>
    );
  }
}

const formSelector = formValueSelector(createEventFormName);
export default connect(
  (state) => {
    return {
      email: formSelector(state, 'email'),
      emailCode: formSelector(state, 'emailCode'),
      isValidCode: isValidEmailCode(state),
    };
  },
)(EmailVerification);
