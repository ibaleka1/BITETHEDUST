import React, { useRef } from "react";
import "./VERAOrb.css";

const playChime = () => {
  const audio = new Audio("/vera-chime.mp3");
  audio.play();
};

const VERAOrb: React.FC = () => {
  const orbRef = useRef<HTMLDivElement>(null);

  const activate = () => {
    if (orbRef.current) {
      orbRef.current.classList.add("active");
      playChime();
      setTimeout(() => {
        orbRef.current && orbRef.current.classList.remove("active");
      }, 1500);
    }
  };

  return (
    <div className="vera-orb-wrapper">
      <div
        ref={orbRef}
        className="vera-orb"
        onClick={activate}
        tabIndex={0}
        role="button"
        aria-label="Activate VERA"
      >
        <span className="vera-orb-glow"></span>
        <span className="vera-orb-inner"></span>
      </div>
      <div style={{ marginTop: 12, color: "#555" }}>
        Click the orb to activate VERA
      </div>
    </div>
  );
};

export default VERAOrb;
