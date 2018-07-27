import { SET_DATA } from '@/stores/data-action';

export const updateEmail = (value) => {
  return SET_DATA({
    type: 'CREATEMARKET:UPDATE_EMAIL',
    _path: 'auth.profile.email',
    _value: value,
  });
};
