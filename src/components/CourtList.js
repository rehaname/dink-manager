import React from "react";
import CourtCard from "./CourtCard";

export default function CourtList({ courts, players, onAssign, onRemove, onRemoveCourt,readOnly = false,}) {
  return (
    <div
      className={"grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6"}
    >
      {courts.map((court, index) => (
        <CourtCard
          key={court.id}
          court={court}
          players={players}
          onAssign={onAssign}
          onRemove={onRemove}
          onRemoveCourt={onRemoveCourt}
          isDefault={index < 3}   // keep your default-court flag
          readOnly={readOnly}     // 👈 pass through to hide controls on /display
        />
      ))}
    </div>
  );
}
