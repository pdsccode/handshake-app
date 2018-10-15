const coinMoneyExchange = (values = {}) => {
  const { amount, fiatAmount } = values;
  const errors = {};

  if (amount <= 0 || fiatAmount <= 0) {
    errors.coinMoneyExchange = 'Required';
    return errors;
  }
  return null;
};

export default coinMoneyExchange;
