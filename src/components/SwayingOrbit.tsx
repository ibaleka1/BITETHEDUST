// Full-screen modal with floating particle orbit and gentle sway (6 breaths/min).
import { useEffect, useRef, useState } from "react";
import "./SwayingOrb.css";

export default function SwayingOrbit() {
  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === modalRef.current) setOpen(false);
  }

  return (
    <>
      <button
        className="swaying-orbit-open"
        onClick={() => setOpen(true)}
        aria-label="Open Sway Modal"
      >Sway with VERA</button>
      {open && (
        <div ref={modalRef} className="swaying-orbit-modal" tabIndex={-1} onMouseDown={handleBackdrop} aria-modal="true" role="dialog">
          <div className="swaying-orbit-content">
            <div className="swaying-orbit-particles" />
            <h2>Swaying Exercise</h2>
            <p>Let your body gently sway, like kelp in warm water.</p>
            <button onClick={() => setOpen(false)} className="swaying-orbit-close" aria-label="Close Sway Modal">Close</button>
          </div>
        </div>
      )}
    </>
  );
}
