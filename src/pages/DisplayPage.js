import React, { useEffect, useState } from "react";
import CourtList from "../components/CourtList";
import { loadState } from "../utils/storage";
import PlayersModal from "../components/PlayersModal";

export default function DisplayPage() {
  const [courts, setCourts] = useState([]);
  const [players, setPlayers] = useState([]);
  const [openCourtId, setOpenCourtId] = useState(null);
  // initial load
  useEffect(() => {
    const saved = loadState();
    setCourts(saved?.courts || [
      { id: 1, name: "Court 1", players: [] },
      { id: 2, name: "Court 2", players: [] },
      { id: 3, name: "Court 3", players: [] },
    ]);
    setPlayers(saved?.players || []);
  }, []);

  // live sync via storage events (updates when manager tab saves)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "pickleballAppState" && e.newValue) {
        try {
          const next = JSON.parse(e.newValue);
          setCourts(next.courts || []);
          setPlayers(next.players || []);
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);

       let bc;
   if ("BroadcastChannel" in window) {
     bc = new BroadcastChannel("dink_manager");
     bc.onmessage = (msg) => {
       const { type, courtId } = msg?.data || {};
       if (type === "OPEN_MODAL") setOpenCourtId(courtId || null);
       if (type === "CLOSE_MODAL") setOpenCourtId(null);
     };
   }

    // Optional: BroadcastChannel for same-window multi-tabs latency-free sync
    if ("BroadcastChannel" in window) {
      bc = new BroadcastChannel("dink_manager");
      bc.onmessage = (msg) => {
        if (msg?.data?.type === "STATE_UPDATE") {
          setCourts(msg.data.payload.courts || []);
          setPlayers(msg.data.payload.players || []);
        }
      };
    }

    return () => {
      window.removeEventListener("storage", onStorage);
      if (bc) bc.close();
    };
  }, []);

  const selectedCourt = courts.find((c) => c.id === openCourtId) || null;
 const selectedPlayers = selectedCourt
   ? players.filter((p) => selectedCourt.players.includes(p.id))
   : [];


  // Big, calm, read-only board
  return (
    <div className="min-h-screen bg-white p-6">
      <header className="flex items-center justify-center gap-3 mb-6">
        <img src={`${process.env.PUBLIC_URL}/logo512.png`} alt="Dink" className="w-10 h-10" />
        <h1 className="text-3xl font-bold text-[#1E3A8A]">The Pickle & Co 1016</h1>
      </header>

<CourtList courts={courts} players={players} readOnly />

     {/* Page-level modal opened remotely */}
    <PlayersModal
       open={!!selectedCourt}
       courtName={selectedCourt?.name || ""}
       players={selectedPlayers}
       onClose={() => setOpenCourtId(null)}
       onSpeak={() => {
         if (!selectedCourt) return;
         const names = selectedPlayers.map((p) => p.name).join(", ");
         const u = new SpeechSynthesisUtterance(
           names ? `${selectedCourt.name}. Players are: ${names}.` : `${selectedCourt.name} has no players.`
         );
         speechSynthesis.speak(u);
       }}
     />
              {/* Footer */}
          <footer className="text-center text-gray-400 text-xs mt-8">
            Powered by <span className="font-semibold text-gray-500">Dink Manager</span>
          </footer>
    </div>
  );
}
