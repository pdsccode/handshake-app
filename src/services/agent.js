import superagentPromise from 'superagent-promise';
//import _superagent from 'superagent';
import superagent from 'superagent'
const req = superagentPromise(superagent, global.Promise);

const API_ROOT = 'http://35.198.228.87';
// const API_ROOT = 'https://dad.ninja.org';
// const API_ROOT = 'http://localhost:8000';

export default {API_ROOT, req};
