export const formatAmount = (amount, ROUND = 10000) => {
  return Math.floor(amount * ROUND) / ROUND;
};
