/* eslint react/prop-types: 0 */
/* eslint import/prefer-default-export: 0 */

import React from 'react';
import Select from 'react-select';
import classNames from 'classnames';

function renderByType(props) {
  if (props.type === 'select') {
    const { name, value, onChange } = props.input;
    const finalValue = (typeof value === 'string' || typeof value === 'number')
      ? props.options.find(o => o.value === value) : value;
    return (
      <Select
        classNamePrefix="react-select"
        name={name}
        value={finalValue}
        onChange={onChange}
        placeholder={props.placeholder}
        isDisabled={props.disabled}
        options={props.options}
      />
    );
  }
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
