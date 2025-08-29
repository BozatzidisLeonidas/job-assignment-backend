import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { ParseServer } from 'parse-server';
import { initializeParse } from '../config/parseConfig.js';
import { setupParseServer } from './parseServer.js';
import { setupDashboard } from '../dashboard/parseDashboard.js';

const app = express(); //Neo object, initialize and return. Creates an 'app' object with each own methods like app.get() / app.post() etc.

app.use(express.json()); // Use express.json middleware wste na mporei na ginoyn parse ta JSON data apo to req.body. Ara na mporw na diavasw data poy 
//erxontai apo POST, PUT, or PATCH requests apo ton client sto server. 

app.use(cors({
  origin: '*',//Apo poy na dexesai request, edw isws einai lathos giati toy eipa apo pantoy, 'http://localhost:4200' swsto..?
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],//Poia request na dexesai
  allowedHeaders: ['Content-Type', 'Authorization'], // Allows requests that specify the format of the data, Allows requests that include authentication tokens
})); // Middleware (npm install), gia security reasons. Epitrepei thn epikoinwnia meta3y front end kai backend otan einai se diaforetika ports (4200/5000)
//an den to eixa kanei install tha ekana ena request, tha epairna ena response ma o browser tha to blockare gia security reasons

// Initialize Parse
initializeParse();

// Setup Parse Server
const server = await setupParseServer();

// Serve the Parse API on the /parse URL prefix-> NOT USED IN CURRENT SETUP 
const mountPath = process.env.PARSE_MOUNT || '/parse'; // const mountPath = /parse always in this setup
app.use(mountPath, server.app); //

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