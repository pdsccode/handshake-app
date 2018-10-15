/* eslint react/prop-types:0 */

import React from 'react';
import CoinMoneyExchange from '../../../components/CoinMoneyExchange';

const coinMoneyExchangeField = ({ input, currency, paymentMethod, meta }) => {
  const error = meta?.error;
  const { onChange } = input;
  return (
    <div style={{ width: '100%' }}>
      <CoinMoneyExchange currency={currency} paymentMethod={paymentMethod} onChange={data => { onChange(data); }} />
      { error && <span className="text-danger">{error}</span>}
    </div>
  );
};

export default coinMoneyExchangeField;
