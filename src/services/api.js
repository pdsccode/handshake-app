import axios from 'axios';
import qs from 'qs';
import { isEmpty, merge } from 'lodash';
import local from '@/services/localStore';
import { APP } from '@/constants';
import { BASE_API } from '@/config';

const $http = (url, data, id, qsObject, headersMore, method = 'GET') => {
  let QS = '';

  if (!isEmpty(qsObject)) {
    QS = qs.stringify(qsObject);
  }

  const token = local.get(APP.AUTH_TOKEN);

  let headers = {
    'Content-Type': 'application/json',
  };

  if (!isEmpty(headersMore)) {
    headers = merge(headers, headersMore);
  }

  if (token) {
    headers.Payload = token;
  }

  // if (wallet && wallet.chainId) {
  //   headers.ChainId = wallet.chainId;
  // }

  return axios.create({
    timeout: BASE_API.TIMEOUT,
    headers,
  })[method.toLocaleLowerCase()](`${url}${id ? `${id}/` : ''}${QS ? `?${QS}` : ''}`, data);
};

export default $http;
