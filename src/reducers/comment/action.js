import { BASE_API } from '@/config';
import { createAPI } from '@/reducers/action';

export const ACTIONS = {
  LOAD_COMMENTS: 'LOAD_COMMENTS',
  CREATE_COMMENT: 'CREATE_COMMENT',
};

export const loadCommentList = createAPI(ACTIONS.LOAD_COMMENTS);
export const createComment = createAPI(ACTIONS.CREATE_COMMENT);
export const success = data => ({ type: `${ACTIONS.LOAD_COMMENTS}_SUCCESS`, payload: data });
