// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from "public"
app.use(express.static('public'));

// Simple admin password. In production, use secure auth (sessions/JWT).
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'secret123';

// Paths to our JSON data files
const timeslotsPath = path.join(__dirname, 'data', 'timeslots.json');
const requestsPath = path.join(__dirname, 'data', 'requests.json');

// Helpers to read/write JSON
function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return [];
  }
}
function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Simple admin auth middleware
function adminAuth(req, res, next) {
  const password = req.query.adminPassword || req.body.adminPassword;
  if (password === ADMIN_PASSWORD) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized. Admin password incorrect.' });
}

// ========== TIME SLOTS ENDPOINTS ========== //

// GET /api/timeslots (anyone can read)
app.get('/api/timeslots', (req, res) => {
  const timeslots = readJSON(timeslotsPath);
  return res.json(timeslots);
});

// POST /api/timeslots (admin only)
app.post('/api/timeslots', adminAuth, (req, res) => {
  const { slotText } = req.body;
  if (!slotText) {
    return res.status(400).json({ error: 'Missing slotText' });
  }
  const timeslots = readJSON(timeslotsPath);
  const newSlot = {
    id: Date.now(),
    text: slotText
  };
  timeslots.push(newSlot);
  writeJSON(timeslotsPath, timeslots);
  return res.json(newSlot);
});

// DELETE /api/timeslots/:id (admin only)
app.delete('/api/timeslots/:id', adminAuth, (req, res) => {
  const slotId = parseInt(req.params.id, 10);
  let timeslots = readJSON(timeslotsPath);
  timeslots = timeslots.filter((slot) => slot.id !== slotId);
  writeJSON(timeslotsPath, timeslots);
  return res.json({ success: true });
});

// ========== REQUESTS ENDPOINTS ========== //

// GET /api/requests (any user can read)
app.get('/api/requests', (req, res) => {
  const requests = readJSON(requestsPath);
  return res.json(requests);
});

// POST /api/requests (public - user form)
app.post('/api/requests', (req, res) => {
  const { shiftDate, timeSlot, shiftType, userName, userEmail } = req.body;
  if (!shiftDate || !timeSlot || !shiftType || !userName || !userEmail) {
    return res.status(400).json({ error: 'Missing fields in request.' });
  }
  const requests = readJSON(requestsPath);
  const newRequest = {
    id: Date.now(),
    shiftDate,
    timeSlot,
    shiftType,
    userName,
    userEmail,
    submittedAt: new Date().toISOString()
  };
  requests.push(newRequest);
  writeJSON(requestsPath, requests);
  return res.json(newRequest);
});

// DELETE /api/requests/:id (admin only)
app.delete('/api/requests/:id', adminAuth, (req, res) => {
  const reqId = parseInt(req.params.id, 10);
  let requests = readJSON(requestsPath);
  requests = requests.filter((r) => r.id !== reqId);
  writeJSON(requestsPath, requests);
  return res.json({ success: true });
});

// 404 fallback (optional)
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
