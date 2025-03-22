import { ParseServer } from 'parse-server';
import { parseServerConfig } from '../config/config.js';

export const setupParseServer = async () => {
  const server = new ParseServer(parseServerConfig);
  await server.start();
  return server;
};