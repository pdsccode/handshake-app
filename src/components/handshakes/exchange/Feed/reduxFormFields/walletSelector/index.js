/* eslint react/prop-types:0 */

import React from 'react';
import WalletSelector from '../../../components/WalletSelector';
import './styles.scss';

const walletSelectorField = ({ input }) => {
  const { onChange } = input;
  return (
    <WalletSelector onChange={wallet => { onChange(wallet); }} />
  );
};

export default walletSelectorField;
