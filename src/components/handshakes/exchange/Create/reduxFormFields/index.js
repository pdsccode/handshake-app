/* eslint  react/prop-types:0 */
import React from 'react';
import Switch from '@/components/core/controls/Switch/Switch';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import RelocationMap from '../components/RelocationMap';
import './styles.scss';

export const fieldTypeAtm = ({ input, texts, atmType }) => {
  const { onChange, value } = input;
  return (
    <div className="rf-type-atm-container" onChange={({ target }) => onChange(target.value)}>
      {Object.entries(atmType).map(([key, name]) => {
        const label = name === atmType.PERSONAL ? texts.personalAtm : texts.storeAtm;
        return (
          <label key={key} className="radio-inline rf-type-atm-radio-container">
            <input
              value={name}
              type="radio"
              name="typeAtm"
              checked={value === name}
            />
            <span className="checkmark" />
            <span>{label}</span>
          </label>
        );
      })}
    </div>
  );
};

export const fieldAtmStatus = ({ input, texts, atmStatus }) => {
  const { onChange, value } = input;
  return (
    <div className="rf-status-atm">
      <div className="rf-status-atm-title">
        <span>{texts.statusTitle}</span>
      </div>
      <div>
        <Switch
          isChecked={value === atmStatus.OPEN}
          onChange={_value => {
          return onChange(_value ? atmStatus.OPEN : atmStatus.CLOSE);
          }}
        />
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

export const mapField = ({ input }) => {
  const { value, onChange } = input;
  const position = { lat: value.lat, lng: value.lng };
  return (
    <RelocationMap
      position={position}
      onAddressResolved={onChange}
    />
  );
};
