import axios from 'axios';

/**
 * Main HTTP methods
 * @param uri
 * @param params
 * @returns
 */

const get = async (uri: string, params: object = {}) => {
  const res = await axios.get(url(uri), { params: params });
  return res?.data?.response;
};
const post = async (uri: string, data: object = {}) => {
  const res = await axios.post(url(uri), data);
  return res?.data?.response;
};
const put = async (uri: string, data: object = {}) => {
  const res = await axios.put(url(uri), data);
  return res?.data?.response;
};
const remove = async (uri: string, data: object = {}) => {
  const res = await axios.delete(url(uri), data);
  return res?.data?.response;
};

/**
 * Helper methods
 * @param uri
 * @returns
 */
const url = (uri: string) => {
  return uri.replace(/^\/+/, '');
};

/** Exports */

export default { get, post, put, remove };
