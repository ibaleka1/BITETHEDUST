import React from "react";
import "./HeartSection.css";

export default function HeartSection() {
  return (
    <section id="heart" className="heart-section" aria-labelledby="heart-heading">
      <div className="heart-content">
        <h2 id="heart-heading" className="heart-title">
          The Heart of VERA
        </h2>
        <p className="heart-subtitle">
          Built by two visionaries who believe nervous system wisdom should be
          accessible, beautiful, and alive.
        </p>

        <div className="heart-cards">
          {/* Eva */}
          <div className="heart-card">
            <img
              src="/eva.jpg"
              alt="Eva Leka, Founder of Regulate to Elevate"
              className="heart-avatar"
            />
            <h3 className="heart-name">Eva Leka</h3>
            <p className="heart-role">Founder & Methodology Architect</p>
            <p className="heart-bio">
              Eva is the creator of Regulate to Elevate, designing a neuroscience-
              grounded framework that makes complex trauma patterns visible,
              practical, and transformable.
            </p>
          </div>

          {/* Julija */}
          <div className="heart-card">
            <img
              src="/julija.jpg"
              alt="Julija Krajceva, Co-Founder of VERA"
              className="heart-avatar"
            />
            <h3 className="heart-name">Julija Krajceva</h3>
            <p className="heart-role">Co-Founder & Creative Director</p>
            <p className="heart-bio">
              Julija brings artistry and design mastery, ensuring VERA feels
              as stunning as it is intelligent. She shapes the experience where
              science meets human beauty.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
