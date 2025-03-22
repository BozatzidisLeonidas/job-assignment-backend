import 'dotenv/config';
import express from 'express';
import http from 'http';
import { ParseServer } from 'parse-server';
import { initializeParse } from '../config/parseConfig.js';
import { setupParseServer } from './parseServer.js';
import { setupDashboard } from '../dashboard/parseDashboard.js';

const app = express();

// Initialize Parse
initializeParse();

// Setup Parse Server
const server = await setupParseServer();

// Serve the Parse API on the /parse URL prefix
const mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, server.app);

// Setup Parse Dashboard
const dashboard = setupDashboard();
app.use('/dashboard', dashboard);

// Endpoint for testing the 'hello' cloud function
app.get('/hello', async (req, res) => {
  try {
    const result = await Parse.Cloud.run('hello');
    console.log(result); // Logs 'Hi'
    res.status(200).send(result);
  } catch (error) {
    console.error('Error calling cloud function:', error);
    res.status(500).send('Error calling cloud function');
  }
});

// Start the HTTP server
const port = process.env.SERVER_PORT || 5000;
const httpServer = http.createServer(app);
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Start the LiveQuery server
await ParseServer.createLiveQueryServer(httpServer);

// Additional route for testing
app.get('/a', (req, res) => {
  res.status(200).send("abcd");
});
