import Axios from 'axios';
import CryptoJS from 'crypto-js';
import ShortId from 'shortid';
import forge from 'node-forge';
import dayjs from 'dayjs';

import isNull from 'lodash/isNull';
import values from 'lodash/values';
import merge from 'lodash/merge';
import size from 'lodash/size';

// import { FULLP2, FULLE2 } from 'configs/responseCode.config'

import { postNativeInfo } from 'components/common/PostEventNative';
// import { messageInfo } from 'components/common/log/Message'
// import { addLog } from 'components/common/log/ShowLog'
import { randomString } from 'utils/helpers/nwubswqe';
import { getCookie, setCookie } from 'utils/helpers';

forge.options.usePureJavaScript = true;

const _ = {
  isNull,
  values,
  merge,
  size,
};
class MeAPI {
  constructor(
    config = {
      url: '',
      publicKey: '',
      privateKey: '',
      isSecurity: false,
      'x-api-client': '',
    }
  ) {
    this.config = config;
  }

  ResponseDecrypt(xAPIAction, method, xAPIClient, xAPIKey, xAPIMessage, xAPIValidate, accessToken) {
    let encryptKey;
    try {
      // const key = new NodeRSA(this.config.privateKey);
      // encryptKey = key.decrypt(xAPIKey, 'utf8');

      const key = forge.pki.privateKeyFromPem(this.config.privateKey);
      const { util } = forge;

      const encrypted = util.decode64(xAPIKey);

      encryptKey = key.decrypt(encrypted, 'RSA-OAEP');
      // const encrypted = util.decode64(encrypt)
      // const decrypt = privKey.decrypt(encrypted, 'RSA-OAEP')
    } catch (error) {
      throw new Error('Thông tin "x-api-key" không chính xác');
    }
    const objValidate = {
      'x-api-action': xAPIAction,
      method,
      accessToken,
      'x-api-message': xAPIMessage,
    };

    const md = forge.md.md5.create();
    md.update(_.values(objValidate).join('') + encryptKey);
    const validate = md.digest().toHex();

    if (validate !== xAPIValidate) {
      throw new Error('Thông tin "x-api-validate" không chính xác');
    }
    let result = null;
    try {
      result = JSON.parse(
        CryptoJS.AES.decrypt(xAPIMessage, encryptKey).toString(CryptoJS.enc.Utf8)
      );
      if (typeof result === 'string') result = JSON.parse(result);
    } catch (error) {
      throw new Error('Thông tin "x-api-message" không chính xác');
    }
    return result;
  }

  RequestEncrypt(url, method, payload, accessToken) {
    const encryptKey = ShortId.generate();
    const key = forge.pki.publicKeyFromPem(this.config.publicKey);
    const { util } = forge;
    const encrypt = key.encrypt(encryptKey, 'RSA-OAEP');
    const xAPIKey = util.encode64(encrypt);
    let body = '';

    const xApiAction = CryptoJS.AES.encrypt(url, encryptKey).toString();
    let xApiMessage = '';
    if (payload) {
      xApiMessage = CryptoJS.AES.encrypt(JSON.stringify(payload), encryptKey).toString();
    }
    const objValidate = {
      xApiAction,
      method,
      accessToken,
      'x-api-message': xApiMessage,
    };
    const md = forge.md.md5.create();
    md.update(_.values(objValidate).join('') + encryptKey);
    const xAPIValidate = md.digest().toHex();
    body = {
      'x-api-message': xApiMessage,
    };

    const meAPIHeader = {
      'x-api-client': this.config['x-api-client'],
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
  }

  async Post(pathUrl, payload, accessToken = '', headers = {}) {
    try {
      if (_.isNull(accessToken)) accessToken = '';
      let meAPIHeader = {};
      if (accessToken !== '') {
        meAPIHeader.Authorization = accessToken;
      }
      let body = payload;
      let url = this.config.url + pathUrl;

      if (this.config.isSecurity === true) {
        url = this.config.url + pathUrl;
        const encrypt = this.RequestEncrypt(pathUrl, 'POST', payload, accessToken);
        meAPIHeader = encrypt.headers;
        body = encrypt.body;
      }

      // addLog.next({
      //   type: 'LOG-HEADER', message: JSON.stringify(_.merge(meAPIHeader, headers))
      // })

      const response = await Axios.post(url, body, {
        headers: _.merge(meAPIHeader, headers),
        timeout: 3 * 60 * 1000,
      });
      if (response.status === 200) {
        if (this.config.isSecurity === true) {
          try {
            const responseHeaders = response.headers;
            const data = this.ResponseDecrypt(
              responseHeaders['x-api-action'],
              'POST',
              responseHeaders['x-api-client'],
              responseHeaders['x-api-key'],
              response.data['x-api-message'],
              responseHeaders['x-api-validate'],
              accessToken
            );
            return {
              code: 1,
              data: data || {},
              original: response.data,
            };
          } catch (error) {
            return {
              code: -3,
              data: { message: error.message },
              original: response.data,
            };
          }
        } else {
          return {
            code: 1,
            data: response.data || {},
          };
        }
      } else {
        return {
          code: response.status,
          data: response.data || {},
        };
      }
    } catch (error) {
      return {
        code: -2,
        data: {
          errors: [{ message: error.message }],
        },
      };
    }
  }

  static async PostUpload(url, accessToken = '', body = {}) {
    const result = {
      code: -2,
      data: {},
      original: null,
    };
    try {
      const response = await Axios.post(url, body, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: accessToken,
        },
        timeout: 30000,
      });

      if (response.code !== 200) {
        result.code = -response.code;
        result.data = {};
        result.original = response.data;
      }
      const { data } = response;
      return {
        code: 1,
        data,
        original: response.data,
      };
    } catch (error) {
      return {
        code: -2,
        data: {
          message: error.message,
        },
        original: error,
      };
    }
  }
}

export const callApiRSA = async ({
  env,
  domain,
  method,
  pathUrl,
  accessToken,
  body,
  isSecurity,
  xApi,
  publicKey,
  privateKey,
}) => {
  // addLog.next({
  //   type: 'PAYLOAD-PAYMESDK', time: dayjs().format('HH:mm:ss'), method, api: domain + pathUrl, payload: body
  // })

  const meAPI = new MeAPI({
    url: domain,
    publicKey,
    privateKey,
    isSecurity,
    'x-api-client': xApi,
  });

  const headers = {
    security: 'sandbox',
    'x-request-id': `${dayjs().unix()}-${randomString(32)}`,
  };
  // if (isHeaderSecure !== '') {
  //   headers = {
  //     ...headers,
  //     security: isHeaderSecure
  //   }
  //   // headers.security = isHeaderSecure
  // }

  let response;
  if (method.toUpperCase() === 'POST') {
    response = await meAPI.Post(pathUrl, body, accessToken || '', headers);
  }

  if (env !== 'production') {
    console.log(
      '[REQUEST-PAYMESDK]',
      dayjs().format('HH:mm:ss'),
      method.toUpperCase(),
      domain + pathUrl,
      body,
      response
    );
  }
  // addLog.next({
  //   type: 'REQUEST-PAYMESDK', time: dayjs().format('HH:mm:ss'), method, api: domain + pathUrl, payload: body, data: response
  // })

  return handleGraphQLResponse(response);
};

export const callApiUpload = async ({ url, accessToken, body }) => {
  const response = await MeAPI.PostUpload(url, accessToken, body);
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    console.log('[REQUEST-UPLOAD-PAYMESDK]', url, body, response);
  }
  return handleResponse(response);
};

function handleGraphQLResponse(response) {
  // const networkError = useSelector((state) => state.sk.networkError)
  if (response?.code === -3) {
    // Không decrypt được data từ SERVER
    // messageInfo.next({ message: 'Có lỗi từ máy chủ hệ thống. Mã lỗi: SDK-C0001', isVisible: true })
  } else if (response?.code === 400) {
    // Error khi thông số truyền lên ko chính xác
    // messageInfo.next({ message: 'Có lỗi từ máy chủ hệ thống. Mã lỗi: SDK-C0002', isVisible: true })
  } else if (response?.code === -2) {
    // Error chưa tới SERVER
    /* -- */
    const { errors } = response.data;
    if (errors && _.size(errors) > 0) {
      const error = errors[0];
      if (error.message === 'Network Error') {
        // messageInfo.next({ message: 'Kết nối mạng bị sự cố, vui lòng kiểm tra và thử lại. Xin cảm ơn !', isVisible: true })
      } else if (
        error.message === 'timeout of 30000ms exceeded' ||
        error.message === 'timeout of 60000ms exceeded'
      ) {
        // messageInfo.next({ message: 'Kết nối đến máy chủ quá lâu, vui lòng kiểm tra lại đường truyền và thử lại. Xin cảm ơn !', isVisible: true })
      } else {
        // messageInfo.next({ message: error.message ?? 'Có lỗi từ hệ thống. Mã lỗi: SDK-C0003', isVisible: true })
      }
    }
    /* -- */
  } else if (response?.code === 1) {
    const { errors } = response.data;
    if (errors && _.size(errors) > 0) {
      const error = errors[0];
      if (error.extensions?.code === 401) {
        // messageInfo.next({ message: error.message ?? 'Thông tin xác thực không hợp lệ', isVisible: true })
        postNativeInfo.next({
          type: 'error',
          code: 401,
          message: error.message ?? 'Thông tin xác thực không hợp lệ',
        });
      } else if (error.extensions?.code === 400) {
        // messageInfo.next({ message: 'Có lỗi từ máy chủ hệ thống. Mã lỗi: SDK-C0002', isVisible: true })
      } else {
        // messageInfo.next({ message: error.message ?? 'Có lỗi từ máy chủ hệ thống. Mã lỗi: SDK-C0004', isVisible: true })
      }
    }
  }

  return response;
}
function handleResponse(response) {
  if (response.code === 1) {
    if (!isNaN(parseInt(response.data))) {
      return {
        code: parseInt(response.data),
        data: {
          message: `Không thể kết nối đến server (Mã lỗi : ${response.data} )`,
        },
      };
    }
    // if (response.data && response.data.code === 401) {
    //   appStore.navigationStack = appStore.navigationStackConstant.AUTH
    //   userStore.logout()
    //   messageInfo.next({ message: response?.data?.message ?? 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.Xin cảm ơn' })
    // }
    if (response.data?.code === 400) {
      return {
        code: response.data.code,
        data: {
          ...response.data.data,
          message: 'Tham số không hợp lệ',
        },
      };
    }
    return {
      code: response.data.code,
      data: response.data.data,
    };
  }
  if (response.code === -2) {
    if (response.data.message === 'Network Error') {
      return {
        code: -1,
        data: {
          message: 'Kết nối mạng bị sự cố, vui lòng kiểm tra và thử lại. Xin cảm ơn !',
        },
      };
    }
    if (
      response.data.message === 'timeout of 30000ms exceeded' ||
      response.data.message === 'timeout of 60000ms exceeded'
    ) {
      return {
        code: -3,
        data: {
          message: 'Kết nối đến máy chủ quá lâu, vui lòng kiểm tra và thử lại. Xin cảm ơn !',
        },
      };
    }
    if (response?.original?.response?.status) {
      return {
        code: response.code,
        data: {
          message: `Không thể kết nối đến server (Mã lỗi : ${response.original.response.status} )`,
        },
      };
    }
  }
  return response;
}
