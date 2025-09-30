import React from "react";
import Select from "react-select"; 
import { useState } from "react";

export default function CourtCard({ court, players, onAssign, onRemove, onRemoveCourt }) {
  const courtPlayers = players.filter((p) => court.players.includes(p.id));
  const waitingPlayers = players.filter((p) => p.status === "waiting");
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const isFull = courtPlayers.length >= 4;
  const status = isFull ? "In Use" : "Available";

  // 🗣️ Speak out names
  const handleSpeakNames = (customMsg) => {
    let message = "";

    if (customMsg) {
      message = customMsg;
    } else if (courtPlayers.length === 0) {
      message = `Available ${court.name} has no players.`;
    } else {
      const names = courtPlayers.map((p) => p.name).join(", ");
      message = `Game in ${court.name}. Players are: ${names}.`;
    }

    const utterance = new SpeechSynthesisUtterance(message);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="border rounded-xl p-4 shadow-lg bg-white hover:shadow-xl transition">
      {/* Court Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg">{court.name}</h2>
        <span
          className={`text-sm font-medium px-2 py-1 rounded ${
            isFull ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Player List */}
<ul className="mb-3 space-y-2">
  {courtPlayers.map((p) => {
    const levelColors = {
      Newbie: "bg-yellow-200 text-yellow-800",
      Beginner: "bg-green-200 text-green-800",
      Intermediate: "bg-blue-200 text-blue-800",
      Advance: "bg-purple-200 text-purple-800",
    };

    return (
      <li
        key={p.id}
        className="flex justify-between items-center bg-gray-50 px-2 py-1 rounded border"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium">{p.name}</span>
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${levelColors[p.level]}`}
          >
            {p.level}
          </span>
        </div>
        <button
          className="text-red-500 text-sm hover:text-red-700"
          onClick={() => onRemove(court.id, p.id)}
        >
          Remove
        </button>
      </li>
    );
  })}
</ul>
{/* Add Player Dropdown */}
<Select
  className="text-sm"
  isDisabled={court.players.length >= 4}
  placeholder={
    court.players.length >= 4 ? "Court Full (4 players)" : "+ Add Player"
  }
  value={selectedPlayer} // controlled value
  options={[...waitingPlayers] // 🔑 copy array to avoid mutating
    .sort((a, b) => a.matches - b.matches) // 🔑 sort by matches ascending
    .map((p) => ({
      value: p.id,
      label: p.name,
      level: p.level,
    }))}
  onChange={(option) => {
    if (option) {
      onAssign(court.id, option.value);
      setSelectedPlayer(null); // 🔑 reset dropdown
    }
  }}
  isClearable
  getOptionLabel={(option) => (
    <div className="flex items-center gap-2">
      <span>{option.label}</span>
      <span
        className={`px-2 py-1 rounded text-xs font-semibold ${
          {
            Newbie: "bg-yellow-200 text-yellow-800",
            Beginner: "bg-green-200 text-green-800",
            Intermediate: "bg-blue-200 text-blue-800",
            Advance: "bg-purple-200 text-purple-800",
          }[option.level]
        }`}
      >
        {option.level}
      </span>
    </div>
  )}
/>


      {/* Buttons Row */}
      <div className="flex gap-2 mt-3">
        {/* End Game Button */}
        <button
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 text-xs rounded w-full transition"
          onClick={() => {
            // speak before removing
            handleSpeakNames("Game finished on " + court.name);
            court.players.forEach((pId) => {
              onRemove(court.id, pId, true);
            });
          }}
        >
          End Game
        </button>

        {/* 🗣️ Speak Names Button */}
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-xs rounded transition"
          onClick={() => handleSpeakNames()}
        >
          🔊 Speak
        </button>
      </div>

      {/* Remove Court Button (for extra courts only) */}
      {court.id > 3 && (
        <button
          className="mt-2 text-red-500 text-xs hover:text-red-700"
          onClick={() => onRemoveCourt(court.id)}
        >
          Remove Court
        </button>
      )}
    </div>
  );
}
