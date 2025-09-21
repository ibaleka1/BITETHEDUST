import { useState, useEffect } from "react";

export default function VERAAuthModal() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("openAuthModal", handler);
    return () => window.removeEventListener("openAuthModal", handler);
  }, []);

  if (!open) return null;
  return (
    <div className="modal" style={{
      display: "block", position: "fixed", zIndex: 2000, left: 0, top: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)"
    }}>
      <div className="modal-content" style={{
        background: "linear-gradient(135deg, rgba(10,14,39,0.98), rgba(21,24,50,0.95))",
        margin: "5% auto", padding: "3rem", border: "2px solid var(--vera-lavender)",
        width: "90%", maxWidth: 500, borderRadius: 30, position: "relative"
      }}>
        <span className="close" onClick={() => setOpen(false)} style={{
          position: "absolute", right: "2rem", top: "2rem", fontSize: "2rem", cursor: "pointer", color: "var(--text-muted)"
        }}>&times;</span>
        <h2 style={{
          textAlign: "center", marginBottom: "2rem", background: "linear-gradient(135deg, var(--vera-lavender), var(--vera-neural-blue))",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>
          Welcome to VERA
        </h2>
        <div className="auth-tabs" style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <button className={`auth-tab ${tab === "signin" ? "active" : ""}`} onClick={() => setTab("signin")}>Sign In</button>
          <button className={`auth-tab ${tab === "signup" ? "active" : ""}`} onClick={() => setTab("signup")}>Sign Up</button>
        </div>
        {tab === "signin" ? (
          <div id="signinForm" className="auth-form">
            <input type="email" placeholder="Email" style={{ width: "100%", marginBottom: "1rem" }} />
            <input type="password" placeholder="Password" style={{ width: "100%", marginBottom: "1rem" }} />
            <button className="auth-submit" style={{ width: "100%" }}>Sign In to VERA</button>
          </div>
        ) : (
          <div id="signupForm" className="auth-form">
            <input type="text" placeholder="Full Name" style={{ width: "100%", marginBottom: "1rem" }} />
            <input type="email" placeholder="Email" style={{ width: "100%", marginBottom: "1rem" }} />
            <input type="password" placeholder="Create Password" style={{ width: "100%", marginBottom: "1rem" }} />
            <select style={{ width: "100%", marginBottom: "1rem" }}>
              <option value="">Select Your Journey</option>
              <option value="explorer">Explorer - $19/mo</option>
              <option value="regulator">Regulator - $39/mo (MOST POPULAR)</option>
              <option value="integrator">Integrator - $79/mo</option>
              <option value="enterprise">Enterprise - Custom</option>
            </select>
            <button className="auth-submit" style={{ width: "100%" }}>Begin Your Journey</button>
          </div>
        )}
      </div>
    </div>
  );
}
