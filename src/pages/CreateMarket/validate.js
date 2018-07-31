import isEmail from 'validator/lib/isEmail';

/**
 * Validator empty value of control
 * @param value
 */
export const required = (value) => {
  return (!value) ? 'Required' : null;
};

/**
 * Validator email address
 * @param value
 */
export const email = (value) => {
  return !isEmail(value) ? ('Invalid email address') : null;
};

export const allFieldHasData = (value, allValues) => {
  return !allValues.outcomes.find(i => Object.keys(i).length > 0) ? 'Required' : null;
}
