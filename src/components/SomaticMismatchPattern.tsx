import React, { useState } from "react";

const examples = [
  "Gently smile, even if you don’t feel like it.",
  "Lightly tap your chest or arm in a slow rhythm.",
  "Relax your jaw and take a soft breath.",
  "Hum softly for a few seconds.",
  "Shake out your hands gently.",
  "Look up and around the room.",
  "Sigh audibly and notice the feeling."
];

export default function SomaticMismatchPattern() {
  const [step, setStep] = useState(0);

  return (
    <div style={{
      background: "#1a2238cc",
      padding: "28px 20px",
      borderRadius: 16,
      maxWidth: 420,
      margin: "36px auto 0",
      color: "#fff",
      textAlign: "center",
      boxShadow: "0 4px 24px #13ffe522"
    }}>
      <h3 style={{ color: "#13ffe5", marginBottom: 12 }}>Somatic Mismatch Pattern (SMP)</h3>
      {step === 0 && (
        <>
          <div style={{ marginBottom: 14 }}>
            <b>Feeling stuck or tense?</b><br/>
            This technique uses gentle, unexpected body actions to interrupt stuck emotional or physical patterns.
          </div>
          <button
            onClick={() => setStep(1)}
            style={{
              background: "#13ffe5",
              color: "#232046",
              border: "none",
              borderRadius: 8,
              padding: "10px 24px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >Begin</button>
        </>
      )}
      {step === 1 && (
        <>
          <div style={{ marginBottom: 16 }}>
            <b>1. Notice.</b> Close your eyes for a moment.<br />
            Where do you feel tension, anxiety, or “stuckness” in your body?
          </div>
          <button
            onClick={() => setStep(2)}
            style={{
              background: "#ffd966", color: "#232046", border: "none", borderRadius: 8,
              padding: "9px 22px", fontWeight: 600, cursor: "pointer"
            }}
          >Next</button>
        </>
      )}
      {step === 2 && (
        <>
          <div style={{ marginBottom: 16 }}>
            <b>2. Mismatch.</b> Try one of these gentle, unexpected actions:
            <ul style={{ textAlign: "left", margin: "10px auto 0", maxWidth: 340, color: "#79ffe1" }}>
              {examples.map((ex, idx) => (
                <li key={idx}>{ex}</li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => setStep(3)}
            style={{
              background: "#ffb6c1", color: "#232046", border: "none", borderRadius: 8,
              padding: "9px 22px", fontWeight: 600, cursor: "pointer"
            }}
          >Next</button>
        </>
      )}
      {step === 3 && (
        <>
          <div style={{ marginBottom: 18 }}>
            <b>3. Notice again.</b><br />
            What changed in your body, breath, or mind? How does it feel now—any shift?
          </div>
          <div style={{ marginTop: 10, color: "#ffd966", fontWeight: 500 }}>
            This gentle "mismatch" helps the nervous system break old loops and find new safety.
          </div>
          <button
            onClick={() => setStep(0)}
            style={{
              marginTop: 18,
              background: "#13ffe5", color: "#232046", border: "none", borderRadius: 8,
              padding: "10px 24px", fontWeight: 600, cursor: "pointer"
            }}
          >Restart</button>
        </>
      )}
    </div>
  );
}
