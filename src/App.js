import React, { useState, useEffect } from "react";
import CourtList from "./components/CourtList";
import PlayerTable from "./components/PlayerTable";
import { saveState, loadState } from "./utils/storage";

export default function App() {
  // Load from storage OR fallback to default
  const [courts, setCourts] = useState(() => {
    const saved = loadState();
    return saved?.courts || [
      { id: 1, name: "Court 1", players: [] },
      { id: 2, name: "Court 2", players: [] },
      { id: 3, name: "Court 3", players: [] },
    ];
  });

  const [players, setPlayers] = useState(() => {
    const saved = loadState();
    return saved?.players || [];
  });

  // 🔄 Save whenever courts or players change
  useEffect(() => {
    saveState({ courts, players });
  }, [courts, players]);

  // -------------------
  // Court Handlers
  // -------------------
  const handleAddCourt = () => {
    const nextNumber = courts.length + 1;
    const newCourt = {
      id: Date.now(),
      name: `Court ${nextNumber}`,
      players: [],
    };
    setCourts([...courts, newCourt]);
  };

  const handleRemoveCourt = (courtId) => {
    setCourts((prevCourts) =>
      prevCourts.filter((court, index) => index < 3 || court.id !== courtId)
    );
  };

  const handleClearExtraCourts = () => {
    setCourts((prevCourts) => prevCourts.slice(0, 3));
  };

  // -------------------
  // Player Handlers
  // -------------------
const handleAddPlayer = (name, level) => {
  const newPlayer = {
    id: Date.now(),
    name,
    level,        // add level here
    status: "waiting",
    matches: 0,
    waitStart: Date.now(), // timestamp when they started waiting
    waitTime: 0  
  };
  setPlayers([...players, newPlayer]);
};

  const handleRemovePlayer = (playerId) => {
    setPlayers((prev) => prev.filter((p) => p.id !== playerId));
    setCourts((prevCourts) =>
      prevCourts.map((court) => ({
        ...court,
        players: court.players.filter((id) => id !== playerId),
      }))
    );
  };

  const handleClearAllPlayers = () => {
    setPlayers([]);
    setCourts((prevCourts) =>
      prevCourts.map((court) => ({ ...court, players: [] }))
    );
  };

  // -------------------
  // Assign/Remove in Court
  // -------------------
  const assignPlayerToCourt = (courtId, playerId) => {
    setCourts((prev) =>
      prev.map((court) =>
        court.id === courtId
          ? { ...court, players: [...court.players, playerId] }
          : court
      )
    );

    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId ? { ...p, status: "playing" } : p
      )
    );
  };

  // REMOVE PLAYERS FROM COURT
const removePlayerFromCourt = (courtId, playerId, isEndGame = false) => {
  setCourts((prevCourts) =>
    prevCourts.map((court) =>
      court.id === courtId
        ? { ...court, players: court.players.filter((id) => id !== playerId) }
        : court
    )
  );

  setPlayers((prevPlayers) =>
    prevPlayers.map((p) =>
      p.id === playerId
        ? {
            ...p,
            status: "waiting",
            matches: isEndGame ? p.matches + 1 : p.matches,
            waitStart: isEndGame ? Date.now() : p.waitStart ?? Date.now(), // ⏱ reset only on End Game
          }
        : p
    )
  );
};


  
  // -------------------
  // Leveling Update
  // -------------------
  const handleUpdateLevel = (playerId, newLevel) => {
  setPlayers((prev) =>
    prev.map((p) =>
      p.id === playerId ? { ...p, level: newLevel } : p
    )
  );
};

  // -------------------
  // Render
  // -------------------
  return (
    <div className="p-4 w-full mx-auto">
      <div className="flex items-center gap-2 mb-4">
  <img
    src={`${process.env.PUBLIC_URL}/logo512.png`}
    alt="Picke & Co Logo"
    className="w-11 h-11 object-contain"
  />
  <h1 className="text-2xl font-bold text-[#1E3A8A]">
    The Pickle & Co 1016
  </h1>
</div>

      {/* Add & Clear Courts */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleAddCourt}
          className="bg-[#1E3A8A] text-white px-4 py-2 rounded hover:bg-[#243c90]"
        >
          ➕ Add Court
        </button>

        <button
          onClick={handleClearExtraCourts}
          className="bg-[#065F46] text-white px-4 py-2 rounded hover:bg-[#0b7a58]"
        >
          🗑️ Clear Extra Courts
        </button>
      </div>

      {/* Court Section */}
      <CourtList
        courts={courts}
        players={players}
        onAssign={assignPlayerToCourt}
        onRemove={removePlayerFromCourt}
        onRemoveCourt={handleRemoveCourt}
      />

      {/* Player Section */}
      <PlayerTable
  players={players}
  onAddPlayer={handleAddPlayer}
  onRemovePlayer={handleRemovePlayer}
  onClearAll={handleClearAllPlayers}
  onUpdateLevel={handleUpdateLevel}
/>
{/* Footer */}
<footer className="text-center text-gray-400 text-xs mt-8">
  Powered by <span className="font-semibold text-gray-500">Dink Manager</span>
</footer>

    </div>
  );
}
