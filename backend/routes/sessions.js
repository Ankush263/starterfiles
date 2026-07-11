const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '..', 'data.json');

const activeSessions = new Map();
const timers = new Map();

function getBadges(minutes) {
  const badges = [];
  if (minutes >= 30) badges.push('Bronze');
  if (minutes >= 50) badges.push('Silver');
  if (minutes >= 70) badges.push('Gold');
  return badges;
}

router.post('/start', (req, res) => {
  const { playerName } = req.body;
  if (!playerName || !playerName.trim()) {
    return res.status(400).json({ error: 'Player name is required' });
  }
  const id = crypto.randomUUID();
  const session = {
    id,
    playerName,
    elapsedMinutes: 0,
    status: 'active',
    badges: []
  };
  activeSessions.set(id, session);
  const timer = setInterval(() => {
    session.elapsedMinutes += 1;
    session.badges = getBadges(session.elapsedMinutes);
  }, 1000);
  timers.set(id, timer);
  res.status(201).json(session);
});

router.post('/:id/stop', (req, res) => {
  const { id } = req.params;
  const session = activeSessions.get(id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  const timer = timers.get(id);
  if (timer) {
    clearInterval(timer);
    timers.delete(id);
  }
  session.status = 'completed';
  activeSessions.delete(id);

  let completedSessions = [];
  if (fs.existsSync(DATA_FILE)) {
    try {
      const fileData = fs.readFileSync(DATA_FILE, 'utf8');
      if (fileData.trim()) {
        completedSessions = JSON.parse(fileData);
      }
    } catch (e) {
      completedSessions = [];
    }
  }
  completedSessions.push(session);
  fs.writeFileSync(DATA_FILE, JSON.stringify(completedSessions, null, 2));
  res.json(session);
});

router.post('/:id/add-time', (req, res) => {
  const { id } = req.params;
  const { minutes } = req.body;
  const session = activeSessions.get(id);
  if (!session) {
    return res.status(404).json({ error: 'Active session not found' });
  }
  const mins = parseInt(minutes, 10);
  if (isNaN(mins) || mins <= 0) {
    return res.status(400).json({ error: 'Invalid minutes' });
  }
  session.elapsedMinutes += mins;
  session.badges = getBadges(session.elapsedMinutes);
  res.json(session);
});

router.get('/', (req, res) => {
  let completedSessions = [];
  if (fs.existsSync(DATA_FILE)) {
    try {
      const fileData = fs.readFileSync(DATA_FILE, 'utf8');
      if (fileData.trim()) {
        completedSessions = JSON.parse(fileData);
      }
    } catch (e) {
      completedSessions = [];
    }
  }
  const activeList = Array.from(activeSessions.values());
  res.json([...activeList, ...completedSessions]);
});

module.exports = router;
