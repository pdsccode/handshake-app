/* eslint react/prop-types:0 */

import React from 'react';
import CoinMoneyExchange from '../../../components/CoinMoneyExchange';
import './styles.scss';

const coinMoneyExchangeField = ({ input, currency, paymentMethod, meta }) => {
  const error = meta?.error?.coinMoneyExchange;
  const { onChange } = input;
  return (
    <div style={{ width: '100%' }}>
      <CoinMoneyExchange currency={currency} paymentMethod={paymentMethod} onChange={data => { console.log(data);onChange(data)}} />
      { error && <span style={{ color: 'red' }}>{error}</span>}
    </div>
  );
};

export default coinMoneyExchangeField;
