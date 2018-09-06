import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import IconEmail from '@/assets/images/icon/icon-email.svg';
import { renderField } from './form';
import { required, email } from './validate';
import { sendEmailCode, verifyEmail } from './action';
import { isValidEmailCode } from './selector';

class EmailForm extends React.Component {
  static displayName = 'EmailForm';
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isPristine: true,
    };
  }

  onSubmit = (value) => {
    const { props, state } = this;
    const { isPristine } = state;
    const { email, code } = value;
    if (isPristine) {
      this.setState({ isPristine: false });
      this.props.dispatch(sendEmailCode({ email }));
    } else {
      this.props.dispatch(verifyEmail({ email, code }));
      this.validateCode(props);
    }
  }

  validateCode = (props) => {
    const { isValidCode } = props;
    if (!isValidCode) {
      throw new SubmissionError({
        code: 'Code is not valid',
        _error: 'Email varified failed!',
      });
    }
  }

  renderEmailField = () => {
    return (
      <Field
        name="email"
        type="email"
        className="form-group"
        fieldClass="form-control"
        component={renderField}
        placeholder="Your email address"
        validate={[required, email]}
      />
    );
  }

  renderCodeField = () => {
    return (
      <Field
        name="code"
        type="text"
        className="form-group"
        fieldClass="form-control"
        component={renderField}
        placeholder="Your code"
        validate={[required]}
      />
    );
  }

  renderForm = (props, state) => {
    const { renderEmailField, renderCodeField, onSubmit } = this;
    const { isPristine } = state;
    const buttonText = isPristine ? 'Next' : 'Verify your email';
    return (
      <form className="EmailRequiredForm" onSubmit={props.handleSubmit(onSubmit)}>
        { isPristine ? renderEmailField() : renderCodeField() }
        <button type="submit" className="btn btn-primary btn-block">{buttonText}</button>
      </form>
    );
  }

  renderComponent = (props, state) => {
    const { isPristine } = state;
    const notedText = isPristine ? 'We will need your email information to send notifications of your market' : 'Enter the secret code sent to your email.';
    return (
      <div className="EmailRequiredContainer">
        <img src={IconEmail} alt="" className="EmailRequiredIcon" />
        <div className="EmailRequiredTitle">Email required</div>
        <div className="EmailRequiredNoted">{notedText}</div>
        {this.renderForm(props, state)}
      </div>
    );
  };

  render() {
    return (
      <div className={EmailForm.displayName}>
        {this.renderComponent(this.props, this.state)}
      </div>
    );
  }
}

/* eslint no-class-assign:0 */
EmailForm = connect(
  (state) => {
    return {
      isValidCode: isValidEmailCode(state),
    };
  },
)(EmailForm);

export default reduxForm({
  form: 'emailForm',
  enableReinitialize: true,
  clearSubmitErrors: true,
})(EmailForm);
