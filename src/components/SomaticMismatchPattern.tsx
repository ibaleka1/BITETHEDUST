import { useEffect, useState } from "react";
import "./SomaticMismatchPattern.css";

const STORAGE_KEY = "vera_somatic_mismatch_notes_v1";

export default function SomaticMismatchPattern() {
  const [text, setText] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setText(raw);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, text);
    } catch {}
  }, [text]);

  return (
    <div className="smp-card">
      <p className="smp-explainer">
        Somatic mismatch is when your body’s response doesn’t match the actual level of threat or
        context. Gently name the mismatch without judgment. What does your body believe is happening?
        What is actually happening?
      </p>
      <label htmlFor="smp-notes" className="smp-label">Journal</label>
      <textarea
        id="smp-notes"
        className="smp-textarea"
        placeholder="e.g., My chest is tight like I’m in danger. But I’m safe at home with my dog..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
      />
      <div className="smp-actions">
        <button className="smp-btn" type="button" onClick={() => setText("")}>Clear</button>
      </div>
    </div>
  );
}
