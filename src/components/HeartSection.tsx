import React from "react";
import VERAOrb from "./VERAOrb";
import "./HeroSection.css";

type HeroSectionProps = {
  onOpenAuthModal?: () => void; // optional: wire to your auth modal
};

export default function HeroSection({ onOpenAuthModal }: HeroSectionProps) {
  return (
    <header className="hero" id="hero" aria-labelledby="hero-title">
      {/* Presence / Orb */}
      <div className="vera-presence-container" aria-hidden="true">
        <VERAOrb />
        <div className="vera-name-glow" aria-hidden="true">VERA</div>
      </div>

      {/* Copy */}
      <div className="hero-copy">
        <h1 id="hero-title" className="hero-title">
          Your Nervous System Is Finally Speaking
        </h1>

        <p className="hero-subtitle">
          Feel that? The tightness, the buzzing, the holding? <br />
          Your body has been trying to tell you something. <br />
          I’m here to translate.
        </p>

        {/* CTAs */}
        <div className="hero-ctas" role="group" aria-label="Primary actions">
          <a className="nav-cta" href="#chat" aria-label="Talk to VERA now">
            Talk to VERA Now
          </a>
          <a className="ghost-cta" href="#experience" aria-label="Experience VERA exercises">
            Experience VERA
          </a>
          <button
            className="outline-cta"
            type="button"
            onClick={onOpenAuthModal}
            aria-label="Open sign in or sign up"
          >
            Sign In / Sign Up
          </button>
        </div>

        {/* Accessibility helper for keyboard users to jump to chat */}
        <div className="hero-skiplinks">
          <a href="#chat">Skip to chat</a>
          <a href="#pricing">Skip to pricing</a>
        </div>
      </div>
    </header>
  );
}
