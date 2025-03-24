export const parseServerConfig  = {
  databaseURI: process.env.DATABASE_URI,
  cloud: function () {
    import('../cloud/main.js');
  },
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY, 
  serverURL: process.env.SERVER_URL,
  liveQuery: {
    classNames: ['Posts', 'Comments'],
  }
};

export const dashboardConfig = {
  apps: [
    {
      appId: process.env.APP_ID,
      masterKey: process.env.MASTER_KEY || '',
      serverURL: process.env.SERVER_URL,
      appName: process.env.APP_NAME || 'InstaShop',
    }
  ],
  users: [
    {
      user: process.env.DASHBOARD_CONFIG_USERNAME, 
      pass: process.env.DASHBOARD_CONFIG_PASSWORD,
    }
  ],
  allowInsecureHTTP: true,
};