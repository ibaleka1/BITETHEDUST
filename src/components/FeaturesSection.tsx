import "./FeaturesSection.css";

export default function FeaturesSection() {
  const features = [
    {
      title: "Alive Conversation",
      desc: "VERA listens, reflects, and stays with you. Text or voice — your choice.",
    },
    {
      title: "Somatic Tools Built-In",
      desc: "Breathing, grounding, swaying, and mismatch journaling — right where you need them.",
    },
    {
      title: "Voice Guidance",
      desc: "Soft, paced prompts that help your body slow down and re-center.",
    },
    {
      title: "Private by Design",
      desc: "Local journaling and minimal data. You control what you share.",
    },
  ];

  return (
    <section id="features" className="features-section" aria-labelledby="features-heading">
      <h2 id="features-heading" className="features-title">What VERA Does For You</h2>
      <p className="features-subtitle">Simple, powerful tools — wrapped in a companion that actually feels present.</p>

      <div className="features-grid" role="list">
        {features.map((f, i) => (
          <article className="feature-card" role="listitem" key={i}>
            <div className="feature-glow" />
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

