import React, { useRef, useState } from "react";

// Somatic Mismatch cues (feel free to add more!)
const cues = [
  "Gently smile, even if you don’t feel like it.",
  "Tap your chest or arm in a new rhythm.",
  "Take a soft, unexpected sigh.",
  "Hum a short, playful tune.",
  "Shake your hands as if flicking off water.",
  "Look up and around the room.",
  "Wiggle your toes inside your shoes.",
  "Stick your tongue out just for fun.",
  "Relax your jaw and let it hang for a moment."
];

// Helper to pick a random element
function randomPick(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function VERASomaticMismatch() {
  const [glow, setGlow] = useState(false);
  const [cue, setCue] = useState<string | null>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  // Glowing with irregular rhythm
  function startGlow() {
    setGlow(true);
    const randomCue = randomPick(cues);
    setCue(randomCue);

    // Speak the cue using browser speech synthesis
    if ("speechSynthesis" in window) {
      const utter = new window.SpeechSynthesisUtterance(randomCue);
      utter.rate = 1.05;
      utter.pitch = 1.1;
      window.speechSynthesis.cancel(); // Stop any current speech
      window.speechSynthesis.speak(utter);
    }

    // Animate the glow in unexpected rhythm for 8 seconds
    let cycles = 0;
    function irregularGlow() {
      if (cycles > 8) {
        setGlow(false);
        setCue(null);
        return;
      }
      setGlow(g => !g);
      cycles++;
      timeoutRef.current = window.setTimeout(
        irregularGlow,
        300 + Math.random() * 1100 // Between 300ms and 1400ms
      );
    }
    irregularGlow();
  }

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", marginTop: 56
    }}>
      <div
        className={`vera-orb ${glow ? "vera-orb-glow" : ""}`}
        style={{
          width: 180, height: 180, borderRadius: "50%",
          background: "radial-gradient(circle at 60% 40%, #13ffe5 0%, #232046 75%)",
          boxShadow: glow
            ? "0 0 70px 35px #13ffe5aa, 0 0 140px 75px #fff6"
            : "0 0 30px 8px #13ffe577",
          transition: "box-shadow 0.35s cubic-bezier(.68,-0.55,.27,1.55)",
          filter: glow ? "blur(1.5px)" : "blur(0.5px)",
          position: "relative"
        }}
      >
        <span style={{
          position: "absolute", bottom: 18, left: 0, right: 0,
          color: "#fff", textAlign: "center", fontWeight: 600, letterSpacing: 1,
          fontSize: "1.05em", textShadow: "0 2px 16px #13ffe577"
        }}>
          {cue}
        </span>
      </div>
      {!glow && (
        <button
          onClick={startGlow}
          style={{
            marginTop: 36, background: "#13ffe5", color: "#232046",
            border: "none", borderRadius: 10, padding: "13px 30px",
            fontWeight: 700, fontSize: "1.08em", letterSpacing: "1px",
            cursor: "pointer", boxShadow: "0 2px 18px #13ffe533"
          }}
        >
          Let VERA surprise you!
        </button>
      )}
      {glow && (
        <div style={{ marginTop: 30, color: "#ffd966", fontWeight: 600 }}>
          Notice how your body feels with this new rhythm.
        </div>
      )}
    </div>
  );
}
