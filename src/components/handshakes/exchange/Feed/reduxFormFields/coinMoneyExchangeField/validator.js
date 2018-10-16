import React from 'react';
import { FormattedMessage } from 'react-intl';

const coinMoneyExchange = (values = {}) => {
  const { amount, fiatAmount } = values;

  if (amount <= 0 || fiatAmount <= 0) {
    return <FormattedMessage id="error.required" />;
  }
  return null;
};

export default coinMoneyExchange;
