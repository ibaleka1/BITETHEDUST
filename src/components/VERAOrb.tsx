import React, { useRef, useState } from "react";
import "./VERAOrb.css";
import { speakWithVera } from "../utils/speak";

const VERAOrb: React.FC = () => {
  const orbRef = useRef<HTMLDivElement>(null);
  const [listening, setListening] = useState(false);

  const activate = async () => {
    if (orbRef.current) {
      orbRef.current.classList.add("active");
      setTimeout(() => orbRef.current?.classList.remove("active"), 1500);
    }
    // Example: Speak a compassionate greeting
    await speakWithVera("Hello, I'm VERA. How can I support you today?");
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
        Click the orb to talk to VERA
      </div>
    </div>
  );
};

export default VERAOrb;
