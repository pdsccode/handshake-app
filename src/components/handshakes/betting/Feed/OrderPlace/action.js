import { SET_DATA } from '@/stores/data-action';

export const updateSide = (val) => {
  return SET_DATA({
    type: 'PREDICTION:UPDATE_SIDE',
    _path: 'ui.side',
    _value: val,
  });
};
