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

// Paths to JSON data files (ensure these are in a folder named "data" in your project root)
const timeslotsPath = path.join(__dirname, 'data', 'timeslots.json');
const requestsPath = path.join(__dirname, 'data', 'requests.json');

// Helper: Read JSON from file, with debug logs
function readJSON(filePath) {
  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    console.log(`\n[DEBUG] Raw data read from ${filePath}:\n`, rawData);
    const parsed = JSON.parse(rawData);
    console.log(`[DEBUG] Parsed data:`, parsed);
    return parsed;
  } catch (err) {
    console.error(`Error reading/parsing ${filePath}:`, err);
    return [];
  }
}

// Helper: Write JSON to file, with debug logs
function writeJSON(filePath, data) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    console.log(`\n[DEBUG] Attempting to write to ${filePath} with data:`);
    console.log(jsonData);
    fs.writeFileSync(filePath, jsonData, 'utf8');
    console.log(`[DEBUG] Successfully wrote data to ${filePath}\n`);
  } catch (err) {
    console.error(`Error writing to ${filePath}:`, err);
    throw err;
  }
}

// ----------------- TIME SLOTS ENDPOINTS -----------------

// GET /api/timeslots?date=YYYY-MM-DD
app.get('/api/timeslots', (req, res) => {
  const dateParam = req.query.date;
  const allSlots = readJSON(timeslotsPath);
  if (dateParam) {
    const filtered = allSlots.filter(s => s.date === dateParam);
    return res.json(filtered);
  }
  return res.json(allSlots);
});

// POST /api/timeslots => Add a new time slot
app.post('/api/timeslots', (req, res) => {
  const { date, startTime, endTime } = req.body;
  if (!date || !startTime || !endTime) {
    console.error("Missing fields in time slot request:", req.body);
    return res.status(400).json({ error: 'Missing date, startTime, or endTime' });
  }
  try {
    let slots = readJSON(timeslotsPath);
    const newSlot = {
      id: Date.now(),
      date,
      startTime,
      endTime
    };
    slots.push(newSlot);
    writeJSON(timeslotsPath, slots);
    console.log("New time slot added:", newSlot);
    return res.status(201).json(newSlot);
  } catch (err) {
    console.error("Error adding time slot:", err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/timeslots/:id => Remove a time slot by ID
app.delete('/api/timeslots/:id', (req, res) => {
  const slotId = parseInt(req.params.id, 10);
  try {
    let slots = readJSON(timeslotsPath);
    const updatedSlots = slots.filter(s => s.id !== slotId);
    writeJSON(timeslotsPath, updatedSlots);
    console.log(`Deleted time slot with ID ${slotId}. Remaining slots:`, updatedSlots);
    return res.json({ success: true });
  } catch (err) {
    console.error("Error deleting time slot:", err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ----------------- REQUESTS ENDPOINTS -----------------

// GET /api/requests => Return all requests
app.get('/api/requests', (req, res) => {
  const requests = readJSON(requestsPath);
  return res.json(requests);
});

// POST /api/requests => Create a new shift request
app.post('/api/requests', (req, res) => {
  const { date, startTime, endTime, shiftType, userName, userEmail } = req.body;
  if (!date || !startTime || !endTime || !shiftType || !userName || !userEmail) {
    console.error("Missing fields in request submission:", req.body);
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
      submittedAt: new Date().toISOString()
    };
    requests.push(newReq);
    writeJSON(requestsPath, requests);
    console.log("New request submitted:", newReq);
    return res.status(201).json(newReq);
  } catch (err) {
    console.error("Error submitting request:", err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/requests/:id => Remove a request by ID
app.delete('/api/requests/:id', (req, res) => {
  const reqId = parseInt(req.params.id, 10);
  try {
    let requests = readJSON(requestsPath);
    const updatedRequests = requests.filter(r => r.id !== reqId);
    writeJSON(requestsPath, updatedRequests);
    console.log(`Deleted request with ID ${reqId}. Remaining requests:`, updatedRequests);
    return res.json({ success: true });
  } catch (err) {
    console.error("Error deleting request:", err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 Fallback
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
