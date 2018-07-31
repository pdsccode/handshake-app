import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import createForm from '@/components/core/form/createForm';
import IconEmail from '@/assets/images/icon/icon-email.svg';
import { renderField } from './form';
import { required, email } from './validate';

class EmailForm extends React.Component {
  static displayName = 'EmailForm';
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    dispatch: PropTypes.func,
  };

  renderForm = (props) => {
    const { onSubmit } = props;
    const RenderForm = createForm({
      propsReduxForm: {
        form: 'emailRequired',
        enableReinitialize: true,
        clearSubmitErrors: true,
      },
    });
    return (
      <RenderForm className="EmailRequiredForm" onSubmit={onSubmit}>
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
      </RenderForm>
    );
  }

  renderComponent = (props, state) => {
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
        {this.renderComponent(this.props, this.state)}
      </div>
    );
  }
}

export default EmailForm;
