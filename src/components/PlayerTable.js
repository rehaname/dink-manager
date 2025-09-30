import React, { useState } from "react";
import PlayerRow from "./PlayerRow";

export default function PlayerTable({ players, onAddPlayer, onRemovePlayer, onClearAll }) {
  const [newPlayer, setNewPlayer] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPlayer.trim()) return;
    onAddPlayer(newPlayer);
    setNewPlayer("");
  };

  // Sort players: waiting on top, then by matches
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "waiting" ? -1 : 1;
    }
    return a.matches - b.matches;
  });

  return (
    <div className="mt-8 bg-white shadow-lg rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-3">Players</h2>

      {/* Add Player Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          placeholder="Enter player name"
          className="w-1/4 border rounded p-2" 
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ➕ Add Player
        </button>
      </form>

      {/* Clear All Players */}
      <button
        onClick={onClearAll}
        className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600 mb-3"
      >
        🗑️ Clear All Players
      </button>

      {/* Player Table */}
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2">Status</th>
            <th className="p-2">Matches</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player) => (
            <PlayerRow
              key={player.id}
              player={player}
              onRemove={onRemovePlayer}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
