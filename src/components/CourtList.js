import React from "react";
import CourtCard from "./CourtCard";

export default function CourtList({ courts, players, onAssign, onRemove, onRemoveCourt }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      {courts.map((court, index) => (
        <CourtCard
          key={court.id}
          court={court}
          players={players}
          onAssign={onAssign}
          onRemove={onRemove}
          onRemoveCourt={onRemoveCourt}
          isDefault={index < 3} // flag for default 3 courts
        />
      ))}
    </div>
  );
}
