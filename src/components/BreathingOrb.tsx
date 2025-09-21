import React, { useEffect, useState } from "react";
import "./BreathingOrb.css";

const PHASES = [
  { name: "Breathe In", duration: 4, color: "#76c7ff" },
  { name: "Hold", duration: 4, color: "#88ffe0" },
  { name: "Breathe Out", duration: 6, color: "#ffb6c1" },
];

export default function BreathingOrb() {
  const [phase, setPhase] = useState(0);
  const [count, setCount] = useState(PHASES[0].duration);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          setPhase((p) => (p + 1) % PHASES.length);
          return PHASES[(phase + 1) % PHASES.length].duration;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  // For smooth animation, calculate orb scale
  let scale = 1;
  if (PHASES[phase].name === "Breathe In") {
    scale = 1 + 0.5 * (1 - (count - 1) / (PHASES[phase].duration - 1));
  } else if (PHASES[phase].name === "Breathe Out") {
    scale = 1.5 - 0.5 * (1 - (count - 1) / (PHASES[phase].duration - 1));
  } else {
    scale = 1.5;
  }

  // Color transitions
  const orbStyle = {
    transform: `scale(${scale})`,
    background: `radial-gradient(circle at 60% 40%, ${PHASES[phase].color} 60%, #27215a 100%)`,
    transition: "background 1s, transform 1s cubic-bezier(.7,0,.3,1)",
    boxShadow: `0 0 60px 10px ${PHASES[phase].color}66, 0 0 100px 30px #fff3`,
  };

  return (
    <div className="breathing-orb-container">
      <div className="breathing-orb" style={orbStyle}></div>
      <div className="breathing-orb-text">
        <div className="breathing-orb-phase">{PHASES[phase].name}</div>
        <div className="breathing-orb-count">{count}</div>
      </div>
    </div>
  );
}
