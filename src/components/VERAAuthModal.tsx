import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./VERAAuthModal.css";

type PlanId = "explorer" | "regulator" | "integrator" | "enterprise";
type TabId = "signin" | "signup";

export type VERAAuthModalProps = {
  /** Controls visibility */
  isOpen: boolean;
  /** Called when user closes the modal (overlay click, ESC, close button) */
  onClose: () => void;
  /** Which tab should be active when opening */
  defaultTab?: TabId;
  /** Optionally preselect a plan when opening Sign Up */
  preselectedPlan?: PlanId | "";
  /** Optional hook to override sign-in */
  onSignIn?: (email: string, password: string) => Promise<void>;
  /** Optional hook to override checkout/session creation for signup */
  onCreateCheckout?: (args: { plan: PlanId; name: string; email: string }) => Promise<{ url?: string }>;
};

/**
 * VERAAuthModal
 * - Sign In + Sign Up tabs
 * - Plan preselection on Sign Up
 * - Stripe checkout POST fallback to /api/create-checkout
 * - A11y: focus lock, ESC to close, roles/labels, tab order
 * - Scroll lock while open
 */
export default function VERAAuthModal({
  isOpen,
  onClose,
  defaultTab = "signin",
  preselectedPlan = "",
  onSignIn,
  onCreateCheckout,
}: VERAAuthModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");

  // Sign in form
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");

  // Sign up form
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [plan, setPlan] = useState<PlanId | "">("");

  // Refs for focus management
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Keep internal state synced with props on open
  useEffect(() => {
    if (!isOpen) return;
    setErr("");
    setActiveTab(defaultTab);
    setPlan(preselectedPlan || "");
    // clear sign-in/sign-up fields on open for safety
    setSigninEmail("");
    setSigninPassword("");
    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
  }, [isOpen, defaultTab, preselectedPlan]);

  // Scroll lock while open
  useLayoutEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Focus first input when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      firstFieldRef.current?.focus();
    }, 0);
    return () => clearTimeout(t);
  }, [isOpen, activeTab]);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // crude focus trap: loop focus inside panel
      if (e.key === "Tab" && panelRef.current) {
        const focusables = getFocusables(panelRef.current);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

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
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Close on overlay click (but not when clicking panel)
  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) {
      onClose();
    }
  }

  // Helpers
  function getFocusables(root: HTMLElement): HTMLElement[] {
    const selectors = [
      "a[href]",
      "area[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "iframe",
      "audio[controls]",
      "video[controls]",
      "[contenteditable=true]",
      "[tabindex]:not([tabindex='-1'])",
    ];
    const nodes = Array.from(root.querySelectorAll<HTMLElement>(selectors.join(",")));
    return nodes.filter((n) => n.offsetParent !== null || n.getClientRects().length > 0);
  }

  // Submit handlers
  async function handleSignInSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    if (!signinEmail || !signinPassword) {
      setErr("Please enter both email and password.");
      return;
    }
    try {
      setLoading(true);
      if (onSignIn) {
        await onSignIn(signinEmail, signinPassword);
      } else {
        // Demo flow: keep parity with your HTML (redirect using stored plan or explorer)
        const storedPlan = (localStorage.getItem("vera_plan") as PlanId | null) || "explorer";
        alert(`Welcome back! Redirecting to your ${storedPlan} portal...`);
        setTimeout(() => {
          window.location.href = `portal-${storedPlan}.html`;
        }, 1200);
      }
      onClose();
    } catch (e: any) {
      setErr(e?.message || "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    if (!signupName || !signupEmail || !signupPassword || !plan) {
      setErr("Please fill in all fields and select a plan.");
      return;
    }

    try {
      setLoading(true);

      // Prefer custom handler if provided
      if (onCreateCheckout) {
        const result = await onCreateCheckout({ plan, name: signupName, email: signupEmail });
        if (result?.url) {
          localStorage.setItem("vera_plan", plan);
          localStorage.setItem("vera_email", signupEmail);
          window.location.href = result.url;
          return;
        }
        // No URL → fall back to demo success
      } else {
        // Default: POST to your API (Stripe session creation)
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
      }

      // DEMO fallback (like your index.html) if API is not ready or fails:
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
      }, 1200);

      onClose();
    } catch (e: any) {
      setErr(e?.message || "Sign up failed. Please try again.");
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
      <div ref={panelRef} className="vera-auth-panel" onMouseDown={(e) => e.stopPropagation()}>
        <button
          ref={closeBtnRef}
          className="vera-auth-close"
          aria-label="Close authentication modal"
          title="Close"
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

        {err && <div className="vera-auth-error" role="alert">{err}</div>}

        {/* Sign In */}
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
                aria-required="true"
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
                aria-required="true"
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

        {/* Sign Up */}
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
                aria-required="true"
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
                aria-required="true"
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
                aria-required="true"
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
                aria-required="true"
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
