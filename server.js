// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from "public"
app.use(express.static('public'));

// Define the directory and file paths
const dataDir = path.join(__dirname, 'data');
const requestsPath = path.join(dataDir, 'requests.json');

// Helper: Ensure the data folder and files exist with an initial value ([])
// This runs at server start.
function ensureDataFiles() {
  if (!fs.existsSync(dataDir)) {
    console.log(`Data directory not found. Creating ${dataDir}`);
    fs.mkdirSync(dataDir);
  }
  if (!fs.existsSync(requestsPath)) {
    console.log(`File ${requestsPath} not found. Creating and initializing with []`);
    fs.writeFileSync(requestsPath, '[]', 'utf8');
  }
  // If you had other files like timeslots.json, you could ensure them similarly:
  // const timeslotsPath = path.join(dataDir, 'timeslots.json');
  // if (!fs.existsSync(timeslotsPath)) {
  //   console.log(`File ${timeslotsPath} not found. Creating and initializing with []`);
  //   fs.writeFileSync(timeslotsPath, '[]', 'utf8');
  // }
}

// Call this function at server startup
ensureDataFiles();

// Helper: Read JSON from file with graceful error handling
function readJSON(filePath) {
  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error(`Error reading/parsing ${filePath}:`, err);
    return [];
  }
}

// Helper: Write JSON to file
function writeJSON(filePath, data) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData, 'utf8');
  } catch (err) {
    console.error(`Error writing to ${filePath}:`, err);
    throw err;
  }
}

// ----------------- REQUESTS ENDPOINTS -----------------

// GET /api/requests
app.get('/api/requests', (req, res) => {
  const requests = readJSON(requestsPath);
  res.json(requests);
});

// POST /api/requests
// Creates a new shift request with status "pending"
app.post('/api/requests', (req, res) => {
  const { date, startTime, endTime, shiftType, userName, userEmail } = req.body;
  if (!date || !startTime || !endTime || !shiftType || !userName || !userEmail) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    let requests = readJSON(requestsPath);
    const newReq = {
      id: Date.now(),
      date,
      startTime,
      endTime,
      shiftType,
      userName,
      userEmail,
      status: "pending",  // default status
      submittedAt: new Date().toISOString()
    };
    requests.push(newReq);
    writeJSON(requestsPath, requests);
    res.status(201).json(newReq);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/requests/:id
// Update a request's status (approve or reject)
app.put('/api/requests/:id', (req, res) => {
  const reqId = parseInt(req.params.id, 10);
  const { status } = req.body;
  if (!status || !["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: 'Status must be "approved" or "rejected"' });
  }
  try {
    let requests = readJSON(requestsPath);
    let found = false;
    requests = requests.map(r => {
      if (r.id === reqId) {
        r.status = status;
        found = true;
      }
      return r;
    });
    if (!found) return res.status(404).json({ error: 'Request not found' });
    writeJSON(requestsPath, requests);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/requests/:id
// Delete a request by ID
app.delete('/api/requests/:id', (req, res) => {
  const reqId = parseInt(req.params.id, 10);
  try {
    let requests = readJSON(requestsPath);
    const newRequests = requests.filter(r => r.id !== reqId);
    writeJSON(requestsPath, newRequests);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 fallback route
app.use((req, res) => res.status(404).send('Not Found'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Note: On Render, the file system is ephemeral. Consider using a database for persistence in production.");
});
