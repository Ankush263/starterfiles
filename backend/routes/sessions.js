// ✏️ WRITE YOUR CODE IN THIS FILE.
// Create the 4 routes described below. Right now this file has NO routes —
// the frontend will get 404s until you write them.
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
//   - data.json may be missing or empty. Your read code should not crash on that.const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '..', 'data.json');

// ---------------------------------------------------------------
// SESSION MANAGEMENT — uncomment this code to use it.
// ---------------------------------------------------------------

const activeSessions = new Map(); // id -> session object
const timers = new Map();         // id -> timer (returned by setInterval)

const BADGE_THRESHOLDS = [
  { minutes: 30, badge: 'Bronze' },
  { minutes: 50, badge: 'Silver' },
  { minutes: 70, badge: 'Gold' },
];


// Give every badge whose threshold the session has reached.
// Uses >= so a big Add Time jump unlocks all badges it crossed.
function updateBadges(session) {
  for (const { minutes, badge } of BADGE_THRESHOLDS) {
    if (session.elapsedMinutes >= minutes && !session.badges.includes(badge)) {
      session.badges.push(badge);
    }
  }
}

// data.json may be missing or empty, so fall back to an empty list.
function readCompletedSessions() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return raw.trim() ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
// ---------------------------------------------------------------
// 1. Create a POST route called "start"  (POST /sessions/start)
//    Body: { "playerName": "Ravi" }
//
//    Steps:
//    - If playerName is missing, send back an error (status 400).
//    - Make a new session: elapsedMinutes 0, status "active", badges [].
//    - Start a timer (setInterval, every 1000ms) that:
//        adds 1 to elapsedMinutes, and gives badges when reached.
//    - Send back the new session.
// ---------------------------------------------------------------
// TODO: write the "start" route here
// POST /sessions/start
router.post('/start', (req, res) => {
  const { playerName } = req.body;
  if (!playerName || !playerName.trim()) {
    return res.status(400).json({ error: 'playerName is required' });
  }

  const session = {
    id: crypto.randomUUID(),
    playerName: playerName.trim(),
    elapsedMinutes: 0,
    status: 'active',
    badges: [],
  };
  activeSessions.set(session.id, session);

  // 1 real second = 1 game minute
  const timer = setInterval(() => {
    session.elapsedMinutes += 1;
    updateBadges(session);
  }, 1000);
  timers.set(session.id, timer);

  res.status(201).json(session);
});
// ---------------------------------------------------------------
// 2. Create a POST route called ":id/stop"  (POST /sessions/:id/stop)
//
//    Steps:
//    - Find the active session. If not found, send an error (status 404).
//    - Stop its timer.
//    - Change status to "completed".
//    - Save it into data.json using fs.
//    - Send back the session.
// ---------------------------------------------------------------
// TODO: write the "stop" route here
// POST /sessions/:id/stop
router.post('/:id/stop', (req, res) => {
  const session = activeSessions.get(req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Active session not found' });
  }

  clearInterval(timers.get(session.id));
  timers.delete(session.id);
  activeSessions.delete(session.id);

  session.status = 'completed';

  const completed = readCompletedSessions();
  completed.push(session);
  fs.writeFileSync(DATA_FILE, JSON.stringify(completed, null, 2));

  res.json(session);
});
// ---------------------------------------------------------------
// 3. Create a POST route called ":id/add-time"  (POST /sessions/:id/add-time)
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
// TODO: write the "add-time" route here
// POST /sessions/:id/add-time
router.post('/:id/add-time', (req, res) => {
  const session = activeSessions.get(req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Active session not found' });
  }

  const minutes = Number(req.body.minutes);
  if (!Number.isInteger(minutes) || minutes <= 0) {
    return res.status(400).json({ error: 'minutes must be a positive number' });
  }

  session.elapsedMinutes += minutes;
  updateBadges(session);

  res.json(session);
});
// ---------------------------------------------------------------
// 4. Create a GET route on "/"  (GET /sessions)
//
//    Return one list with:
//    - active sessions (from memory)
//    - completed sessions (from data.json)
// ---------------------------------------------------------------
// TODO: write the "list sessions" route here
// GET /sessions — active (memory) + completed (data.json)
router.get('/', (req, res) => {
  const active = Array.from(activeSessions.values());
  const completed = readCompletedSessions();
  res.json([...active, ...completed]);
});

module.exports = router;