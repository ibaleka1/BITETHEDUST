import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./VERAAuthModal.css";

type PlanId = "explorer" | "regulator" | "integrator" | "enterprise";
type TabId = "signin" | "signup";

export default function VERAAuthModal({
  isOpen,
  onClose,
  defaultTab = "signin",
  preselectedPlan = "",
}: {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: TabId;
  preselectedPlan?: PlanId | "";
}) {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Sign in
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");

  // Sign up
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [plan, setPlan] = useState<PlanId | "">("");

  // A11y & focus management
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Reset each open
  useEffect(() => {
    if (!isOpen) return;
    setErr("");
    setActiveTab(defaultTab);
    setPlan(preselectedPlan || "");
    setSigninEmail("");
    setSigninPassword("");
    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
  }, [isOpen, defaultTab, preselectedPlan]);

  // Scroll lock
  useLayoutEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [isOpen]);

  // Focus first field
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => firstFieldRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [isOpen, activeTab]);

  // Focus trap & ESC
  useEffect(() => {
    if (!isOpen) return;

    const getFocusables = (root: HTMLElement): HTMLElement[] => {
      const sel = [
        "a[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "[tabindex]:not([tabindex='-1'])",
      ];
      return Array.from(root.querySelectorAll<HTMLElement>(sel.join(","))).filter(
        (n) => n.offsetParent !== null || n.getClientRects().length > 0
      );
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = getFocusables(panelRef.current);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement as HTMLElement;
      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Overlay click to close
  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) onClose();
  }

  // Built-in SIGN IN (demo parity with your HTML)
  async function handleSignInSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!signinEmail || !signinPassword) {
      setErr("Please enter both email and password.");
      return;
    }
    try {
      setLoading(true);
      const storedPlan = (localStorage.getItem("vera_plan") as PlanId | null) || "explorer";
      alert(`Welcome back! Redirecting to your ${storedPlan} portal...`);
      setTimeout(() => {
        window.location.href = `portal-${storedPlan}.html`;
      }, 1000);
      onClose();
    } catch (err: any) {
      setErr(err?.message || "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Built-in SIGN UP → Stripe checkout with graceful test fallback
  async function handleSignUpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    if (!signupName || !signupEmail || !signupPassword || !plan) {
      setErr("Please fill in all fields and select a plan.");
      return;
    }

    try {
      setLoading(true);
      const resp = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, name: signupName, email: signupEmail }),
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data?.url) {
          localStorage.setItem("vera_plan", plan);
          localStorage.setItem("vera_email", signupEmail);
          window.location.href = data.url;
          return;
        }
      }

      // Fallback (exactly like your index.html behavior)
      alert(
        `Test Mode: Simulating successful payment for ${plan} plan. Check ${signupEmail} for your welcome email and temporary password.`
      );
      localStorage.setItem("vera_session", "test_session_" + Date.now());
      localStorage.setItem("vera_plan", plan);
      localStorage.setItem("vera_email", signupEmail);

      setTimeout(() => {
        if (plan === "explorer") window.location.href = "portal-explorer.html?success=true";
        else if (plan === "regulator") window.location.href = "portal-regulator.html?success=true";
        else if (plan === "integrator") window.location.href = "portal-integrator.html?success=true";
        else window.location.href = "portal-enterprise.html?success=true";
      }, 1000);

      onClose();
    } catch (err: any) {
      setErr(err?.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="vera-auth-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vera-auth-title"
      onMouseDown={handleOverlayClick}
    >
      <div
        ref={panelRef}
        className="vera-auth-panel"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          className="vera-auth-close"
          aria-label="Close authentication modal"
          onClick={onClose}
        >
          ×
        </button>

        <h2 id="vera-auth-title" className="vera-auth-heading">
          Welcome to <span>VERA</span>
        </h2>

        <div className="vera-auth-tabs" role="tablist" aria-label="Authentication">
          <button
            role="tab"
            aria-selected={activeTab === "signin"}
            aria-controls="vera-signin-panel"
            id="vera-signin-tab"
            className={`vera-auth-tab ${activeTab === "signin" ? "active" : ""}`}
            onClick={() => setActiveTab("signin")}
          >
            Sign In
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "signup"}
            aria-controls="vera-signup-panel"
            id="vera-signup-tab"
            className={`vera-auth-tab ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {err && (
          <div className="vera-auth-error" role="alert">
            {err}
          </div>
        )}

        {activeTab === "signin" && (
          <form
            id="vera-signin-panel"
            role="tabpanel"
            aria-labelledby="vera-signin-tab"
            className="vera-auth-form"
            onSubmit={handleSignInSubmit}
          >
            <label className="vera-auth-label">
              Email
              <input
                ref={firstFieldRef}
                type="email"
                className="vera-auth-input"
                placeholder="you@example.com"
                autoComplete="email"
                value={signinEmail}
                onChange={(e) => setSigninEmail(e.target.value)}
                required
              />
            </label>

            <label className="vera-auth-label">
              Password
              <input
                type="password"
                className="vera-auth-input"
                placeholder="••••••••"
                autoComplete="current-password"
                value={signinPassword}
                onChange={(e) => setSigninPassword(e.target.value)}
                required
                minLength={8}
              />
            </label>

            <button
              className="vera-auth-submit"
              type="submit"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? "Signing in…" : "Sign In to VERA"}
            </button>

            <p className="vera-auth-muted">
              <a href="#" onClick={(e) => e.preventDefault()} className="vera-auth-link">
                Forgot password?
              </a>
            </p>
          </form>
        )}

        {activeTab === "signup" && (
          <form
            id="vera-signup-panel"
            role="tabpanel"
            aria-labelledby="vera-signup-tab"
            className="vera-auth-form"
            onSubmit={handleSignUpSubmit}
          >
            <label className="vera-auth-label">
              Full Name
              <input
                ref={firstFieldRef}
                type="text"
                className="vera-auth-input"
                placeholder="Your full name"
                autoComplete="name"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                required
              />
            </label>

            <label className="vera-auth-label">
              Email
              <input
                type="email"
                className="vera-auth-input"
                placeholder="you@example.com"
                autoComplete="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
            </label>

            <label className="vera-auth-label">
              Create Password
              <input
                type="password"
                className="vera-auth-input"
                placeholder="Create a password"
                autoComplete="new-password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
                minLength={8}
              />
            </label>

            <label className="vera-auth-label">
              Select Your Journey
              <select
                className="vera-auth-input select"
                value={plan}
                onChange={(e) => setPlan(e.target.value as PlanId)}
                required
              >
                <option value="">Select your plan</option>
                <option value="explorer">Explorer — $19/mo</option>
                <option value="regulator">Regulator — $39/mo (MOST POPULAR)</option>
                <option value="integrator">Integrator — $79/mo</option>
                <option value="enterprise">Enterprise — Custom</option>
              </select>
            </label>

            <button
              className="vera-auth-submit"
              type="submit"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? "Processing…" : "Begin Your Journey"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
