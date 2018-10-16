/* eslint react/prop-types:0 */

import React from 'react';
import WalletSelector from '../../../components/WalletSelector';

const walletSelectorField = ({ input, meta }) => {
  const { onChange } = input;
  const error = meta?.error;
  return (
    <div style={{ width: '100%' }}>
      <WalletSelector onChange={wallet => { onChange(wallet); }} />
      { error && <span className="text-danger">{error}</span>}
    </div>
  );
};

export default walletSelectorField;
