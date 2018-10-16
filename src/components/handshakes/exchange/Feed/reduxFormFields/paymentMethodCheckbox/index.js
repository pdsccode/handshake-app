/* eslint react/prop-types:0 */
import React from 'react';

const paymentMethodCheckbox = ({ input, name, titles, items, disabled = false }) => {
  const { onChange, value } = input;
  return (
    <div className="rf-type-atm-container d-table w-100" onChange={({ target }) => onChange(target.value)}>
      {Object.entries(items).map(([key, itemValue]) => {
        console.log('key, item_value ', key, itemValue);
        const label = titles[itemValue];
        console.log('titels', titles, label);
        return (
          <label key={key} className="radio-inline rf-type-atm-radio-container d-table-cell w-50">
            <input
              value={itemValue}
              type="radio"
              name={name}
              checked={value === itemValue}
              onChange={() => null}
              disabled={disabled}
            />
            <span className={`checkmark ${disabled && value !== itemValue && 'disabled'}`} />
            <span className={`${disabled && value !== itemValue && 'disabled'}`}>{label}</span>
          </label>
        );
      })}
    </div>
  );
};

export default paymentMethodCheckbox;
