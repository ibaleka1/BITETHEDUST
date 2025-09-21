import { useMemo } from "react";
import "./LivingUniverse.css";

/**
 * Background canvas of living neurons, fascia lines, and consciousness waves.
 * Pure CSS animations; randomized placement each render.
 */
export default function LivingUniverse() {
  const { neurons, fascia, waves } = useMemo(() => {
    const neurons = Array.from({ length: 250 }).map((_, i) => ({
      key: `n-${i}`,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 2 + Math.random() * 6,
      delay: Math.random() * 30,
      dur: 20 + Math.random() * 15,
      colorIdx: Math.floor(Math.random() * 6),
    }));

    const fascia = Array.from({ length: 100 }).map((_, i) => ({
      key: `f-${i}`,
      left: Math.random() * 100,
      top: Math.random() * 100,
      height: 100 + Math.random() * 300,
      rot: Math.random() * 360,
      delay: Math.random() * 10,
    }));

    const waves = Array.from({ length: 8 }).map((_, i) => ({
      key: `w-${i}`,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: i * 5,
    }));

    return { neurons, fascia, waves };
  }, []);

  return (
    <div className="living-universe" aria-hidden="true">
      {neurons.map((n) => (
        <div
          key={n.key}
          className={`living-neuron color-${n.colorIdx}`}
          style={{
            left: `${n.left}%`,
            top: `${n.top}%`,
            width: `${n.size}px`,
            height: `${n.size}px`,
            animationDelay: `${n.delay}s`,
            animationDuration: `${n.dur}s`,
          }}
        />
      ))}
      {fascia.map((f) => (
        <div
          key={f.key}
          className="fascia-line"
          style={{
            left: `${f.left}%`,
            top: `${f.top}%`,
            height: `${f.height}px`,
            transform: `rotate(${f.rot}deg)`,
            animationDelay: `${f.delay}s`,
          }}
        />
      ))}
      {waves.map((w) => (
        <div
          key={w.key}
          className="consciousness-wave"
          style={{
            left: `${w.left}%`,
            top: `${w.top}%`,
            width: `600px`,
            height: `600px`,
            animationDelay: `${w.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
