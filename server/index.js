import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { ParseServer } from 'parse-server';
import { initializeParse } from '../config/parseConfig.js';
import { setupParseServer } from './parseServer.js';
import { setupDashboard } from '../dashboard/parseDashboard.js';

const app = express();

app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

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

// Start the HTTP server
const port = process.env.SERVER_PORT;
const httpServer = http.createServer(app);
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Start the LiveQuery server
await ParseServer.createLiveQueryServer(httpServer);


app.get('/getAllLandmarks', async (req, res) => {
  try {
    const landmarks = await Parse.Cloud.run('getAllLandmarks');
    res.status(200).json(landmarks);
  } catch (error) {
    console.error('Error calling getAllLandmarks cloud function:', error);
    res.status(500).json({ error: 'Error fetching landmarks' });
  }
});

app.post('/getLandmarkByOrder', async (req, res) => {
  try {
    const order = req.body.order;

    if (!order) {
      return res.status(400).json({ error: 'Missing order parameter' });
    }

    const landmark = await Parse.Cloud.run('getLandmarkByOrder', { order: Number(order) });

    if (!landmark) {
      return res.status(404).json({ error: `No landmark found with order ${order}` });
    }

    res.status(200).json(landmark);
  } catch (error) {
    console.error('Error calling getLandmarkByOrder cloud function:', error);
    res.status(500).json({ error: 'Error fetching landmark' });
  }
});

app.get('/searchLandmarks', async (req, res) => {
  try {
    const { searchText } = req.query;
    if (!searchText) {
      return res.status(400).json({ error: 'Missing order parameter' });
    }
    const landmarksMatching = await Parse.Cloud.run('searchLandmarks', { searchText: String(searchText) })
    if (!landmarksMatching) {
      return res.status(404).json({ error: `No landmark found that contains ${searchText}`});
    }
    res.status(200).json(landmarksMatching);
  } catch (error) {
    console.error('Error calling searchLandmarks cloud function:', error);
    res.status(500).json({ error: 'Error searching landmarks' });
  }
});