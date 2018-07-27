import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';

import validate from './validate';
import classNames from "classnames";

const renderField = ({ input, label, type, placeholder, className, meta: { touched, error, warning } }) => {
  const cls = classNames(className, {
    'has-error': error,
    'has-warning': warning,
  });

  return (
    <div className={cls}>
      {label && <label>{label}</label>}
      <div>
        <input {...input} type={type} placeholder={placeholder} />
        {touched && error && <span className="ErrorMsg">{error}</span>}
        {touched && warning && <span className="WarningMsg">{warning}</span>}
      </div>
    </div>
  );
};

const CreateEventForm = props => {
  const { handleSubmit, pristine, reset, submitting } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Field
        name="clubName"
        type="text"
        component={renderField}
        label="Club Name"
        className="ClubName"
      />
      {/*<FieldArray name="members" component={renderMembers} />*/}
      {/*<div>*/}
        {/*<button type="submit" disabled={submitting}>Submit</button>*/}
        {/*<button type="button" disabled={pristine || submitting} onClick={reset}>*/}
          {/*Clear Values*/}
        {/*</button>*/}
      {/*</div>*/}
    </form>
  );
};

export default reduxForm({
  form: 'createOwnEvents', // a unique identifier for this form
  // validate,
})(CreateEventForm);
