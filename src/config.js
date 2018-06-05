import devConfig from './config.development';
import prodConfig from './config.production';

const finalConfig = process.env.isProduction ? prodConfig : devConfig;
export default finalConfig;
