import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import BreathingOrb from "./BreathingOrb";
import GroundingExercise from "./GroundingExercise";
import SwayingOrbit from "./SwayingOrbit";
import SomaticMismatchPattern from "./SomaticMismatchPattern";
import { VeraContext } from "../pages/_app";
import "./ExercisesSection.css";

type Phase = "inhale" | "hold" | "exhale";

export default function ExercisesSection() {
  return (
    <section id="experience" className="exercises-section" aria-labelledby="exercises-heading">
      <h2 id="exercises-heading" className="exercises-title">Regulation Exercises</h2>

      {/* Breathing with guided counts overlay */}
      <div className="exercise-card">
        <header className="exercise-header">
          <h3>Guided Breathing</h3>
          <p className="exercise-sub">In 1-2-3-4 • Hold 1-2-3-4 • Out 6-5-4-3-2-1</p>
        </header>

        <div className="guided-breathing-wrap">
          <BreathingOrb />
          <GuidedBreathingOverlay />
        </div>

        <p className="exercise-note">
          Tip: If you enabled speaker, VERA counts out loud. Otherwise, follow the on-screen numbers.
        </p>
      </div>

      {/* Swaying orbit with voice guidance */}
      <div className="exercise-card">
        <header className="exercise-header">
          <h3>Swaying Orbit</h3>
          <p className="exercise-sub">Gentle left-right sway at ~6 breaths/min, guided by voice.</p>
        </header>
        <SwayingOrbit />
      </div>

      {/* Grounding 5-4-3-2-1 */}
      <div className="exercise-card">
        <header className="exercise-header">
          <h3>5-4-3-2-1 Grounding</h3>
          <p className="exercise-sub">Orient to the present using your senses.</p>
        </header>
        <GroundingExercise />
      </div>

      {/* Somatic mismatch mini-journal */}
      <div className="exercise-card">
        <header className="exercise-header">
          <h3>Somatic Mismatch</h3>
          <p className="exercise-sub">Notice where your body’s response doesn’t match the situation.</p>
        </header>
        <SomaticMismatchPattern />
      </div>
    </section>
  );
}

/* ------- Guided Breathing Overlay (counts + optional TTS) ------- */

function GuidedBreathingOverlay() {
  const { speakerOn, voiceName = "Samantha" } = useContext(VeraContext) as {
    speakerOn: boolean;
    voiceName?: string;
  };

  // pattern: Inhale 4s (1..4), Hold 4s (1..4), Exhale 6s (6..1)
  const pattern: { phase: Phase; seconds: number }[] = useMemo(
    () => [
      { phase: "inhale", seconds: 4 },
      { phase: "hold", seconds: 4 },
      { phase: "exhale", seconds: 6 },
    ],
    []
  );

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [count, setCount] = useState(1);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const currentPhase = pattern[phaseIndex]?.phase ?? "inhale";
  const phaseSeconds = pattern[phaseIndex]?.seconds ?? 4;

  // Count text (exhale is descending 6..1)
  const displayCount = currentPhase === "exhale" ? phaseSeconds - count + 1 : count;

  const speak = useCallback(
    (text: string) => {
      if (!speakerOn) return;
      if (!("speechSynthesis" in window)) return;
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-US";
      utter.rate = 1;
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find((v) => v.name.toLowerCase().includes((voiceName || "").toLowerCase()));
      if (match) utter.voice = match;
      window.speechSynthesis.speak(utter);
    },
    [speakerOn, voiceName]
  );

  const speakPhase = useCallback(
    (phase: Phase) => {
      if (!speakerOn) return;
      if (phase === "inhale") speak("Inhale. One, two, three, four.");
      else if (phase === "hold") speak("Hold. One, two, three, four.");
      else speak("Exhale. Six, five, four, three, two, one.");
    },
    [speak, speakerOn]
  );

  const start = () => {
    if (running) return;
    setRunning(true);
  };
  const stop = () => {
    setRunning(false);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  };

  // timer driving the counts
  useEffect(() => {
    if (!running) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // announce phase at start
    setCount(1);
    speakPhase(currentPhase);

    intervalRef.current = window.setInterval(() => {
      setCount((c) => {
        const next = c + 1;
        if (next > phaseSeconds) {
          // move to next phase
          setPhaseIndex((i) => (i + 1) % pattern.length);
          return 1; // reset for next phase
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, currentPhase, phaseSeconds, pattern.length, speakPhase]);

  // When phase changes while running, announce new phase
  useEffect(() => {
    if (running) {
      setCount(1);
      speakPhase(currentPhase);
    }
  }, [currentPhase, running, speakPhase]);

  return (
    <div className="guided-overlay" aria-live="polite">
      <div className={`phase-chip ${currentPhase}`}>
        {currentPhase === "inhale" ? "Inhale" : currentPhase === "hold" ? "Hold" : "Exhale"}
      </div>
      <div className="count-display">{displayCount}</div>
      <div className="overlay-controls" role="group" aria-label="Breathing controls">
        {!running ? (
          <button type="button" className="overlay-btn" onClick={start} aria-label="Start guided breathing">
            Start
          </button>
        ) : (
          <button type="button" className="overlay-btn" onClick={stop} aria-label="Stop guided breathing">
            Stop
          </button>
        )}
      </div>
      <p className="overlay-hint">Follow the numbers. With speaker on, VERA will count it out for you.</p>
    </div>
  );
}
