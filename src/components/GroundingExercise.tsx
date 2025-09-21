import { useEffect, useState } from "react";
import "./GroundingExercise.css";

type SenseKey = "see" | "feel" | "hear" | "smell" | "taste";
type GroundingState = Record<SenseKey, string[]>;

const DEFAULT: GroundingState = {
  see: ["", "", "", "", ""],     // 5
  feel: ["", "", "", ""],        // 4
  hear: ["", "", ""],            // 3
  smell: ["", ""],               // 2
  taste: [""],                   // 1
};

const STORAGE_KEY = "vera_grounding_54321_v1";

export default function GroundingExercise() {
  const [data, setData] = useState<GroundingState>(DEFAULT);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data]);

  function update(k: SenseKey, idx: number, val: string) {
    setData((d) => {
      const next = { ...d, [k]: [...d[k]] };
      next[k][idx] = val;
      return next;
    });
  }
  function reset() {
    setData(DEFAULT);
  }

  return (
    <div className="grounding-wrap">
      <div className="grounding-grid">
        <Card title="5 things you can see" accent="see">
          {data.see.map((v, i) => (
            <InputRow key={i} value={v} onChange={(t) => update("see", i, t)} placeholder={`#${i + 1}`} />
          ))}
        </Card>

        <Card title="4 things you can feel" accent="feel">
          {data.feel.map((v, i) => (
            <InputRow key={i} value={v} onChange={(t) => update("feel", i, t)} placeholder={`#${i + 1}`} />
          ))}
        </Card>

        <Card title="3 things you can hear" accent="hear">
          {data.hear.map((v, i) => (
            <InputRow key={i} value={v} onChange={(t) => update("hear", i, t)} placeholder={`#${i + 1}`} />
          ))}
        </Card>

        <Card title="2 things you can smell" accent="smell">
          {data.smell.map((v, i) => (
            <InputRow key={i} value={v} onChange={(t) => update("smell", i, t)} placeholder={`#${i + 1}`} />
          ))}
        </Card>

        <Card title="1 thing you can taste" accent="taste">
          {data.taste.map((v, i) => (
            <InputRow key={i} value={v} onChange={(t) => update("taste", i, t)} placeholder="#1" />
          ))}
        </Card>
      </div>

      <div className="grounding-actions">
        <button className="g-btn" onClick={reset}>Reset</button>
      </div>
    </div>
  );
}

function Card(props: { title: string; accent: SenseKey; children: React.ReactNode }) {
  return (
    <section className={`g-card ${props.accent}`}>
      <h4 className="g-title">{props.title}</h4>
      <div className="g-body">{props.children}</div>
    </section>
  );
}

function InputRow(props: { value: string; onChange: (t: string) => void; placeholder?: string }) {
  return (
    <div className="g-row">
      <input
        className="g-input"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        aria-label={props.placeholder}
      />
    </div>
  );
}
