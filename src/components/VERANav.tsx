export default function VERANav() {
  return (
    <nav style={{
      position: "fixed",
      top: 48,
      width: "100%",
      padding: "1.5rem 3rem",
      background: "linear-gradient(180deg, rgba(10,14,39,0.98) 0%, rgba(10,14,39,0.9) 100%)",
      backdropFilter: "blur(20px)",
      zIndex: 1000,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid var(--glass-border)"
    }}>
      <div className="logo" style={{
        fontSize: "2rem",
        fontWeight: 300,
        letterSpacing: "0.3em",
        background: "linear-gradient(135deg, var(--vera-lavender), var(--vera-neural-blue))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        cursor: "pointer"
      }} onClick={() => window.location.href = "/"}>
        VERA
      </div>
      <div className="nav-menu" style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <a href="#methodology" className="nav-link">Methodology</a>
        <a href="#pricing" className="nav-link">Pricing</a>
        <a href="#experience" className="nav-link">Experience VERA</a>
        <button className="nav-cta" onClick={() => {
          const event = new CustomEvent("openAuthModal");
          window.dispatchEvent(event);
        }}>
          Sign In / Sign Up
        </button>
      </div>
    </nav>
  );
}
