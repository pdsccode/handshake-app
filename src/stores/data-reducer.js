import * as immutable from '@/stores/immutable';
import { dataActionConst } from '@/stores/data-action';

export default function dataReducer(state = {}, action) {
  const type = action.type.substring(0, action.type.indexOf('_DATA/') + 5);
  if (Object.keys(dataActionConst).includes(type)) {
    return immutable[type.toLowerCase()](state, action.meta._path, action.payload); // eslint-disable-line
  }
  return state;
}
