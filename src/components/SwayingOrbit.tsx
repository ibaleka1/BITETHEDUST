import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { VeraContext } from "../pages/_app";
import "./SwayingOrb.css";

export default function SwayingOrbit() {
  const { speakerOn, voiceName = "Samantha" } = useContext(VeraContext) as {
    speakerOn: boolean;
    voiceName?: string;
  };

  const [open, setOpen] = useState(false);
  const swayRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!open) return;
    // guided loop (soft, spaced prompts)
    const lines = [
      "Let your body sway with me.",
      "Inhale as you drift left...",
      "Exhale as you drift right...",
      "Slowly. Gently. You're safe here.",
    ];
    let i = 0;
    const t = setInterval(() => {
      speak(lines[i % lines.length]);
      i++;
    }, 6000);
    return () => clearInterval(t);
  }, [open, speak]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="sway-section">
      <button type="button" className="sway-open-btn" onClick={() => setOpen(true)}>
        Open Sway
      </button>

      {open && (
        <div className="sway-modal" role="dialog" aria-modal="true" aria-label="Swaying orbit">
          <div className="sway-backdrop" onClick={() => setOpen(false)} />
          <div className="sway-content" ref={swayRef}>
            <div className="sway-orbit">
              {/* particles */}
              {Array.from({ length: 40 }).map((_, idx) => (
                <div className={`sway-particle p${(idx % 6) + 1}`} key={idx} />
              ))}
            </div>
            <div className="sway-controls">
              <button type="button" className="sway-close-btn" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
