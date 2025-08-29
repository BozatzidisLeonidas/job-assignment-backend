export const parseServerConfig  = { //Set Parse server 
  databaseURI: process.env.DATABASE_URI, //Database URL imported from the env
  cloud: function () {
    import('../cloud/main.js'); //imports the main.js where all cloud functions are stored/called
  },
  appId: process.env.APP_ID, //Identifies and secures the Parse app.
  masterKey: process.env.MASTER_KEY, //Identifies and secures the Parse app. 
  serverURL: process.env.SERVER_URL, //The backend URL where the Parse Server is hosted.
  liveQuery: {
    classNames: ['Posts', 'Comments'], //Den xrhsimopoiw, einai enas tropos na yparxei live update an yparxoyn allages sthn vash, se emena, xwris na xreiazetai na xana kanw request sthn vash gia na dw tis allages
  }
};

export const dashboardConfig = { //Configures a dashboard where you can visually manage your Parse database
  apps: [
    {
      appId: process.env.APP_ID,
      masterKey: process.env.MASTER_KEY || '',
      serverURL: process.env.SERVER_URL,
      appName: process.env.APP_NAME || 'InstaShop',
    }// Stores settings for your Parse app.
  ],
  users: [
    {
      user: process.env.DASHBOARD_CONFIG_USERNAME, 
      pass: process.env.DASHBOARD_CONFIG_PASSWORD, //Defines admin users who can access the dashboard 
    }
  ],
  allowInsecureHTTP: true,//Setting allowInsecureHTTP: true in dashboardConfig allows your Parse Dashboard to run without HTTPS—meaning it can be accessed over regular HTTP instead of a secure HTTPS connection.
};