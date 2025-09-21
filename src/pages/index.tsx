import React, { useState } from "react";
import NeuronOrb from "../components/NeuronOrb";
import VERACompanion from "../components/VERACompanion";
import BreathingOrb from "../components/BreathingOrb";

export default function Home() {
  // Manage which orb is active: "neuro", "vera", "breathing"
  const [activeOrb, setActiveOrb] = useState<"neuro" | "vera" | "breathing">("neuro");
  const [thinking, setThinking] = useState(false);

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a2238 0%, #27215a 100%)",
      padding: 0,
      fontFamily: "'Poppins', sans-serif"
    }}>
      <header style={{
        textAlign: "center",
        padding: "32px 0 16px 0"
      }}>
        <h1 style={{
          color: "#13ffe5",
          fontWeight: 700,
          fontSize: "2.3em",
          letterSpacing: "1.5px",
          marginBottom: 6
        }}>
          Welcome to VERA
        </h1>
        <p style={{
          color: "#fff9",
          fontSize: "1.07em",
          margin: 0
        }}>
          Your AI Companion, with NEURO visualization and mindful breathing
        </p>
      </header>
      <section style={{ display: "flex", justifyContent: "center", margin: "32px 0 20px 0", gap: 24 }}>
        <button
          onClick={() => setActiveOrb("neuro")}
          style={{
            padding: "10px 18px",
            borderRadius: 22,
            border: "none",
            background: activeOrb === "neuro" ? "#13ffe5" : "#232046",
            color: activeOrb === "neuro" ? "#232046" : "#13ffe5",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: activeOrb === "neuro" ? "0 0 12px #13ffe5aa" : "none",
            transition: "background 0.2s"
          }}
        >
          NEURO
        </button>
        <button
          onClick={() => setActiveOrb("vera")}
          style={{
            padding: "10px 18px",
            borderRadius: 22,
            border: "none",
            background: activeOrb === "vera" ? "#ffb6c1" : "#232046",
            color: activeOrb === "vera" ? "#232046" : "#ffb6c1",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: activeOrb === "vera" ? "0 0 12px #ffb6c1bb" : "none",
            transition: "background 0.2s"
          }}
        >
          VERA Orb
        </button>
        <button
          onClick={() => setActiveOrb("breathing")}
          style={{
            padding: "10px 18px",
            borderRadius: 22,
            border: "none",
            background: activeOrb === "breathing" ? "#76c7ff" : "#232046",
            color: activeOrb === "breathing" ? "#232046" : "#76c7ff",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: activeOrb === "breathing" ? "0 0 12px #76c7ffaa" : "none",
            transition: "background 0.2s"
          }}
        >
          Breathing Orb
        </button>
      </section>
      <section style={{ display: "flex", justifyContent: "center", minHeight: 380 }}>
        {activeOrb === "neuro" && (
          <NeuronOrb />
        )}
        {activeOrb === "vera" && (
          // If you want to show the classic VERA orb, replace NeuronOrb with VERAOrb
          <NeuronOrb />
        )}
        {activeOrb === "breathing" && (
          <BreathingOrb />
        )}
      </section>
      <section style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 44,
        marginBottom: 22,
        minHeight: 100
      }}>
        {/* VERACompanion can be always present or only shown in certain orb modes */}
        <VERACompanion
          onThinking={setThinking}
          // Include other props for voice, chat, etc.
        />
      </section>
    </main>
  );
}
