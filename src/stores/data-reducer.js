import * as immutable from '@/stores/immutable';
import { dataActionConst } from '@/stores/data-action';

export default function dataReducer(state = {}, action) {
  const rIndex = action.type.indexOf('_DATA/');
  const type = (rIndex >= 0) ? action.type.substring(0, rIndex + 5) : action.type;
  if (Object.keys(dataActionConst).includes(type)) {
    return immutable[type.toLowerCase()](state, action.meta._path, action.payload); // eslint-disable-line
  }
  return state;
}
