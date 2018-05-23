import axios from 'axios';
import { HANDSHAKE_API } from '@/config';
import qs from 'qs';
import { isEmpty, merge } from 'lodash';

const $http = (api, data, token = '', id, qsObject, headersMore) => {
  let QS = '';

  if (!isEmpty(qsObject)) {
    QS = qs.stringify(qsObject);
  }

  let headers = {
    'Content-Type': 'application/json',
  };

  if (!isEmpty(headersMore)) {
    headers = merge(headers, headersMore);
  }

  if (token) {
    headers.Authorization = `JWT ${token}`;
  }
  return axios.create({
    baseURL: HANDSHAKE_API.BASE_URL,
    timeout: HANDSHAKE_API.TIMEOUT,
    withCredentials: true,
    headers,
  })[api.method](`${api.path}${id ? `${id}/` : ''}${QS ? `?${QS}` : ''}`, data);
};

export default $http;
