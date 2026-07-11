import { useState, useEffect } from 'react';
import SessionCard from './components/SessionCard';

export default function App() {
  const [playerName, setPlayerName] = useState('');
  const [sessions, setSessions] = useState([]);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/sessions');
      const data = await res.json();
      // active sessions first, completed below
      setSessions([
        ...data.filter((s) => s.status === 'active'),
        ...data.filter((s) => s.status === 'completed'),
      ]);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    }
  };

  // poll every second so live timers and badges stay updated
  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 1000);
    return () => clearInterval(interval);// if not used it will become zombie timer 
  }, []);

  const startSession = async () => {
    if (!playerName.trim()) return;
    await fetch('/sessions/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName: playerName.trim() }),
    });
    setPlayerName('');
    fetchSessions();
  };


  const stopSession = async (id) => {
    await fetch(`/sessions/${id}/stop`, { method: 'POST' });
    fetchSessions();
  };

  const addTime = async (id, minutes ) => {
    await fetch(`/sessions/${id}/add-time`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ minutes }),
    });

    fetchSessions();
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