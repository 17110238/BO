import axios from 'axios';
import CryptoJS from 'crypto-js';
import _ from 'lodash';
import md5 from 'md5';
import NodeRSA from 'node-rsa';
import ShortId from 'shortid';
import { isBuffer } from 'util';
import { getCookie, setCookie } from 'utils/helpers';
// import nextConfig from 'next.config';

const Request = {
  callAPI(
    method,
    url,
    pathUrl,
    args,
    headers,
    isSecurity = false,
    publicKey = null,
    privateKey = null
  ) {
    return new Promise(async (resolve, reject) => {

      try {
        let accessToken = '';
        let lang = 'vi';
        
        if (args && args.accessToken) {
          accessToken = `${args.accessToken}`;
          delete args.accessToken;
        }
        if (args && args.lang) {
          lang = `${args.lang}`;
          delete args.lang;
        }
        let apiUrl = `${url}${pathUrl}`;

        let apiHeader = {
          Authorization: accessToken,
          ...headers,
          Language: lang,
          'Content-Type': 'application/json; charset=utf-8',
          Accept: '*',
        };
        let apiBody = args;
        if (isSecurity) {
          apiUrl = `${url}${pathUrl}`;
          const encrypt = Request.RequestEncrypt(
            pathUrl,
            method.toUpperCase(),
            method.toUpperCase() === 'GET' ? '' : apiBody,
            apiHeader.Authorization || '',
            publicKey
          );
          apiHeader = { ...encrypt.headers, ...apiHeader };
          apiBody = encrypt.body;
        }
        const option = {
          method,
          url: apiUrl,
          headers: apiHeader,
          timeout: 2 * 60 * 1000,
        };
        if (method.toUpperCase() !== 'GET') {
          option.data = apiBody;
        }
        const response = await axios(option);

        if (isSecurity) {
          const httpResponse = response.headers;
          const results = Request.ResponseDecrypt(
            httpResponse['x-api-action'],
            method.toUpperCase(),
            httpResponse['x-api-client'],
            httpResponse['x-api-key'],
            response.data['x-api-message'],
            httpResponse['x-api-validate'],
            apiHeader.Authorization || '',
            privateKey
          );
          console.group('%c======= Fetch/XHR =======', 'font-weight: bold; color: yellow');
          console.time('-- Timing req->res');
          console.log('%c-- Request:', 'color: lime; font-weight: bold', {
            method,
            url,
            pathUrl,
            args,
            headers,
          });
          console.log('%c-- Response:', 'color: fuchsia; font-weight: bold', results);
          console.timeEnd('--Timing req -> res');
          console.groupEnd();
          return resolve(results);
        }
        resolve(response.data);
      } catch (error) {
        if (error && error?.response?.status && error?.response?.data?.code) {
          console.log({ method, pathUrl, args });
          error.response.data.message = 'Connect server error, please again!';
          resolve(error?.response?.data);
        }

        resolve({
          code: -1001,
          data: { message: 'Lỗi kết nối server, xin vui lòng thử lại sau.' },
        });
      }
    });
  },

  callAPIExport(
    method,
    url,
    pathUrl,
    args,
    headers,
    isSecurity = false,
    publicKey = null,
    privateKey = null
  ) {
    return new Promise(async (resolve, reject) => {
      console.log(url);
      try {
        let accessToken = '';
        let lang = 'vi';
        if (args && args.accessToken) {
          accessToken = `${args.accessToken}`;
          delete args.accessToken;
        }
        if (args && args.lang) {
          lang = `${args.lang}`;
          delete args.lang;
        }
        let apiUrl = `${url}${pathUrl}`;

        let apiHeader = {
          Authorization: accessToken,
          ...headers,
          Language: lang,
          'Content-Type': 'application/json; charset=utf-8',
          Accept: '*',
        };
        let apiBody = args;
        if (isSecurity) {
          apiUrl = `${url}${pathUrl}`;
          const encrypt = Request.RequestEncrypt(
            pathUrl,
            method.toUpperCase(),
            method.toUpperCase() === 'GET' ? '' : apiBody,
            apiHeader.Authorization || '',
            publicKey
          );
          apiHeader = { ...encrypt.headers, ...apiHeader };
          apiBody = encrypt.body;
        }
        const option = {
          method,
          url: apiUrl,
          headers: apiHeader,
          timeout: 2 * 60 * 1000,
          responseType: 'blob',
        };
        if (method.toUpperCase() !== 'GET') {
          option.data = apiBody;
        }
        const response = await axios(option);

        if (isSecurity) {
          const httpResponse = response.headers;
          const results = Request.ResponseDecrypt(
            httpResponse['x-api-action'],
            method.toUpperCase(),
            httpResponse['x-api-client'],
            httpResponse['x-api-key'],
            response.data['x-api-message'],
            httpResponse['x-api-validate'],
            apiHeader.Authorization || '',
            privateKey
          );
          console.group('%c======= Fetch/XHR =======', 'font-weight: bold; color: yellow');
          console.time('-- Timing req->res');
          console.log('%c-- Request:', 'color: lime; font-weight: bold', {
            method,
            url,
            pathUrl,
            args,
            headers,
          });
          console.log('%c-- Response:', 'color: fuchsia; font-weight: bold', results);
          console.timeEnd('--Timing req -> res');
          console.groupEnd();
          return resolve(results);
        }
        response?.headers['content-type'].startsWith('application/json')
          ? resolve(JSON.parse(await response.data.text()))
          : resolve(response);
      } catch (error) {
        if (error && error?.response?.status && error?.response?.data?.code) {
          console.log({ method, pathUrl, args });
          error.response.data.message = 'Connect server error, please again!';
          resolve(error?.response?.data);
        }

        resolve({
          code: -1001,
          data: { message: 'Lỗi kết nối server, xin vui lòng thử lại sau.' },
        });
      }
    });
  },
  callAPIUpload(
    method,
    url,
    pathUrl,
    args,
    headers,
    isSecurity = false,
    publicKey = null,
    privateKey = null
  ) {
    return new Promise(async (resolve, reject) => {
      const language = 'vi';
      try {
        let accessToken = '';

        let lang = 'vi';
        if (args && args.accessToken) {
          accessToken = `${args.accessToken}`;
          delete args.accessToken;
        }
        if (args && args.lang) {
          lang = `${args.lang}`;
          delete args.lang;
        }
        let apiUrl = `${url}${pathUrl}`;

        let apiHeader = {
          Authorization: accessToken,
          ...headers,
          Language: lang,
          'Content-Type': 'multipart/form-data',
          Accept: '*',
        };
        let apiBody = args;

        if (isSecurity) {
          apiUrl = `${url}${pathUrl}`;
          const encrypt = Request.RequestEncrypt(
            pathUrl,
            method.toUpperCase(),
            method.toUpperCase() === 'GET' ? '' : apiBody,
            apiHeader.Authorization || '',
            publicKey
          );
          apiHeader = { ...encrypt.headers, ...apiHeader };
          apiBody = encrypt.body;
        }
        const option = {
          method,
          url: apiUrl,
          headers: apiHeader,
          timeout: 2 * 60 * 1000,
          data: {},
        };
        if (method.toUpperCase() !== 'GET') {
          option.data = args.body;
        }
        const response = await axios(option);

        if (isSecurity) {
          const httpResponse = response.headers;
          const results = Request.ResponseDecrypt(
            httpResponse['x-api-action'],
            method.toUpperCase(),
            httpResponse['x-api-client'],
            httpResponse['x-api-key'],
            response.data['x-api-message'],
            httpResponse['x-api-validate'],
            apiHeader.Authorization || '',
            privateKey
          );
          console.log({ method, url, pathUrl, args, headers });
          console.log('results: ', results);
          return resolve(results);
        }
        resolve(response);
      } catch (error) {
        if (error && error?.response?.status && error?.response?.data?.code) {
          console.log(error);
          error.response.data.message = 'Connect server error, please again!';
          resolve(error?.response?.data);
        }

        resolve({
          code: -1001,
          data: { message: 'Lỗi kết nối server, xin vui lòng thử lại sau.' },
        });
      }
    });
  },

  RequestEncrypt(pathUrl, method, payload, accessToken, publicKey) {
    const encryptKey = ShortId.generate();
    const key = new NodeRSA(publicKey);
    const xAPIKey = key.encrypt(encryptKey, 'base64');
    let body = '';
    const xApiAction = CryptoJS.AES.encrypt(pathUrl, encryptKey).toString();
    let xApiMessage = '';
    if (payload) {
      xApiMessage = CryptoJS.AES.encrypt(JSON.stringify(payload), encryptKey).toString();
    }
    const objValidate = {
      'x-api-action': xApiAction,
      method,
      accessToken,
      'x-api-message': xApiMessage,
    };
    const xAPIValidate = md5(_.values(objValidate).join('') + encryptKey);
    body = {
      'x-api-message': xApiMessage,
    };
    const meAPIHeader = {
      'x-api-client': 'app',
      'x-api-key': xAPIKey,
      'x-api-action': xApiAction,
      'x-api-validate': xAPIValidate,
    };
    if (accessToken !== '') {
      meAPIHeader.Authorization = accessToken;
    }
    return {
      body,
      headers: meAPIHeader,
    };
  },

  ResponseDecrypt(
    xAPIAction,
    method,
    xAPIClient,
    xAPIKey,
    xAPIMessage,
    xAPIValidate,
    accessToken,
    privateKey
  ) {
    let encryptKey;

    try {
      const key = new NodeRSA(privateKey);
      encryptKey = key.decrypt(xAPIKey, 'utf8');
    } catch (error) {
      console.log('error', error);
      return {
        code: -1009,
        data: { message: 'Lỗi giải mã lấy khóa xác thực API không thành công' },
      };
      // throw new Error('Thông tin "x-api-key" không chính xác');
    }

    const objValidate = {
      'x-api-action': xAPIAction,
      method,
      accessToken,
      'x-api-message': xAPIMessage,
    };
    const validate = md5(_.values(objValidate).join('') + encryptKey);

    if (validate !== xAPIValidate) {
      return { code: -1009, data: { message: 'Lỗi xác thực token API' } };
      // throw new Error();
    }
    let result = null;
    try {
      result = JSON.parse(
        CryptoJS.AES.decrypt(xAPIMessage, encryptKey).toString(CryptoJS.enc.Utf8)
      );
    } catch (error) {
      return {
        code: -1009,
        data: { message: 'Dữ liệu API trả về lỗi hoặc không giải mã được' },
      };
      // throw new Error('Thông tin "x-api-message" không chính xác');
    }
    return result;
  },
  ResponseDecryptSubscription(
    xAPIAction,
    method,
    xAPIClient,
    xAPIKey,
    xAPIMessage,
    xAPIValidate,
    accessToken,
    privateKey
  ) {
    let encryptKey;
    try {
      const key = new NodeRSA(privateKey);
      encryptKey = key.decrypt(xAPIKey, 'utf8');
    } catch (error) {
      console.log('error', error);
      return {
        code: -1009,
        data: { message: 'Lỗi giải mã lấy khóa xác thực API không thành công' },
      };
    }
    const objValidate = {
      'x-api-message': xAPIMessage,
    };
    const validate = md5(_.values(objValidate).join('') + encryptKey);
    if (validate !== xAPIValidate) {
      return { code: -1009, data: { message: 'Lỗi xác thực token API' } };
    }
    let result = null;
    try {
      result = JSON.parse(
        CryptoJS.AES.decrypt(xAPIMessage, encryptKey).toString(CryptoJS.enc.Utf8)
      );
    } catch (error) {
      return {
        code: -1009,
        data: { message: 'Dữ liệu API trả về lỗi hoặc không giải mã được' },
      };
      // throw new Error('Thông tin "x-api-message" không chính xác');
    }
    return result;
  },

  callGraphql(
    API_URL,
    query,
    variables = {},
    headers = {},
    isSecurity = false,
    publicKey = null,
    privateKey = null
  ) {
    return this.callAPI(
      'POST',
      API_URL,
      '/graphql',
      { query, variables },
      headers,
      isSecurity,
      publicKey,
      privateKey
    );
  },
};

export default Request;
