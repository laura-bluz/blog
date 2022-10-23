// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
});
