module.exports = {
  env: {
    //server upload
    NEXT_PUBLIC_API_UPLOAD: 'https://sbx-static.payme.vn',
    NEXT_PUBLIC_API_URL_IDMC: 'http://dev-idmc.payme.net.vn',
    // config gapi
    NEXT_PUBLIC_GAPI_GRAPHQL_URL: 'http://10.8.36.251:6969', //'http://10.8.103.102:3000',
    NEXT_PUBLIC_GAPI_GRAPHQL_URL_PRODUCTION: 'https://dev-gapi.payme.net.vn',
    NEXT_PUBLIC_GAPI_GRAPHQL_URL_WS: 'ws://10.8.36.251:6969',
    NEXT_PUBLIC_GAPI_GRAPHQL_URL_EXPORT: 'ws://10.8.103.102:3000/graphql',
    NEXT_PUBLIC_GAPI_GRAPHQL_URL_EXPORT_LINK: 'http://10.8.103.102:3000',
    NEXT_PUBLIC_GAPI_GRAPHQL_SECURITY: false,
    NEXT_PUBLIC_GAPI_GRAPHQL_PUBLIC_KEY:
      '-----BEGIN PUBLIC KEY-----\n' +
      'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKWcehEELB4GdQ4cTLLQroLqnD3AhdKi\n' +
      'wIhTJpAi1XnbfOSrW/Ebw6h1485GOAvuG/OwB+ScsfPJBoNJeNFU6J0CAwEAAQ==\n' +
      '-----END PUBLIC KEY-----',
    NEXT_PUBLIC_GAPI_GRAPHQL_PRIVATE_KEY:
      '-----BEGIN RSA PRIVATE KEY-----\n' +
      'MIIBPAIBAAJBAKWcehEELB4GdQ4cTLLQroLqnD3AhdKiwIhTJpAi1XnbfOSrW/Eb\n' +
      'w6h1485GOAvuG/OwB+ScsfPJBoNJeNFU6J0CAwEAAQJBAJSfTrSCqAzyAo59Ox+m\n' +
      'Q1ZdsYWBhxc2084DwTHM8QN/TZiyF4fbVYtjvyhG8ydJ37CiG7d9FY1smvNG3iDC\n' +
      'dwECIQDygv2UOuR1ifLTDo4YxOs2cK3+dAUy6s54mSuGwUeo4QIhAK7SiYDyGwGo\n' +
      'CwqjOdgOsQkJTGoUkDs8MST0MtmPAAs9AiEAjLT1/nBhJ9V/X3f9eF+g/bhJK+8T\n' +
      'KSTV4WE1wP0Z3+ECIA9E3DWi77DpWG2JbBfu0I+VfFMXkLFbxH8RxQ8zajGRAiEA\n' +
      '8Ly1xJ7UW3up25h9aa9SILBpGqWtJlNQgfVKBoabzsU=\n' +
      '-----END RSA PRIVATE KEY-----',
    NEXT_PUBLIC_SECRET_KEY: '(*&^$#$#@$@!@#',
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  optimizeFonts: false,
};
