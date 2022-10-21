import { callApiRSA, callApiUpload } from './middleware/requestRSA';
import { getToken } from 'utils/helpers';
import NodeRSA from 'node-rsa';
import shortid from 'shortid';
import _ from 'lodash';

export async function callGraphql(sql, variables, isNoAuthen = false, method = 'POST') {
  // const {
  //   sk: {
  //     env, publicKey, privateKey, xApi
  //   },
  //   ud: { accessToken }
  // } = store.getState()

  // const env = 'production';
  const accessToken = getToken('accessToken');
  // const Authorization = getToken("accessToken")

  const encryptKey = shortid.generate();
  const publicKey = process.env.NEXT_PUBLIC_GAPI_GRAPHQL_PUBLIC_KEY;

  const key = new NodeRSA(publicKey);

  const xApi = key.encrypt(encryptKey, 'base64');

  return callApiRSA({
    env: process.env.NODE_ENV,
    domain: process.env.NEXT_PUBLIC_GAPI_GRAPHQL_URL, //getDomain(env),
    method,
    pathUrl: '/graphql',
    accessToken: accessToken,
    Authorization: accessToken,
    body: {
      query: `${sql}`,
      variables: variables || null,
    },
    isSecurity: process.env.NEXT_PUBLIC_GAPI_GRAPHQL_SECURITY,
    publicKey,
    privateKey: process.env.NEXT_PUBLIC_GAPI_GRAPHQL_PUBLIC_KEY,
    xApi,
    // xApi: env === 'production' ? 'payme' : 'app',
    // isHeaderSecure: env === 'production' ? 1 : ''
  });
}

export async function callGraphqlExport(data, isNoAuthen = false, method = 'POST') {
  // const {
  //   sk: {
  //     env, publicKey, privateKey, xApi
  //   },
  //   ud: { accessToken }
  // } = store.getState()

  // const env = 'production';
  const accessToken = getToken('accessToken');
  // const Authorization = getToken("accessToken")

  const encryptKey = shortid.generate();
  const publicKey = process.env.NEXT_PUBLIC_GAPI_GRAPHQL_URL_EXPORT_LINK;

  const key = new NodeRSA(publicKey);

  const xApi = key.encrypt(encryptKey, 'base64');

  return callApiRSA({
    env: process.env.NODE_ENV,
    domain: process.env.NEXT_PUBLIC_GAPI_GRAPHQL_URL, //getDomain(env),
    method,
    pathUrl: '/sys/export',
    accessToken: accessToken,
    Authorization: accessToken,
    // -----------------------------------------------------------------------------------
    body: {
      data: `${data}`,
    },
    isSecurity: process.env.NEXT_PUBLIC_GAPI_GRAPHQL_SECURITY,
    publicKey,
    privateKey: process.env.NEXT_PUBLIC_GAPI_GRAPHQL_PUBLIC_KEY,
    xApi,
    // xApi: env === 'production' ? 'payme' : 'app',
    // isHeaderSecure: env === 'production' ? 1 : ''
  });
}

export async function callGraphQlFormData(
  sql,
  variables,
  file,
  isNoAuthen = false,
  method = 'POST'
) {
  const env = 'dev';
  const accessToken = getToken('accessToken');
  const encryptKey = shortid.generate();
  const publicKey = process.env.NEXT_PUBLIC_GAPI_GRAPHQL_PUBLIC_KEY;
  const key = new NodeRSA(publicKey);
  const xApi = key.encrypt(encryptKey, 'base64');

  const formData = new FormData();
  const operations = `{"query":${JSON.stringify(sql)},"variables":${JSON.stringify({
    ..._.omit(variables, ['file']),
    file: null,
  })}}`;
  const map = `{"0": ["variables.file"]}`;

  formData.append('operations', operations);
  formData.append('map', map);
  formData.append('0', file);

  return callApiRSA({
    env,
    domain: process.env.NEXT_PUBLIC_GAPI_GRAPHQL_URL, //getDomain(env),
    method,
    pathUrl: '/graphql',
    accessToken: accessToken,
    Authorization: accessToken,
    // -----------------------------------------------------------------------------------
    body: formData,
    isSecurity: process.env.NEXT_PUBLIC_GAPI_GRAPHQL_SECURITY,
    publicKey,
    privateKey: process.env.NEXT_PUBLIC_GAPI_GRAPHQL_PUBLIC_KEY,
    xApi,
    // xApi: env === 'production' ? 'payme' : 'app',
    // isHeaderSecure: env === 'production' ? 1 : ''
  });
}

const getApiUpload = (env) => {
  const pathUrl = '/Upload';
  switch (env) {
    case 'dev':
    case 'sandbox':
      return `${API_UPLOAD_SANBOX}${pathUrl}`;
    case 'staging':
      return `${API_UPLOAD_STAGING}${pathUrl}`;
    case 'production':
      return `${API_UPLOAD}${pathUrl}`;
    default:
      return `${API_UPLOAD}${pathUrl}`;
  }
};

export const callApiUPLOAD = async (data) => {
  const {
    sk: { env, publicKey, privateKey, xApi },
    ud: { accessToken },
  } = store.getState();

  return callApiUpload({
    url: getApiUpload(env),
    accessToken: accessToken ?? '',
    body: data,
  });
};
