import React, { useState } from "react";
import Select from "react-select";
import PlayersModal from "./PlayersModal";

export default function CourtCard({
  court,
  players,
  onAssign,
  onRemove,
  onRemoveCourt,
  readOnly = false, // 👈 NEW: read-only mode (used by /display)
}) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [openPlayersModal, setOpenPlayersModal] = useState(false);

  const courtPlayers = players.filter((p) => court.players.includes(p.id));
  const waitingPlayers = players.filter((p) => p.status === "waiting");

  const isFull = courtPlayers.length >= 4;
  const status = isFull ? "In Use" : "Available";

  // 🗣️ Speak out names (used by card + modal)
  const handleSpeakNames = (customMsg) => {
    let message = "";
    if (customMsg) {
      message = customMsg;
    } else if (courtPlayers.length === 0) {
      message = `${court.name} has no players.`;
    } else {
      const names = courtPlayers.map((p) => p.name).join(", ");
      message = `${court.name}. Players are: ${names}.`;
    }
    const u = new SpeechSynthesisUtterance(message);
    speechSynthesis.speak(u);
  };

  return (
    <div className="border rounded-xl p-4 shadow-lg bg-white hover:shadow-xl transition">
      {/* Court Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg text-[#1E3A8A]">{court.name}</h2>
        <span
          className={`text-sm font-medium px-2 py-1 rounded ${
            isFull ? "bg-red-100 text-red-700" : "bg-green-100 text-[#065F46]"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Player List */}
      <ul className="mb-3 space-y-2">
        {courtPlayers.map((p) => {
          const levelDot = {
            Newbie: "🟡",
            Beginner: "🟢",
            Intermediate: "🔵",
            Advance: "🟣",
          };
          return (
            <li
              key={p.id}
              className="flex justify-between items-center bg-gray-50 px-2 py-1 rounded border"
            >
              <div className="flex items-center gap-2">
                <span className="text-base leading-none">
                  {levelDot[p.level] || "🔵"}
                </span>
                <span className="font-medium">{p.name}</span>
                <span className="text-xs text-gray-500">({p.matches})</span>
              </div>

              {/* Hide per-player Remove in read-only mode */}
              {!readOnly && (
                <button
                  className="text-red-500 text-sm hover:text-red-700"
                  onClick={() => onRemove(court.id, p.id)}
                >
                  Remove
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {/* Searchable Add Player (hidden on /display) */}
      {!readOnly && (
        <Select
          className="text-sm"
          isDisabled={isFull}
          placeholder={isFull ? "Court Full (4 players)" : "+ Add Player"}
          value={selectedPlayer}
          options={[...waitingPlayers]
            .sort((a, b) => a.matches - b.matches) // least matches first
            .map((p) => ({ value: p.id, label: p.name, level: p.level }))}
          onChange={(option) => {
            if (option) {
              onAssign(court.id, option.value);
              setSelectedPlayer(null); // reset after assign
            }
          }}
          isClearable
          getOptionLabel={(option) => (
            <div className="flex items-center gap-2">
              <span>{option.label}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
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
      )}

      {/* End Game (hidden on /display) + Expand (always visible) */}
      <div className="flex gap-2 mt-3">
        {!readOnly && (
          <button
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 text-xs rounded w-full transition"
            onClick={() => {
              handleSpeakNames("Game finished on " + court.name);
              court.players.forEach((pId) => {
                onRemove(court.id, pId, true);
              });
            }}
          >
            End Game
          </button>
        )}

        {/* 📣 Expand — visible always */}
      <button
        className="bg-[#1E3A8A] hover:bg-[#243c90] text-white px-3 py-1 text-xs rounded transition"
        onClick={() => {
          setOpenPlayersModal(true);
         if ("BroadcastChannel" in window) {
           const bc = new BroadcastChannel("dink_manager");
           bc.postMessage({ type: "OPEN_MODAL", courtId: court.id });
           bc.close();
        }
        }}
      >
        📣 Expand
      </button>
      </div>

      {/* Remove Court Button (for extra courts only; hidden on /display) */}
      {!readOnly && court.id > 3 && (
        <button
          className="mt-2 text-red-500 text-xs hover:text-red-700"
          onClick={() => onRemoveCourt(court.id)}
        >
          Remove Court
        </button>
      )}

      {/* Players Modal (always available) */}
      <PlayersModal
        open={openPlayersModal}
        courtName={court.name}
        players={courtPlayers}
        onClose={() => {
          setOpenPlayersModal(false);
        if ("BroadcastChannel" in window) {
          const bc = new BroadcastChannel("dink_manager");
          bc.postMessage({ type: "CLOSE_MODAL", courtId: court.id });
          bc.close();
        }
        }}
        onSpeak={() => handleSpeakNames()}
      />
    </div>
  );
}
