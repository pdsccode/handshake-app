import {minValue} from "@/components/core/form/validation";
import {
  MIN_AMOUNT,
  CRYPTO_CURRENCY,
} from "@/constants";
const minValueETH = minValue(MIN_AMOUNT[CRYPTO_CURRENCY.ETH]);
const minValueBTC = minValue(MIN_AMOUNT[CRYPTO_CURRENCY.BTC]);

export const validate = (values) => {
  const { amountBuy, amountSell, currency } = values
  const errors = {}

  const amountBuyFloat = parseFloat(amountBuy, 10)
  const amountSellFloat = parseFloat(amountSell, 10)
  const wantToBuy = amountBuyFloat && amountBuyFloat > 0
  const wantToSell = amountSellFloat && amountSellFloat > 0
  if (!wantToBuy && !wantToSell) {
    errors.amountBuy = errors.amountSell = 'One of these is required'
  } else {
    const validateMin = currency === CRYPTO_CURRENCY.BTC ? minValueBTC : minValueETH
    if (wantToBuy) {
      errors.amountBuy = validateMin(amountBuy)
    }
    if (wantToSell) {
      errors.amountSell = validateMin(amountSell)
    }
  }

  return errors
}
