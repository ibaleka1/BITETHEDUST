// Animated breathing orb with 4-4-4 rhythm. Accessible, TTS coaching if speaker enabled.
import { useRef, useState, useContext } from "react";
import { VeraContext } from "../pages/_app";
import "./BreathingOrb.css";

const coachingLine = "Let's breathe together. Inhale slowly for four, hold, then exhale gently.";

export default function BreathingOrb() {
  const [playing, setPlaying] = useState(false);
  const { speakerOn } = useContext(VeraContext);
  const orbRef = useRef<HTMLDivElement>(null);

  function speak() {
    if (!speakerOn) return;
    if ("speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(coachingLine);
      utter.lang = "en-US";
      utter.rate = 1;
      window.speechSynthesis.speak(utter);
    }
  }

  function start() {
    setPlaying(true);
    speak();
  }

  function stop() {
    setPlaying(false);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  return (
    <section id="breathing" className="breathing-orb-section" aria-labelledby="breathing-heading">
      <h2 id="breathing-heading" className="breathing-orb-title">Breathing Exercise</h2>
      <div
        ref={orbRef}
        className={`breathing-orb${playing ? " active" : ""}`}
        aria-label="Breathing Orb"
        tabIndex={0}
        role="img"
        aria-live="polite"
      />
      <div>
        {playing ? (
          <button className="breathing-orb-btn" onClick={stop} aria-label="Stop breathing exercise">
            Stop
          </button>
        ) : (
          <button className="breathing-orb-btn" onClick={start} aria-label="Breathe with me">
            Breathe with me
          </button>
        )}
      </div>
      <p className="breathing-orb-desc">
        Inhale for four… hold for four… exhale for four. Let your breath guide you home.
      </p>
    </section>
  );
}
