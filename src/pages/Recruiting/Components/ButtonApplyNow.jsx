import React from 'react';
import { FormattedMessage } from 'react-intl';

export default (props) => {
  const { onClick, className = '', text = <FormattedMessage id="landing_page.recruiting.button.applyNow" />} = props;
  return (
    <button
      className={`btn btn-primary btn-lg ${className}`}
      onClick={onClick}
      // style={{ minWidth: '159px' }}
    >
      {text}
    </button>
  )
}
