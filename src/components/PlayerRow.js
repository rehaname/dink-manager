import React from "react";

export default function PlayerRow({ player, onRemove }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="border p-2">{player.name}</td>
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
      <td className="border p-2 text-center">{player.matches}</td>
      <td className="border p-2 text-center">
        <button
          className="text-red-500 hover:text-red-700 text-sm"
          onClick={() => onRemove(player.id)}
        >
          Remove
        </button>
      </td>
    </tr>
  );
}
