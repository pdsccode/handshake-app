/* eslint react/prop-types:0 */

import React from 'react';
import CoinMoneyExchange from '../../../components/CoinMoneyExchange';
import './styles.scss';

const coinMoneyExchangeField = ({ input, currency, paymentMethod, meta }) => {
  const error = meta?.error;
  const { onChange } = input;
  return (
    <div className="coin-money-exchange-field">
      <CoinMoneyExchange currency={currency} paymentMethod={paymentMethod} onChange={data => { onChange(data); }} />
      { error && <span className="err-msg">{error}</span>}
    </div>
  );
};

export default coinMoneyExchangeField;
