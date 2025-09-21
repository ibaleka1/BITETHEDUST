import "./MethodologySection.css";

export default function MethodologySection() {
  const items = [
    {
      k: "Nervous System Lens",
      v: "VERA guides you to notice breath, tension, and speed — the real-time language of your body.",
    },
    {
      k: "Somatic Sequencing",
      v: "Short, layered steps: orient → breathe → feel → name → choose. No overwhelm.",
    },
    {
      k: "Gentle Psycho-Education",
      v: "Plain language. No jargon. The right insight at the right time.",
    },
    {
      k: "Practice Over Perfection",
      v: "Micro-wins build safety. VERA stays with you while you try again.",
    },
  ];
  return (
    <section id="methodology" className="methodology-section" aria-labelledby="methodology-heading">
      <h2 id="methodology-heading" className="m-title">How VERA Works With You</h2>
      <div className="m-list">
        {items.map((it, i) => (
          <div className="m-row" key={i}>
            <div className="m-k">{it.k}</div>
            <div className="m-v">{it.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

