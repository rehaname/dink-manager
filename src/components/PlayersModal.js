import React, { useEffect } from "react";

export default function PlayersModal({ open, courtName, players, onClose, onSpeak }) {
  // 🧠 Always call hooks — even if modal is closed
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // 🧱 If not open, render nothing
  if (!open) return null;

  const levelColors = {
    Newbie: "bg-yellow-200 text-yellow-800",
    Beginner: "bg-green-200 text-green-800",
    Intermediate: "bg-blue-200 text-blue-800",
    Advance: "bg-purple-200 text-purple-800",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-white rounded-xl shadow-2xl w-[min(98vw,900px)] p-5 animate-[fadeIn_120ms_ease-out]">
        {/* Header */}
        <div className="relative mb-5 text-center">
          <h3 className="text-3xl font-bold text-[#1E3A8A]">{courtName} — Players</h3>
          <button
            onClick={onClose}
            className="absolute right-0 top-0 text-gray-500 hover:text-gray-700 text-base"
            aria-label="Close"
          >
            ✖
          </button>
        </div>

        {/* Player list */}
        <ul className="space-y-2 mb-4">
  {players.length === 0 ? (
    <li className="text-gray-600 text-lg">No players assigned.</li>
  ) : (
    players.map((p) => (
      <li
        key={p.id}
        className="relative border rounded-lg px-3 py-4 flex flex-col items-center text-center"
      >
        {/* 🔖 Level tag (top-right corner) */}
        <span
          className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-semibold rounded ${levelColors[p.level]}`}
        >
          {p.level ?? "Intermediate"}
        </span>

        {/* 🧍 Player name */}
        <span className="text-2xl font-bold text-[#1E3A8A]">{p.name}</span>

        {/* ⚖️ Matches */}
        <span className="text-xs text-gray-500 mt-1">
          {p.matches} match{p.matches === 1 ? "" : "es"}
        </span>
      </li>
    ))
  )}
</ul>


        {/* Buttons */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onSpeak}
            className="bg-[#1E3A8A] text-white px-4 py-2 rounded hover:bg-[#243c90] text-sm"
          >
            🔊 Speak Names
          </button>
          <button
            onClick={onClose}
            className="px-3 py-2 rounded border text-sm hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* Optional: add fadeIn animation in index.css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px) scale(.99); }
  to { opacity: 1; transform: none; }
}
*/
