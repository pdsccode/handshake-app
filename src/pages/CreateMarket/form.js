/* eslint react/prop-types: 0 */
/* eslint import/prefer-default-export: 0 */

import React from 'react';
import classNames from 'classnames';

function renderByType(props) {
  switch (props.type) {
    case 'select':
      return (
        <select
          {...props.input}
          disabled={props.disabled}
          className="form-control custom-select"
        >
          {props.children}
        </select>
      );

    default:
      return (
        <input
          {...props.input}
          className={props.fieldClass}
          placeholder={props.placeholder}
          type={props.type}
          disabled={props.disabled}
        />
      );
  }
}

export const renderField = (props) => {
  const {
    label, className,
    meta: { touched, error, warning },
  } = props;

  const cls = classNames(className, {
    'form-error': touched && error,
    'form-warning': touched && warning,
  });

  return (
    <div className={cls}>
      {label && <label>{label}</label>}
      {renderByType(props)}
      {touched && ((error && <span className="ErrorMsg">{error}</span>) || (warning && <span className="WarningMsg">{warning}</span>))}
    </div>
  );
};
