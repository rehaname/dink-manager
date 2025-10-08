import React, { useState } from "react";
import PlayerRow from "./PlayerRow";

export default function PlayerTable({ players, onAddPlayer, onRemovePlayer, onClearAll, onUpdateLevel }) {
  const [newPlayer, setNewPlayer] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPlayer.trim()) return;

    // Check duplicate name
    if (players.some((p) => p.name.toLowerCase() === newPlayer.trim().toLowerCase())) {
      setError("⚠️ Player already exists");
      return;
    }

    // New players always default to Intermediate
    onAddPlayer(newPlayer, "Intermediate");
    setNewPlayer("");
    setError("");
  };

  return (
    <div className="mt-8 bg-white shadow-lg rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-3">Players</h2>

      {/* Add Player Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4 items-start">
        <div className="flex flex-col w-1/3">
          <input
            type="text"
            value={newPlayer}
            onChange={(e) => setNewPlayer(e.target.value)}
            placeholder="Enter player name"
            className={`border rounded p-2 ${error ? "border-red-500" : ""}`}
          />
          {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
        </div>

        <button
          type="submit"
          className="bg-[#1E3A8A] text-white px-3 py-2 rounded hover:bg-[#243c90] w-1/6 text-sm"
        >
          ➕ Add
        </button>
      </form>

      {/* Clear All Players */}
      <button
        onClick={onClearAll}
        className="bg-[#065F46] text-white px-3 py-1 text-sm rounded hover:bg-[#0b7a58] mb-3"
      >
        🗑️ Clear All Players
      </button>

      {/* Player Table */}
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2">Level</th>
            <th className="p-2">Status</th>
            <th className="p-2">Wait Time</th>
            <th className="p-2">Matches</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {[...players]
  .sort((a, b) => {
    // 1. Waiting players first
    if (a.status === "waiting" && b.status !== "waiting") return -1;
    if (b.status === "waiting" && a.status !== "waiting") return 1;

    // 2. Then sort by matches (least to most)
    return a.matches - b.matches;
  })
  .map((player) => (
    <PlayerRow
      key={player.id}
      player={player}
      onRemove={onRemovePlayer}
      onUpdateLevel={onUpdateLevel}
    />
  ))}

        </tbody>
      </table>
    </div>
  );
}
