// All Utils related to Objects

export function removeItems(obj, keys) {
  return Object.keys(obj).reduce((result, key) => {
    return keys.includes(key) ? result : {
      ...result,
      [key]: obj[key],
    };
  }, {});
}

/**
 * Get Object key by value
 * @param {Object} obj
 * @param {Object Value} val
 */
export function getKeyByValue(obj, val) {
  return Object.keys(obj)[Object.values(obj).indexOf(val)];
}

/**
 * Check object empty
 * @param {Object} obj
 */
export function isEmpty(obj) {
  return Object.keys(obj).length;
}
