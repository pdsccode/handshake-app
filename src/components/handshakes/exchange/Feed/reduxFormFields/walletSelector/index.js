/* eslint react/prop-types:0 */

import React from 'react';
import WalletSelector from '../../../components/WalletSelector';
import './styles.scss';

const walletSelectorField = ({ input, meta }) => {
  const { onChange, onBlur, onFocus } = input;
  const { error, touched } = meta;
  const shouldShowError = !!(touched && error);
  return (
    <div className="wallet-selector-field">
      <WalletSelector
        onFocus={onFocus}
        onBlur={onBlur}
        markRequired={shouldShowError}
        onChange={onChange}
      />
      { shouldShowError && <span className="err-msg">{error}</span>}
    </div>
  );
};

export default walletSelectorField;
