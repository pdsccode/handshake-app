const devConfig = require('./config.development');
const prodConfig = require('./config.production');

const finalConfig = process.env.isProduction ? prodConfig : devConfig;
module.exports = finalConfig;
