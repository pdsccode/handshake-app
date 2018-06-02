
export const SIDE = {
  GUEST: 0,
  SUPPORT: 1,
  AGAINST: 2,
};

export const BETTING_STATUS = {
  INITED: -1,
  DRAW: 0,
  SUPPORT_WIN: 1,
  AGAINST_WIN: 2,
};

export const BETTING_STATUS_LABEL =
    {
      CANCEL: 'Cancel',
      LOSE: 'Lose',
      WITHDRAW: 'Withdraw',
      WAITING_RESULT: 'Waiting Result',
    };

export class BetHandshakeHandler {
  static getStatusLabel(status, role, isMatch) {
    let label = null;
    let isAction = false;
    console.log('Role:', role);
    console.log('isMatch:', isMatch);

    if (!isMatch && role !== SIDE.GUEST) {
      label = BETTING_STATUS_LABEL.CANCEL;
      isAction = true;
    } else if (isMatch && role !== SIDE.GUEST && status === BETTING_STATUS.INITED) {
      label = BETTING_STATUS_LABEL.WAITING_RESULT;
      isAction = false;
    } else if (isMatch && role !== SIDE.GUEST && status === BETTING_STATUS.DRAW) {
      label = BETTING_STATUS_LABEL.WITHDRAW;
      isAction = true;
    } else if (isMatch && status === BETTING_STATUS.SUPPORT_WIN && role === SIDE.SUPPORT) {
      label = BETTING_STATUS_LABEL.WITHDRAW;
      isAction = true;
    } else if (isMatch && status === BETTING_STATUS.SUPPORT_WIN && role === SIDE.AGAINST) {
      label = BETTING_STATUS_LABEL.LOSE;
      isAction = false;
    } else if (isMatch && status === BETTING_STATUS.AGAINST_WIN && role === SIDE.SUPPORT) {
      label = BETTING_STATUS_LABEL.LOSE;
      isAction = false;
    } else if (isMatch && status === BETTING_STATUS.AGAINST_WIN && role === SIDE.AGAINST) {
      label = BETTING_STATUS_LABEL.WITHDRAW;
      isAction = true;
    }
    return { title: label, isAction };
  }
}
