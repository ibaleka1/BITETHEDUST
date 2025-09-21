import React from "react";
import "./PricingSection.css";

type PlanId = "explorer" | "regulator" | "integrator" | "enterprise";

type PricingSectionProps = {
  onSelectPlan?: (plan: PlanId) => void;        // optional: open your auth/checkout modal
  ctaHrefEnterprise?: string;                   // optional: external link for enterprise
};

export default function PricingSection({
  onSelectPlan,
  ctaHrefEnterprise = "/portal-enterprise.html",
}: PricingSectionProps) {
  return (
    <section id="pricing" className="pricing-section" aria-labelledby="pricing-heading">
      <div className="pricing-header">
        <h2 id="pricing-heading" className="pricing-title">Your Journey Home</h2>
        <p className="pricing-subtitle">
          Choose the path that meets your nervous system where it is — then grow from there.
        </p>
      </div>

      <div className="pricing-grid" role="list">
        {/* Explorer */}
        <article className="pricing-card" role="listitem">
          <h3 className="plan-name">EXPLORER</h3>
          <div className="plan-price">
            <span className="currency">$</span>19
            <span className="per">/mo</span>
          </div>
          <ul className="pricing-features">
            <li>Daily nervous system check-ins</li>
            <li>Basic VERA conversations</li>
            <li>3 guided exercises daily</li>
            <li>Personal progress tracking</li>
          </ul>
          <button
            className="plan-cta"
            aria-label="Start Exploring plan"
            onClick={() => onSelectPlan?.("explorer")}
          >
            Start Exploring
          </button>
        </article>

        {/* Regulator (Featured) */}
        <article className="pricing-card featured" role="listitem" aria-label="Regulator plan, most popular">
          <div className="plan-ribbon" aria-hidden="true">MOST POPULAR</div>
          <h3 className="plan-name gold">REGULATOR</h3>
          <div className="plan-price">
            <span className="currency">$</span>39
            <span className="per">/mo</span>
          </div>
          <ul className="pricing-features">
            <li>Unlimited VERA conversations</li>
            <li>Advanced somatic protocols</li>
            <li>Real-time HRV integration</li>
            <li>Personalized regulation plans</li>
            <li>Voice-guided sessions</li>
          </ul>
          <button
            className="plan-cta gold"
            aria-label="Choose Regulator plan"
            onClick={() => onSelectPlan?.("regulator")}
          >
            Get Regulated
          </button>
        </article>

        {/* Integrator */}
        <article className="pricing-card" role="listitem">
          <h3 className="plan-name">INTEGRATOR</h3>
          <div className="plan-price">
            <span className="currency">$</span>79
            <span className="per">/mo</span>
          </div>
          <ul className="pricing-features">
            <li>Everything in Regulator</li>
            <li>1-on-1 monthly sessions</li>
            <li>Custom trauma protocols</li>
            <li>Advanced biometric analysis</li>
            <li>Priority support</li>
          </ul>
          <button
            className="plan-cta"
            aria-label="Choose Integrator plan"
            onClick={() => onSelectPlan?.("integrator")}
          >
            Full Integration
          </button>
        </article>

        {/* Enterprise */}
        <article className="pricing-card" role="listitem">
          <h3 className="plan-name">ENTERPRISE</h3>
          <div className="plan-price custom">Custom</div>
          <ul className="pricing-features">
            <li>Organization-wide deployment</li>
            <li>Custom API integration</li>
            <li>HIPAA compliance</li>
            <li>Dedicated success manager</li>
            <li>Analytics dashboard</li>
          </ul>
          {onSelectPlan ? (
            <button
              className="plan-cta"
              aria-label="Contact Sales for Enterprise"
              onClick={() => onSelectPlan?.("enterprise")}
            >
              Contact Sales
            </button>
          ) : (
            <a
              className="plan-cta"
              aria-label="Contact Sales for Enterprise"
              href={ctaHrefEnterprise}
            >
              Contact Sales
            </a>
          )}
        </article>
      </div>

      <p className="pricing-footnote" aria-live="polite">
        Test mode enabled • Use Stripe test card: <strong>4242 4242 4242 4242</strong> • Any future date • Any CVC
      </p>
    </section>
  );
}

