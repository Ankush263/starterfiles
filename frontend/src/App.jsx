// ✏️ WRITE YOUR CODE IN THIS FILE.
// The UI is already built for you (see components/SessionCard.jsx — don't edit it).
// Your job: replace the fake example data with real data from the server.
//
// Your 4 tasks:
//
//   1. Keep the sessions list in state, and fetch GET /sessions every 1 second
//      so timers and badges update live.
//      (fetch('/sessions') works directly — no full URL needed.)
//
//   2. startSession() -> POST /sessions/start with { playerName }.
//      Don't allow an empty name. Clear the input after starting.
//
//   3. stopSession(id) -> POST /sessions/:id/stop
//
//   4. addTime(id, minutes) -> POST /sessions/:id/add-time with { minutes }
//
// When done, delete EXAMPLE_SESSIONS and show the real sessions
// (active ones on top, completed ones below).

import { useState } from 'react';
import SessionCard from './components/SessionCard';

// 🗑️ FAKE DATA — delete this after you fetch real sessions.
// It only exists to show you how the final UI should look:
// one active card, one completed card with Gold, one completed card with no badge.
const EXAMPLE_SESSIONS = [
  {
    id: 'example-1',
    playerName: 'Ravi (example — active)',
    elapsedMinutes: 42,
    status: 'active',
    badges: ['Bronze'],
  },
  {
    id: 'example-2',
    playerName: 'Priya (example — completed)',
    elapsedMinutes: 85,
    status: 'completed',
    badges: ['Bronze', 'Silver', 'Gold'],
  },
  {
    id: 'example-3',
    playerName: 'Arjun (example — no badge)',
    elapsedMinutes: 12,
    status: 'completed',
    badges: [],
  },
];

export default function App() {
  const [playerName, setPlayerName] = useState('');

  // TODO 1: put sessions in state and fetch them every 1 second
  const sessions = EXAMPLE_SESSIONS;

  // TODO 2: start a new session on the server
  const startSession = () => {
    alert('TODO: POST /sessions/start');
  };

  // TODO 3: stop this session on the server
  const stopSession = (id) => {
    alert(`TODO: POST /sessions/${id}/stop`);
  };

  // TODO 4: add minutes to this session on the server
  const addTime = (id, minutes) => {
    alert(`TODO: POST /sessions/${id}/add-time with ${minutes} minutes`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900">
          🎮 Gaming Café Session Tracker
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          1 real second = 1 game minute · Bronze at 30 · Silver at 50 · Gold at 70
        </p>

        <div className="mt-6 flex gap-2">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && startSession()}
            placeholder="Player name"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
          <button
            onClick={startSession}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Start Playing
          </button>
        </div>

        <div className="mt-8 space-y-3">
          {sessions.length === 0 && (
            <p className="text-center text-sm text-gray-400">
              No sessions yet — start one above.
            </p>
          )}
          {/* Shows one card per session. Active sessions should come first. */}
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onStop={stopSession}
              onAddTime={addTime}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
