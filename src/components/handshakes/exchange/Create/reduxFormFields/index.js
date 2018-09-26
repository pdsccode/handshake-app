/* eslint  react/prop-types:0 */
import React from 'react';
import Switch from '@/components/core/controls/Switch/Switch';
import TimePicker from 'rc-time-picker';
import moment from 'moment';

export const fieldTypeAtm = ({ input, texts, atmType }) => {
  const { onChange, value } = input;
  return (
    <div onChange={({ target }) => onChange(target.value)}>
      {Object.entries(atmType).map(([key, name]) => {
        const label = name === atmType.PERSONAL ? texts.personalAtm : texts.storeAtm;
        return (
          <label key={key} className="radio-inline">
            <input
              value={name}
              type="radio"
              name="typeAtm"
              checked={value === name}
            />
            {label}
          </label>
        );
      })}
    </div>
  );
};

export const fieldAtmStatus = ({ input, texts }) => {
  const { onChange, value } = input;
  return (
    <div>
      <div>
        <div>
          {texts.statusTitle}
        </div>
        <div>
          <Switch isChecked={!!value} onChange={onChange} />
        </div>
      </div>
    </div>
  );
};

export const fieldTimePicker = ({ input, defaultTime }) => {
  const { onChange, value } = input;
  const now = moment().hour(0).minute(0);
  const TIME_FORMAT = 'HH:mm';
  const timeValue = value || defaultTime || moment('08:00', TIME_FORMAT);
  return (
    <div>
      <TimePicker
        name="startTime"
        showSecond={false}
        defaultValue={now}
        value={timeValue}
        onChange={onChange}
        format={TIME_FORMAT}
        inputReadOnly
        showMinute={false}
      />
    </div>
  );
};
