import axios from "axios";
import { isEmpty, join } from "lodash";
import { stringify } from "query-string";
import { getToken } from "utils/helpers";
import security from "../middleware/security";

const instance = axios.create({
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-cache ",
  },
});



instance.interceptors.request.use(
  (request) => {
    const { method, baseURL, url } = request;
    let accessToken = getToken("hasToken");
    let meAPIHeader = {};
    const urlFull = baseURL + url;

    if (accessToken === null) accessToken = "";
    if (accessToken !== "") {
      meAPIHeader.Authorization = accessToken;
    }
    
    // debug log
    // console.log(request?.data, {
    //   method,
    //   urlFull,
    //   payload: method.toUpperCase() !== "GET" ? request?.data : request?.params,
    // });

    // check security
    const encrypt = security.RequestEncrypt(
      urlFull,
      method.toUpperCase(),
      method.toUpperCase() !== "GET" ? request?.data : request?.params,
      accessToken
    );

    meAPIHeader = encrypt.headers;
    request.headers = { ...request.headers, ...meAPIHeader };
    request.data = encrypt.body;
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    const { data, config, headers } = response;
    let accessToken = config.headers.Authorization;
    if (config.headers.Authorization === undefined) accessToken = "";

    let dataDecrypted = security.ResponseDecrypt(
      headers["x-api-action"],
      config.method.toUpperCase(),
      headers["x-api-client"],
      headers["x-api-key"],
      data["x-api-message"],
      headers["x-api-validate"],
      accessToken
    );

    const responseConfig = {
      ...response,
      data: dataDecrypted.data || [],
      status: dataDecrypted.code || -1,
    };

    // console.log(responseConfig);

    return responseConfig;
  },
  (error) => {
    if (error.message === "Network Error") {
      error = {
        status: "NETWORK_ERR",
        data: {
          message: error.message,
        },
      };
      return error;
    }
    return Promise.reject(error);
  }
);

export default instance;

/**
 * Make XMLHttpRequests with Axios instance.
 *
 * @param {String} url
 * @param {String} method
 * @param {Object} data
 * @param {Object} reqConfig
 *
 * @return
 */

export async function makeRequest(
  url,
  baseURL,
  method = "GET",
  data = {},
  reqConfig = {}
) {
  let querryParams;
  let response = null;
  let urlGet;
  instance.defaults.baseURL = baseURL;
  try {
    switch (method) {
      case "GET":
        querryParams = stringify(data);
        urlGet = isEmpty(querryParams) ? url : join([url, querryParams], "?");
        response = await instance.get(urlGet, reqConfig);
        break;
      case "POST":
        response = await instance.post(url, data, reqConfig);
        break;
      case "PUT":
        response = await instance.put(url, data, reqConfig);
        break;
      case "DELETE":
        response = await instance.delete(url, data, reqConfig);
        break;
      default:
        throw new Error("Invaild method.");
    }
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}
