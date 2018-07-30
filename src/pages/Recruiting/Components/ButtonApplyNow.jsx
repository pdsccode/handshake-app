import React from 'react';
import { FormattedMessage } from 'react-intl';

export default (props) => {
  const { onClick, className = '' } = props;
  return (
    <button
      className={`btn btn-primary btn-lg ${className}`}
      onClick={onClick}
      // style={{ minWidth: '159px' }}
    >
      <FormattedMessage id="landing_page.recruiting.button.applyNow" />
    </button>
  )
}
