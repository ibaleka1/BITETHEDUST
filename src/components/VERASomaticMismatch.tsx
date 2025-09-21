import React, { useRef, useState } from "react";
import "./VERASomaticMismatch.css";

// Somatic Mismatch cues
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
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }

    // Animate the glow in unexpected rhythm for 8 cycles
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
    <div className="vera-somatic-container">
      <div className={`vera-orb ${glow ? "vera-orb-glow" : ""}`}>
        <span className="vera-orb-cue">{cue}</span>
      </div>
      {!glow && (
        <button className="vera-somatic-btn" onClick={startGlow}>
          Let VERA surprise you!
        </button>
      )}
      {glow && (
        <div className="vera-somatic-notice">
          Notice how your body feels with this new rhythm.
        </div>
      )}
    </div>
  );
}
