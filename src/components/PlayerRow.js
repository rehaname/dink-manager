import React, { useEffect, useState } from "react";

export default function PlayerRow({ player, onRemovePlayer, onUpdateLevel }) {
  const [minutes, setMinutes] = useState(0);

  // ⏱ update wait time every 30s
  useEffect(() => {
    if (player.status !== "waiting") {
      setMinutes(0);
      return;
    }

    const update = () => {
      if (player.waitStart) {
        const elapsed = Math.floor((Date.now() - player.waitStart) / 60000);
        setMinutes(elapsed);
      }
    };

    update(); // run once immediately
    const interval = setInterval(update, 30000);

    return () => clearInterval(interval);
  }, [player.status, player.waitStart]);

  return (
    <tr className="hover:bg-gray-50">
      <td className="border p-2">{player.name}</td>

      {/* Editable Level Dropdown */}
      <td className="border p-2 text-center">
        <select
          value={player.level || "Intermediate"}
          onChange={(e) => onUpdateLevel(player.id, e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="Intermediate">🔵 Intermediate</option>
          <option value="Newbie">🟡 Newbie</option>
          <option value="Beginner">🟢 Beginner</option>
          <option value="Advance">🟣 Advance</option>
        </select>
      </td>

      {/* Status */}
      <td className="border p-2 text-center">
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            player.status === "waiting"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {player.status}
        </span>
      </td>

      {/* ⏱ Wait Time */}
      <td className="border p-2 text-center">{minutes} min</td>

      {/* Matches */}
      <td className="border p-2 text-center">{player.matches}</td>

      {/* Action */}
      <td className="border p-2 text-center">
        <button
          className="text-red-500 hover:text-red-700 text-sm"
          onClick={() => onRemovePlayer(player.id)}
        >
          Remove
        </button>
      </td>
    </tr>
  );
}
