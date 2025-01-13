// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const db = require('./db'); // our SQLite database from db.js

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from "public"
app.use(express.static('public'));

// ------------------ API Endpoints ------------------

// GET /api/requests - get all requests
app.get('/api/requests', (req, res) => {
  const query = `SELECT * FROM requests ORDER BY submitted_at DESC`;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching requests:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

// POST /api/requests - create new request
app.post('/api/requests', (req, res) => {
  const { date, start_time, end_time, shift_type, user_name, user_email } = req.body;
  if (!date || !start_time || !end_time || !shift_type || !user_name || !user_email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const query = `
    INSERT INTO requests (date, start_time, end_time, shift_type, user_name, user_email)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [date, start_time, end_time, shift_type, user_name, user_email];
  db.run(query, params, function (err) {
    if (err) {
      console.error('Error inserting request:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    // Query the newly inserted row
    db.get(`SELECT * FROM requests WHERE id = ?`, [this.lastID], (err, row) => {
      if (err) {
        console.error('Error retrieving new request:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.status(201).json(row);
    });
  });
});

// PUT /api/requests/:id - update request status
app.put('/api/requests/:id', (req, res) => {
  const requestId = req.params.id;
  const { status } = req.body;
  if (!status || !['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status must be either "approved" or "rejected"' });
  }
  const query = `UPDATE requests SET status = ? WHERE id = ?`;
  db.run(query, [status, requestId], function (err) {
    if (err) {
      console.error('Error updating request:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    // Return the updated row
    db.get(`SELECT * FROM requests WHERE id = ?`, [requestId], (err, row) => {
      if (err) {
        console.error('Error retrieving updated request:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(row);
    });
  });
});

// DELETE /api/requests/:id - delete a request
app.delete('/api/requests/:id', (req, res) => {
  const requestId = req.params.id;
  const query = `DELETE FROM requests WHERE id = ?`;
  db.run(query, [requestId], function (err) {
    if (err) {
      console.error('Error deleting request:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json({ success: true });
  });
});

// 404 fallback route
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
