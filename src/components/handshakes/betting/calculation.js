import { parseBigNumber, formatOdds, formatAmount } from '@/components/handshakes/betting/utils';
import { SIDE } from '@/components/handshakes/betting/constants.js';

const TAG = 'BETTING_CALCULATION';

function calculateOdds(element) {
  const odds = parseBigNumber(element.odds);
  const oneBN = parseBigNumber(1);
  const typeOdds = odds.div(odds.minus(oneBN));
  console.log(TAG, ' defaultSupportOdds = ', typeOdds.toNumber());
  return typeOdds.toNumber() || 0;
}

export const calculateWinValues = (amount, odds) => {
  return parseBigNumber(amount).times(parseBigNumber(odds)).toNumber() || 0;
};

export const defaultOdds = (type) => {
    if (type && type.length > 0) {
      console.log(TAG, 'Sorted Type Odds:', type);
      const element = type[type.length - 1];
      return calculateOdds(element);
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
