// src/components/VERASomaticMismatch.tsx
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import "./VERASomaticMismatch.css";

// Optional context (works standalone if you don’t use it)
let VeraCtx: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  VeraCtx = require("../pages/_app").VeraContext;
} catch {}
const VeraContext =
  VeraCtx?.VeraContext ?? React.createContext({ speakerOn: true, setSpeakerOn: (_: boolean) => {} });

type Step = {
  id: string;
  title: string;
  prompt: string;
  detail?: string;
  durationSec?: number; // suggested pacing for voice
};

const STEPS: Step[] = [
  {
    id: "orient",
    title: "1) Orient to Safety",
    prompt:
      "Let your eyes drift around the space. Name three colors you see. Feel the support under you. Notice something pleasant or neutral.",
    detail:
      "Turn your head and neck slowly. Let your vision land gently on stable objects. If anything feels too much, soften your gaze.",
    durationSec: 20,
  },
  {
    id: "locate",
    title: "2) Locate the Sensation",
    prompt:
      "Where is it most alive in your body right now? Put a hand there. How big is it? Still or moving? Warm or cool?",
    detail:
      "You’re mapping, not fixing. Describe it with curious precision. If it moves, let your hand track with it.",
    durationSec: 25,
  },
  {
    id: "micro",
    title: "3) Offer the Micro-Movement",
    prompt:
      "What tiny movement does your body want? A millimeter of shoulder melt. A small turn of the ribcage. Let it be barely visible.",
    detail:
      "Permission a 1% change. If it helps, exhale softly while the body explores. Small is powerful.",
    durationSec: 25,
  },
  {
    id: "counter",
    title: "4) Counter-Posture (Mismatch)",
    prompt:
      "Now imagine the opposite shape of your current holding. If you’re collapsed, offer a micro-lift. If you’re rigid, offer a micro-soften.",
    detail:
      "We’re creating a somatic mismatch: the old reflex expects the old posture; your system discovers a new option.",
    durationSec: 25,
  },
  {
    id: "pendulate",
    title: "5) Pendulate & Compare",
    prompt:
      "Gently pendulate between old and new by 5%: toward the familiar hold… and toward the new option. Which feels more resourcing?",
    detail:
      "Move like seaweed in warm water. Stay within comfort. Let breath lengthen naturally on the way back to the new option.",
    durationSec: 25,
  },
  {
    id: "integrate",
    title: "6) Integrate & Rest",
    prompt:
      "Pause. Notice after-sensations. Heat, tingling, space, or quiet. Thank your body. Let the new option linger in your posture.",
    detail:
      "If it feels right, name one word that describes now. Safety, room, warmth, or simply okay.",
    durationSec: 20,
  },
];

export default function VERASomaticMismatch({
  title = "Somatic Mismatch Practice",
  subtitle = "Create a gentle 'not what the body expected' moment to update old reflexes.",
  showIntensity = true,
  autoVoice = true,
}: {
  title?: string;
  subtitle?: string;
  showIntensity?: boolean;
  autoVoice?: boolean;
}) {
  const ctx = useContext(VeraContext);
  const externalSpeaker = typeof ctx?.speakerOn === "boolean" ? ctx.speakerOn : undefined;
  const setExternalSpeaker = typeof ctx?.setSpeakerOn === "function" ? ctx.setSpeakerOn : undefined;

  const [speakerOn, setSpeakerOn] = useState<boolean>(externalSpeaker ?? true);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [intensity, setIntensity] = useState(3); // 1–5 slider
  const [elapsed, setElapsed] = useState(0); // seconds inside a step
  const [visMode, setVisMode] = useState<"calm" | "pulse" | "sway">("calm");
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // sync with external context
  useEffect(() => {
    if (externalSpeaker !== undefined) setSpeakerOn(externalSpeaker);
  }, [externalSpeaker]);
  useEffect(() => {
    if (setExternalSpeaker) setExternalSpeaker(speakerOn);
  }, [speakerOn, setExternalSpeaker]);

  const step = STEPS[stepIndex];

  const speak = useCallback(
    (text: string) => {
      if (!speakerOn) return;
      if (!("speechSynthesis" in window)) return;
      const synth = window.speechSynthesis;
      synth.cancel(); // stop any previous
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.98;
      u.pitch = 1.06;
      u.lang = "en-US";
      u.onstart = () => setVisMode("pulse");
      u.onend = () => setVisMode("calm");
      synth.speak(u);
    },
    [speakerOn]
  );

  const playChime = useCallback((name: "start" | "advance") => {
    try {
      const src = name === "start" ? "/vera-chime.mp3" : "/vera-soft.mp3";
      const a = new Audio(src);
      audioRef.current = a;
      a.play();
    } catch {}
  }, []);

  // start / stop practice
  const start = useCallback(() => {
    setPlaying(true);
    setElapsed(0);
    playChime("start");
    // voice
    if (autoVoice) {
      const combined = `${step.title}. ${step.prompt} ${step.detail ? step.detail : ""}`;
      speak(combined);
    }
  }, [autoVoice, playChime, speak, step.detail, step.prompt, step.title]);

  const stop = useCallback(() => {
    setPlaying(false);
    setElapsed(0);
    setVisMode("calm");
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const next = useCallback(() => {
    setStepIndex((i) => Math.min(STEPS.length - 1, i + 1));
    setElapsed(0);
    playChime("advance");
  }, [playChime]);

  const prev = useCallback(() => {
    setStepIndex((i) => Math.max(0, i - 1));
    setElapsed(0);
    playChime("advance");
  }, [playChime]);

  // auto progression timer
  useEffect(() => {
    if (!playing) return;
    const target = step.durationSec ?? 22;
    timerRef.current = window.setInterval(() => {
      setElapsed((e) => {
        const n = e + 1;
        if (n >= target) {
          // auto-advance if not last step
          if (stepIndex < STEPS.length - 1) {
            setStepIndex(stepIndex + 1);
            if (autoVoice) {
              const ns = STEPS[stepIndex + 1];
              const combined = `${ns.title}. ${ns.prompt} ${ns.detail ? ns.detail : ""}`;
              speak(combined);
            }
            return 0;
          } else {
            // complete
            stop();
            return 0;
          }
        }
        return n;
      });
    }, 1000) as unknown as number;

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [playing, speak, step.durationSec, stepIndex, stop, autoVoice]);

  // announce current step when changed (ARIA polite)
  useEffect(() => {
    if (!playing || !autoVoice) return;
    const combined = `${step.title}. ${step.prompt} ${step.detail ? step.detail : ""}`;
    // slight delay to avoid overlap with chime
    const id = setTimeout(() => speak(combined), 200);
    return () => clearTimeout(id);
  }, [stepIndex]); // intentionally minimal deps

  const percent = useMemo(() => {
    const total = STEPS.reduce((acc, s) => acc + (s.durationSec ?? 22), 0);
    const before = STEPS.slice(0, stepIndex).reduce((acc, s) => acc + (s.durationSec ?? 22), 0);
    const current = Math.min((elapsed / (step.durationSec ?? 22)) * (100 / STEPS.length), 100 / STEPS.length);
    return Math.min(100, ((before / total) * 100) + current);
  }, [elapsed, step.durationSec, stepIndex]);

  return (
    <section className="smx-card" aria-labelledby="smx-heading">
      <header className="smx-head">
        <div>
          <h3 id="smx-heading" className="smx-title">{title}</h3>
          <p className="smx-sub">{subtitle}</p>
        </div>
        <div className="smx-head-controls" role="group" aria-label="Somatic mismatch voice and power">
          <button
            className={`smx-btn ${playing ? "stop" : "start"}`}
            onClick={playing ? stop : start}
            aria-pressed={playing}
            aria-label={playing ? "Stop practice" : "Start practice"}
          >
            {playing ? "Stop" : "Start"}
          </button>
          <button
            className={`smx-btn ghost ${speakerOn ? "active" : ""}`}
            onClick={() => setSpeakerOn((v) => !v)}
            aria-pressed={speakerOn}
            aria-label={speakerOn ? "Mute voice guidance" : "Unmute voice guidance"}
            title="Voice guidance"
          >
            🔊
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="smx-progress" aria-hidden="true">
        <div className="smx-progress-bar" style={{ width: `${percent}%` }} />
      </div>

      {/* Visualizer */}
      <div className={`smx-visual ${visMode}`}>
        <div className={`smx-orb i-${intensity}`} />
        <div className="smx-waves">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} style={{ ["--i" as any]: i }} />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="smx-step" aria-live="polite">
        <h4 className="smx-step-title">{step.title}</h4>
        <p className="smx-step-prompt">{step.prompt}</p>
        {step.detail && <p className="smx-step-detail">{step.detail}</p>}

        <div className="smx-timer" role="timer" aria-atomic="true">
          <span>Time: </span>
          <strong>{String(elapsed).padStart(2, "0")}s</strong>
          <span className="muted"> / {(step.durationSec ?? 22)}s</span>
        </div>
      </div>

      {/* Controls */}
      <div className="smx-controls">
        <div className="smx-controls-left">
          <button
            className="smx-btn ghost"
            onClick={prev}
            disabled={stepIndex === 0}
            aria-label="Previous step"
          >
            ← Prev
          </button>
          <div className="smx-step-index" aria-live="polite">
            Step {stepIndex + 1} / {STEPS.length}
          </div>
          <button
            className="smx-btn ghost"
            onClick={next}
            disabled={stepIndex === STEPS.length - 1}
            aria-label="Next step"
          >
            Next →
          </button>
        </div>

        <div className="smx-controls-right">
          <label className="smx-intensity">
            <span>Intensity</span>
            {showIntensity && (
              <input
                type="range"
                min={1}
                max={5}
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value, 10))}
                aria-label="Visualizer intensity"
              />
            )}
          </label>

          <label className="smx-visual-mode">
            <span>Visual</span>
            <select
              value={visMode}
              onChange={(e) => setVisMode(e.target.value as any)}
              aria-label="Visualizer style"
            >
              <option value="calm">Calm</option>
              <option value="pulse">Pulse</option>
              <option value="sway">Sway</option>
            </select>
          </label>
        </div>
      </div>

      {/* Safety note */}
      <p className="smx-note">
        If anything feels intense, pause and orient to something pleasant. Small is powerful. Your body leads.
      </p>
    </section>
  );
}
