import Parse from 'parse/node.js';

export const initializeParse = () => {
  Parse.initialize(process.env.APP_ID, '', process.env.MASTER_KEY);
  Parse.serverURL = process.env.SERVER_URL;
};