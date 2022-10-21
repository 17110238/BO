const config = require(`./config/${process.env.NEXT_PUBLIC_ENV_PAYME}.config.js`);
const withPWA = require('next-pwa');
module.exports = {
  ...config,
  optimizeFonts: false,
  distDir: process?.env?.NODE_ENV || '.next',

  // typescript: {
  //   // Dangerously allow production builds to successfully complete even if
  //   // your project has type errors.
  //   ignoreBuildErrors: true,
  // },

  ...withPWA({
    pwa: {
      dest: "public",
      disable: process.env.NODE_ENV === 'development',
      register: true,
      skipWaiting: true,
    },
  })
  // ...withPWA({
  //   pwa: {
  //     dest: "public",
  //     disable: process.env.NODE_ENV === 'development',
  //     register: true,
  //     skipWaiting: true,
  //   },
  // })
};
