/* eslint react/prop-types:0 */

import React from 'react';
import CoinMoneyExchange from '../../../components/CoinMoneyExchange';
import './styles.scss';

const coinMoneyExchangeField = ({ input, currency }) => {
  // const { onChange } = input;
  return (
    <CoinMoneyExchange currency={currency} onChange={console.log} />
  );
};

export default coinMoneyExchangeField;
