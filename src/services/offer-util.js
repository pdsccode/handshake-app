import local from '@/services/localStore';
import {AMOUNT_DECIMAL, APP, HANDSHAKE_USER, PRICE_DECIMAL} from '@/constants';
import {BigNumber} from "bignumber.js";

export function getOfferPrice(listOfferPrice = [], type = '', currency = '') {
  let result = null;

  for (const offerPrice of listOfferPrice) {
    if (offerPrice.type === type && offerPrice.currency === currency) {
      result = offerPrice;
      break;
    }
  }

  return result;
}

export function getHandshakeUserType(initUserId, shakeUserIds = []) {
  const profile = local.get(APP.AUTH_PROFILE);
  const userId = profile.id;

  if (userId === initUserId) {
    return HANDSHAKE_USER.OWNER;
  } else if (shakeUserIds.includes(userId)) {
    return HANDSHAKE_USER.SHAKED;
  }
  return HANDSHAKE_USER.NORMAL;
}

export function formatMoney(price = 0) {
  return new BigNumber(price).toFormat(PRICE_DECIMAL);
}

export function formatAmountCurrency(amount = 0) {
  return amount.toString();
  // return new BigNumber(amount).toFormat(AMOUNT_DECIMAL);
}

export default { getOfferPrice };
