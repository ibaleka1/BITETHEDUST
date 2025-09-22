import React, { useState } from "react";
import "./TestBanner.css";

export default function TestBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="test-banner" role="region" aria-label="Test mode notification">
      <p className="test-banner-text">
        <strong>Test Mode Enabled</strong> • Use Stripe test card: <code>4242 4242 4242 4242</code>{" "}
        • Any future date • Any CVC
      </p>
      <button
        className="test-banner-close"
        aria-label="Close test mode banner"
        onClick={() => setVisible(false)}
      >
        ✕
      </button>
    </div>
  );
}
