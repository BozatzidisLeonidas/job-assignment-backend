import { ParseServer } from 'parse-server';
import { parseServerConfig } from '../config/config.js';

export const setupParseServer = async () => {
  const server = new ParseServer(parseServerConfig); //It initializes a Parse Server using the provided configuration.
  await server.start(); //Start the Server
  return server; //return server so you can access the running instance
};