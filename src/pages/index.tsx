import React from "react";
import NeuronNetworkOrb from "../components/NeuronNetworkOrb";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "#031d27", padding: 0 }}>
      <h1 style={{ textAlign: "center", marginTop: "40px", color: "#13ffe5" }}>
        Welcome to VERA
      </h1>
      <NeuronNetworkOrb onActivate={() => {
        // Call your chime or ElevenLabs voice here!
        // e.g., speakWithVera("Hello, how can I support you?");
      }} />
    </main>
  );
}
