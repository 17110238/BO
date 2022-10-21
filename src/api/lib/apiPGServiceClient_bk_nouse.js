import { setCookie } from 'utils/helpers';
import Request from '../middleware/request';

const apiPGServiceClient = {
  callAPI(method, body, pathUrl, headers = {}) {
    return Request.callAPI(
      method,
      process.env.NEXT_PUBLIC_GAPI_GRAPHQL_URL,
      pathUrl,
      {
        ...body,
        accessToken: localStorage.getItem('accessToken'),
        language: localStorage.getItem('NEXT_LOCALE'),
      },
      headers,
      process.env.NEXT_PUBLIC_GAPI_GRAPHQL_SECURITY,
      process.env.NEXT_PUBLIC_GAPI_GRAPHQL_PUBLIC_KEY,
      process.env.NEXT_PUBLIC_GAPI_GRAPHQL_PRIVATE_KEY
    );
  },

  callAPIUpload(method, body, pathUrl, headers = {}, isSecurity = false) {
    return Request.callAPI(
      method,
      process.env.NEXT_PUBLIC_API_UPLOAD,
      pathUrl,
      { ...body, accessToken: localStorage.getItem('accessToken') },
      headers,
      isSecurity
    );
  },

  callAPIUploadExcel(method, body, pathUrl, headers = {}, isSecurity = false) {
    return Request.callAPIUpload(
      method,
      process.env.NEXT_PUBLIC_GAPI_GRAPHQL_URL,
      pathUrl,
      { body, accessToken: localStorage.getItem('accessToken') },
      headers,
      isSecurity
    );
  },

  async callGAPI(method, body, pathUrl, headers = {}, isAuth = true) {
    const params = { ...body, language: localStorage.getItem('NEXT_LOCALE') };
    if (isAuth) {
      if (body?.accessToken) {
        params.accessToken = body?.accessToken;
      } else {
        const acctk = localStorage.getItem('accessToken');
        if (acctk && typeof acctk !== 'undefined') {
          params.accessToken = acctk;
        }
      }
    }

    const results = await Request.callAPI(
      method,
      process.env.NEXT_PUBLIC_GAPI_GRAPHQL_URL,
      pathUrl,
      params,
      headers,
      process.env.NEXT_PUBLIC_GAPI_GRAPHQL_SECURITY,
      process.env.NEXT_PUBLIC_GAPI_GRAPHQL_PUBLIC_KEY,
      process.env.NEXT_PUBLIC_GAPI_GRAPHQL_PRIVATE_KEY
    );

    if (results.code === 401 && pathUrl !== '/widgets/contract/template') {
      // logoutgout
      localStorage.clear();
      setCookie('accessToken', '', -1);
      window.location.href = '/login';
    }

    return results;
  },

  async callAPIExport(method, body, pathUrl, headers = {}, isAuth = true) {
    const params = { ...body, language: localStorage.getItem('NEXT_LOCALE') };
    if (isAuth) {
      if (body?.accessToken) {
        params.accessToken = body?.accessToken;
      } else {
        const acctk = localStorage.getItem('accessToken');
        if (acctk && typeof acctk !== 'undefined') {
          params.accessToken = acctk;
        }
      }
    }

    const results = await Request.callAPIExport(
      method,
      process.env.NEXT_PUBLIC_GAPI_GRAPHQL_URL,
      pathUrl,
      params,
      headers,
      process.env.NEXT_PUBLIC_GAPI_GRAPHQL_SECURITY,
      process.env.NEXT_PUBLIC_GAPI_GRAPHQL_PUBLIC_KEY,
      process.env.NEXT_PUBLIC_GAPI_GRAPHQL_PRIVATE_KEY
    );
    return results;
  },
};
export default apiPGServiceClient;
