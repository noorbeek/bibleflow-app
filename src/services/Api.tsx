import axios from 'axios';
import { ApiRequestParamsModel, ApiResponseModel } from 'models/Api';

/**
 * Main HTTP methods
 * @param uri
 * @param params
 * @returns
 */

const get = async (
  uri: string,
  params: ApiRequestParamsModel = {},
): Promise<ApiResponseModel> => {
  const res = await axios.get(url(uri), { params: params });
  return res?.data;
};
const post = async (
  uri: string,
  data: object = {},
): Promise<ApiResponseModel> => {
  const res = await axios.post(url(uri), data);
  return res?.data;
};
const put = async (
  uri: string,
  data: object = {},
): Promise<ApiResponseModel> => {
  const res = await axios.put(url(uri), data);
  return res?.data;
};
const remove = async (
  uri: string,
  data: object = {},
): Promise<ApiResponseModel> => {
  const res = await axios.delete(url(uri), data);
  return res?.data;
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

const Api = { get, post, put, remove };

export default Api;
