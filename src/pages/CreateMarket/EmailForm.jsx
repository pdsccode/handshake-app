import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import IconEmail from '@/assets/images/icon/icon-email.svg';
import { renderField } from './form';
import { required, email } from './validate';
import { updateEmail } from './action';

class EmailForm extends React.Component {
  static displayName = 'EmailForm';
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  onSubmit = (value) => {
    const { email } = value;
    this.props.dispatch(updateEmail(email));
  }

  renderForm = (props) => {
    const { onSubmit } = this;
    const { handleSubmit } = props;
    return (
      <form className="EmailRequiredForm" onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="email"
          type="email"
          className="form-group"
          fieldClass="form-control"
          component={renderField}
          placeholder="Your email address"
          validate={[required, email]}
        />
        <button type="submit" className="btn btn-primary btn-block">Next</button>
      </form>
    );
  }

  renderComponent = (props) => {
    return (
      <div className="EmailRequiredContainer">
        <img src={IconEmail} alt="" className="EmailRequiredIcon" />
        <div className="EmailRequiredTitle">Email required</div>
        <div className="EmailRequiredNoted">We will need your email information to send notifications of your market</div>
        {this.renderForm(props)}
      </div>
    );
  };

  render() {
    return (
      <div className={EmailForm.displayName}>
        {this.renderComponent(this.props)}
      </div>
    );
  }
}

export default reduxForm({
  form: 'emailForm',
  enableReinitialize: true,
  clearSubmitErrors: true,
})(EmailForm);
