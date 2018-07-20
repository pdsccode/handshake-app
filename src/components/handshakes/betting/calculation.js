import { parseBigNumber, formatOdds, formatAmount } from '@/components/handshakes/betting/utils';
import { SIDE } from '@/components/handshakes/betting/constants.js';

const TAG = 'BETTING_CALCULATION';

export const calculateOdds = (odds) => {
  const oddsBN = parseBigNumber(odds);
  const oneBN = parseBigNumber(1);
  const typeOdds = oddsBN.div(oddsBN.minus(oneBN));
  console.log(TAG, ' defaultSupportOdds = ', typeOdds.toNumber());
  return typeOdds.toNumber() || 0;
};

export const calculateWinValues = (amount, odds) => {
  return parseBigNumber(amount).times(parseBigNumber(odds)).toNumber() || 0;
};

export const defaultOdds = (type) => {
    if (type && type.length > 0) {
      console.log(TAG, 'Sorted Type Odds:', type);
      const element = type[type.length - 1];
      return calculateOdds(element.odds);
    }
    return 0;
};

export const defaultAmount = (list) => {
  if (list && list.length > 0) {
    const element = list[list.length - 1];
    // const guessAmout = element.amount * (element.odds - 1);
    const amountBN = parseBigNumber(element.amount);
    const oddBN = parseBigNumber(element.odds);
    const oneBN = parseBigNumber(1);
    const guessAmout = amountBN.times(oddBN.minus(oneBN));
    console.log(TAG, ' defaultSupportAmount = ', guessAmout.toNumber());
    return guessAmout.toNumber() || 0;
  }
  return 0;
};

export const calculateBetDefault = ( side, marketSupportOdds, marketAgainstOdds, amountSupport, amountAgainst) => {
  const marketOdds = (side === SIDE.SUPPORT) ? marketSupportOdds : marketAgainstOdds;
  const marketAmount = (side === SIDE.SUPPORT) ? amountSupport : amountAgainst;
  const winValue = calculateWinValues(marketAmount, marketOdds);
  const defaultValues = {
    marketOdds: formatOdds(marketOdds),
    marketAmount: formatAmount(marketAmount),
    winValue: formatAmount(winValue),
  };
  return defaultValues;
};
