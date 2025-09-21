import React, { useEffect, useRef, useState } from "react";
import "./VERANav.css";
import VERAAuthModal from "./VERAAuthModal";

/**
 * VERA Top Navigation
 * - Fixed below the test banner (configurable offset)
 * - Glass background, border, and shadow tighten on scroll
 * - Section anchor links + Sign In / Sign Up CTA
 * - Mobile menu (accessible, focus-trappable)
 * - Opens VERAAuthModal with full built-in wiring
 */
export default function VERANav({
  bannerOffset = 48, // px; aligns with your test banner height
}: {
  bannerOffset?: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const burgerRef = useRef<HTMLButtonElement | null>(null);

  // Scroll style tightening
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile drawer on route hash navigation or link click
  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const href = (e.currentTarget.getAttribute("href") || "").trim();
    if (href.startsWith("#")) {
      setMenuOpen(false);
    }
  }

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!drawerRef.current) return;
      const target = e.target as Node;
      if (!drawerRef.current.contains(target) && target !== burgerRef.current) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  // ESC to close menu
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Prevent body scroll when menu open (mobile)
  useEffect(() => {
    const original = document.body.style.overflow;
    if (menuOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [menuOpen]);

  return (
    <>
      {/* Skip to content (a11y) */}
      <a className="vera-skip" href="#main">
        Skip to content
      </a>

      <nav
        className={`vera-nav ${scrolled ? "scrolled" : ""}`}
        style={{ ["--nav-offset" as any]: `${bannerOffset}px` }}
        aria-label="Primary"
      >
        <div className="vera-nav-inner">
          {/* Brand */}
          <button
            className="vera-logo"
            onClick={() => (window.location.href = "/")}
            aria-label="Go to home"
          >
            VERA
          </button>

          {/* Desktop Links */}
          <ul className="vera-links">
            <li>
              <a href="#methodology" className="vera-link" onClick={handleNavClick}>
                Methodology
              </a>
            </li>
            <li>
              <a href="#pricing" className="vera-link" onClick={handleNavClick}>
                Pricing
              </a>
            </li>
            <li>
              <a href="#experience" className="vera-link" onClick={handleNavClick}>
                Experience VERA
              </a>
            </li>
          </ul>

          {/* Desktop CTA */}
          <div className="vera-cta">
            <button
              className="vera-cta-btn"
              onClick={() => setAuthOpen(true)}
              aria-haspopup="dialog"
              aria-controls="vera-auth-modal"
            >
              Sign In / Sign Up
            </button>
          </div>

          {/* Mobile Burger */}
          <button
            ref={burgerRef}
            className={`vera-burger ${menuOpen ? "open" : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="vera-mobile-drawer"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>

        {/* Mobile Drawer */}
        <div
          id="vera-mobile-drawer"
          ref={drawerRef}
          className={`vera-drawer ${menuOpen ? "open" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <ul className="vera-drawer-links" role="menu">
            <li role="none">
              <a
                role="menuitem"
                href="#methodology"
                className="vera-drawer-link"
                onClick={handleNavClick}
              >
                Methodology
              </a>
            </li>
            <li role="none">
              <a
                role="menuitem"
                href="#pricing"
                className="vera-drawer-link"
                onClick={handleNavClick}
              >
                Pricing
              </a>
            </li>
            <li role="none">
              <a
                role="menuitem"
                href="#experience"
                className="vera-drawer-link"
                onClick={handleNavClick}
              >
                Experience VERA
              </a>
            </li>
          </ul>

          <button
            className="vera-drawer-cta"
            onClick={() => {
              setMenuOpen(false);
              setAuthOpen(true);
            }}
            aria-haspopup="dialog"
            aria-controls="vera-auth-modal"
          >
            Sign In / Sign Up
          </button>
        </div>
      </nav>

      {/* Auth Modal (wired, no external props required beyond open/close) */}
      <VERAAuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultTab="signin"
      />
    </>
  );
}
