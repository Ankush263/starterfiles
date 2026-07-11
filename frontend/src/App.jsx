// ✏️ WRITE YOUR CODE IN THIS FILE.
// The UI (JSX) is already built for you (see components/SessionCard.jsx — don't edit it).
// ⚠️ The app will CRASH on first run — the JSX below uses states and handlers
// that don't exist yet. Your first job is to create them.
//
// Your 4 tasks:
//
//   1. Create the states the JSX needs:
//      - a state for the player name input (the JSX calls it `playerName` / `setPlayerName`)
//      - a state for the sessions list (the JSX calls it `sessions`)
//      Then fetch GET /sessions every 1 second so timers and badges update live.
//      (fetch('/sessions') works directly — no full URL needed.)
//
//   2. Create a function called startSession -> POST /sessions/start with { playerName }.
//      Don't allow an empty name. Clear the input after starting.
//
//   3. Create a function called stopSession(id) -> POST /sessions/:id/stop
//
//   4. Create a function called addTime(id, minutes) -> POST /sessions/:id/add-time with { minutes }
//
// EXAMPLE_SESSIONS below shows how the final UI should look — point `sessions`
// at it first if you want to see the target UI, then delete it and show the
// real sessions (active ones on top, completed ones below).

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
  // TODO 1: create a state for the player name input.
  //         The JSX below expects it to be called `playerName` / `setPlayerName`.

  // TODO 1: create a state for the sessions list (the JSX calls it `sessions`),
  //         then fetch GET /sessions every 1 second to keep it updated.

  // TODO 2: create a function called startSession
  //         -> POST /sessions/start with { playerName }

  // TODO 3: create a function called stopSession(id)
  //         -> POST /sessions/:id/stop

  // TODO 4: create a function called addTime(id, minutes)
  //         -> POST /sessions/:id/add-time with { minutes }

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
