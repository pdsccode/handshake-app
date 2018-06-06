const devConstants = require('./constants.development');
const prodConstants = require('./constants.production');

const finalConstants = process.env.isProduction ? prodConstants : devConstants;
module.exports = finalConstants;
