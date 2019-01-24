'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_123';

  // add your config here
  config.middleware = [];

  config.alicloudMns = {
    client: {
      accountId: '',
      accessKeyId: '',
      secretAccessKey: '',
      region: 'cn-hangzhou', // e.g. 'cn-hangzhou',
      secure: true, // use https or http
      internal: false, // use internal endpoint
      vpc: false, // use vpc endpoint
    },
  };

  return config;
};
