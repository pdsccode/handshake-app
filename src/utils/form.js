/* eslint react/prop-types: 0 */
/* eslint jsx-a11y/label-has-for: 0 */

import React from 'react';
import isEmail from 'validator/lib/isEmail';

export const renderField = (props) => {
  const {
    input,
    label,
    type,
    appendLabel,
    placeholder,
    groupClass,
    fieldClass,
    errorClass,
    meta: { touched, error, warning },
  } = props;

  const labelHtml = (label && <label>{label}</label>);

  return (
    <div className={groupClass}>
      {!appendLabel && labelHtml}
      <input
        {...input}
        className={fieldClass}
        placeholder={placeholder}
        type={type}
      />
      {appendLabel && labelHtml}
      {touched && ((error && <span className={errorClass}>{error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  );
};

/**
 * Validator empty value of control
 * @param {Value of control} value
 */
export const required = (value) => {
  return (!value) ? 'Required' : null;
};

/**
 * Validator email address
 * @param {Email string} value
 */
export const email = (value) => {
  return !isEmail(value) ? ('Invalid email address') : null;
};
