import "./LivingUniverse.css";

export default function LivingUniverse() {
  return (
    <section className="universe-section" aria-label="Living universe background">
      <div className="universe-sky">
        {Array.from({ length: 60 }).map((_, i) => (
          <span className={`star s${(i % 6) + 1}`} key={i} />
        ))}
      </div>
      <div className="universe-copy">
        <h3>It’s not just a chat.</h3>
        <p>It’s a little universe that breathes with you.</p>
      </div>
    </section>
  );
}
