export const parseServerConfig  = {
  databaseURI: process.env.DATABASE_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/dev',
  cloud: function () {
    import('../cloud/main.js');
  },
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY, 
  serverURL: process.env.SERVER_URL,
  liveQuery: {
    classNames: ['Posts', 'Comments'],
  }
};

export const dashboardConfig = {
  apps: [
    {
      appId: process.env.APP_ID || 'myAppId',
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
  allowInsecureHTTP: true, // Allow insecure HTTP for local development
};