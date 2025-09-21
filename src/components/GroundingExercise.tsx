import React, { useState } from "react";

const prompts = [
  { label: "5 things you can see", color: "#13ffe5" },
  { label: "4 things you can touch", color: "#ffd966" },
  { label: "3 things you can hear", color: "#79ffe1" },
  { label: "2 things you can smell", color: "#ffb6c1" },
  { label: "1 thing you can taste", color: "#a0c4ff" }
];

export default function GroundingExercise() {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<string[][]>([[], [], [], [], []]);
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input.trim()) return;
    const updated = [...responses];
    updated[step].push(input.trim());
    setResponses(updated);
    setInput("");
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const itemsNeeded = 5 - step;

  return (
    <div style={{
      background: "#1a2238cc",
      borderRadius: 18,
      padding: "32px 24px",
      maxWidth: 400,
      margin: "36px auto 0 auto",
      color: "#fff",
      textAlign: "center",
      boxShadow: "0 6px 36px #13ffe522"
    }}>
      <h3 style={{
        color: prompts[step].color,
        fontWeight: 600,
        letterSpacing: "1px",
        marginBottom: 14,
        marginTop: 0
      }}>
        {prompts[step].label}
      </h3>
      <div style={{
        minHeight: 56,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        {responses[step].map((item, idx) => (
          <div key={idx} style={{
            background: "#232046",
            borderRadius: 10,
            padding: "5px 14px",
            margin: "4px 0",
            width: "fit-content"
          }}>
            {item}
          </div>
        ))}
      </div>
      {responses[step].length < 5 - step && (
        <div style={{ marginTop: 12 }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your answer..."
            style={{
              borderRadius: 8,
              border: "none",
              padding: "10px 14px",
              fontSize: "1em",
              marginRight: 8,
              outline: "none"
            }}
            onKeyDown={e => { if (e.key === "Enter") handleAdd(); }}
          />
          <button
            style={{
              background: prompts[step].color,
              color: "#232046",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              fontWeight: 600,
              cursor: "pointer"
            }}
            onClick={handleAdd}
          >
            Add
          </button>
        </div>
      )}
      <div style={{ marginTop: 18 }}>
        {step > 0 && (
          <button
            onClick={handleBack}
            style={{
              marginRight: 12,
              background: "#232046",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "7px 18px",
              cursor: "pointer",
              fontWeight: 500
            }}
          >Back</button>
        )}
        {responses[step].length === 5 - step && step < 4 && (
          <button
            onClick={handleNext}
            style={{
              background: prompts[step + 1]?.color || "#fff",
              color: "#232046",
              border: "none",
              borderRadius: 8,
              padding: "7px 18px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >Next</button>
        )}
        {step === 4 && responses[4].length === 1 && (
          <div style={{ marginTop: 18, color: "#13ffe5", fontWeight: 600 }}>
            🎉 Well done! You’re grounded.
          </div>
        )}
      </div>
    </div>
  );
}
