import devConstants from './constants.development';
import prodConstants from './constants.production';

const finalConstants = process.env.isProduction ? prodConstants : devConstants;
export default finalConstants;
