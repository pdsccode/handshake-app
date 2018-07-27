/* eslint react/prop-types: 0 */

import React from 'react';
import classNames from 'classnames';

export const renderField = (props) => {
  const {
    input,
    label,
    type,
    placeholder,
    className,
    meta: { touched, error, warning },
  } = props;

  const cls = classNames(className, {
    'form-error': error,
    'form-warning': warning,
  });

  return (
    <div className={cls}>
      {label && <label>{label}</label>}
      <input
        {...input}
        className={className}
        placeholder={placeholder}
        type={type}
      />
      {touched && ((error && <span className="ErrorMsg">{error}</span>) || (warning && <span className="WarningMsg">{warning}</span>))}
    </div>
  );
};
