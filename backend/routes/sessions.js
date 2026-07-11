// ✏️ WRITE YOUR CODE IN THIS FILE.
// Fill in the 4 endpoints below. Right now they all return "Not implemented".
//
// A session looks like this:
//   { id, playerName, elapsedMinutes, status: "active" | "completed", badges: [] }
//
// Badge rules (the SERVER gives badges automatically as time passes):
//   30 game minutes  -> "Bronze"
//   50 game minutes  -> "Silver"
//   70 game minutes  -> "Gold" (last one, nothing after this)
//
// Remember: 1 real second = 1 game minute.
//
// Tips:
//   - Active sessions stay in memory. Only completed sessions are saved to data.json.
//   - Keep each session's timer in a Map (id -> timer), so you can stop it later.
//   - Use >= for badge checks, not ===. If you use ===, badges will be skipped
//     when Add Time jumps over a number (example: 25 -> 75).
//   - data.json may be missing or empty. Your read code should not crash on that.

const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto'); // crypto.randomUUID() gives you a unique id

const router = express.Router();
const DATA_FILE = path.join(__dirname, '..', 'data.json');

// TODO: create your in-memory storage here
// TODO: Uncomment the below code.
// const activeSessions = new Map(); // id -> session
// const timers = new Map();         // id -> timer (from setInterval)

// ---------------------------------------------------------------
// 1. POST /sessions/start
//    Body: { "playerName": "Ravi" }
//
//    Steps:
//    - If playerName is missing, send back an error (status 400).
//    - Make a new session: elapsedMinutes 0, status "active", badges [].
//    - Start a timer (setInterval, every 1000ms) that:
//        adds 1 to elapsedMinutes, and gives badges when reached.
//    - Send back the new session.
// ---------------------------------------------------------------
router.post('/start', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

// ---------------------------------------------------------------
// 2. POST /sessions/:id/stop
//
//    Steps:
//    - Find the active session. If not found, send an error (status 404).
//    - Stop its timer.
//    - Change status to "completed".
//    - Save it into data.json using fs.
//    - Send back the session.
// ---------------------------------------------------------------
router.post('/:id/stop', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

// ---------------------------------------------------------------
// 3. POST /sessions/:id/add-time
//    Body: { "minutes": 30 }
//
//    Steps:
//    - Works only on ACTIVE sessions. If the session is completed,
//      send back an error.
//    - Add the minutes to elapsedMinutes in one jump.
//    - Give ALL badges that were passed by the jump.
//      Example: 25 -> 75 gives Bronze, Silver AND Gold together.
//    - Send back the updated session.
// ---------------------------------------------------------------
router.post('/:id/add-time', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

// ---------------------------------------------------------------
// 4. GET /sessions
//
//    Return one list with:
//    - active sessions (from memory)
//    - completed sessions (from data.json)
// ---------------------------------------------------------------
router.get('/', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

module.exports = router;
