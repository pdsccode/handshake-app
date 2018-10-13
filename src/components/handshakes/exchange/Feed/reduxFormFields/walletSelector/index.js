import React from 'react';
import WalletSelector from '../../../components/WalletSelector';
import './styles.scss';

export default (input) => {
  return <WalletSelector onChange={console.log}/>;
};
