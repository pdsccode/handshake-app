import local from '@/services/local-store';
import moment from 'moment';

// const logParams = {
//   consoleOutput: true,
//   consoleOutputLevel: ['DEBUG', 'ERROR', 'WARNING'],
//   dateTimeFormat: 'DD-MM-YYYY HH:mm:ss.S',
//   outputPath: 'logs/',
//   fileNameDateFormat: 'DDMMYYYY',
//   fileNamePrefix: 'NINJA-',
// };
const TAG = 'LOG';
const templateLog = (value = '') => {
  const time = moment().format('LLLL');
  // const data = {};
  // data[time] = value;
  // return data;
  return {
    data: value,
    timeStamp: time,
  };
};
export default class LogManager {
  static saveLog(KEY = '', value = '') {
    const time = moment().valueOf();

    // const dataNewMessage = {};
    // dataNewMessage[time] = value;
    const data = local?.get(TAG)[KEY] || {};
    // data = {...data, templateLog(value)};
    data[value + time] = templateLog(value);

    const tempData = {};
    tempData[KEY] = data;

    // data[KEY] = templateLog(value);
    local?.save(TAG, tempData);
  }

  static bettingSaveLog(value) {
    LogManager.saveLog('Betting', value);
  }
}
