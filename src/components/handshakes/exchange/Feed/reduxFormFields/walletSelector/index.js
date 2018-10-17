/* eslint react/prop-types:0 */

import React from 'react';
import WalletSelector from '../../../components/WalletSelector';
import './styles.scss';

const walletSelectorField = ({ input, meta }) => {
  const { onChange } = input;
  const error = meta?.error;
  return (
    <div className="wallet-selector-field">
      <WalletSelector onChange={wallet => { onChange(wallet); }} />
      { error && <span className="err-msg">{error}</span>}
    </div>
  );
};

export default walletSelectorField;
