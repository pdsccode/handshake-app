import { createAPI } from '@/reducers/action';

export const ACTIONS = {
  LOAD_DATASET_HISTORY: 'LOAD_DATASET_HISTORY',
};
export const loadDatasetHistory = createAPI(ACTIONS.LOAD_DATASET_HISTORY);
