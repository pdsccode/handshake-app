import isEmail from 'validator/lib/isEmail';
import isURL from 'validator/lib/isURL';
import isInt from 'validator/lib/isInt';

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

/**
 * Validator URL
 * @param value
 */
export const urlValidator = (value) => {
  return isURL(value) ? null : ('Invalid URL');
};

/**
 * Validator Int with min-max
 * @param value
 */
export const intValidator = (value, min, max) => {
  return isInt(value, { min, max }) ? null : (`Please enter an integer number from ${min} to ${max}`);
};

export const allFieldHasData = (value, allValues) => {
  return !allValues.outcomes.find(i => Object.keys(i).length > 0) ? 'Required' : null;
}
