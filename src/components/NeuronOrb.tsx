import React, { useRef, useEffect } from "react";
import "./NeuronNetworkOrb.css";

const axons = [
  // Each axon connects two nodes (cx1, cy1) -> (cx2, cy2)
  { from: [100, 100], to: [40, 50] },
  { from: [100, 100], to: [160, 60] },
  { from: [100, 100], to: [50, 160] },
  { from: [100, 100], to: [170, 160] },
  { from: [100, 100], to: [100, 190] },
  { from: [100, 100], to: [30, 100] },
  { from: [100, 100], to: [180, 100] },
];

const nodes = [
  { cx: 100, cy: 100, r: 38 }, // main
  { cx: 40, cy: 50, r: 16 },
  { cx: 160, cy: 60, r: 12 },
  { cx: 50, cy: 160, r: 11 },
  { cx: 170, cy: 160, r: 13 },
  { cx: 100, cy: 190, r: 10 },
  { cx: 30, cy: 100, r: 8 },
  { cx: 180, cy: 100, r: 9 },
];

const signals = [
  // Each signal will animate along a path from center to node
  { pathIndex: 0, duration: 2.2, delay: 0 },
  { pathIndex: 1, duration: 2.5, delay: 0.7 },
  { pathIndex: 2, duration: 2.3, delay: 1.2 },
  { pathIndex: 3, duration: 2.4, delay: 1.7 },
  { pathIndex: 4, duration: 2.6, delay: 0.9 },
  { pathIndex: 5, duration: 2.7, delay: 1.3 },
  { pathIndex: 6, duration: 2.1, delay: 0.6 },
];

function getPathD(from: number[], to: number[]) {
  // Organic quadratic curve
  const [x1, y1] = from, [x2, y2] = to;
  const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * 8;
  const my = (y1 + y2) / 2 + (Math.random() - 0.5) * 8;
  return `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
}

export default function NeuronNetworkOrb({ onActivate }: { onActivate?: () => void }) {
  // Animate signals by updating stroke-dashoffset with CSS
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Redraw axon paths occasionally for organic feel
    const interval = setInterval(() => {
      if (svgRef.current) {
        const paths = svgRef.current.querySelectorAll(".axon-path");
        axons.forEach((axon, i) => {
          const d = getPathD(axon.from, axon.to);
          (paths[i] as SVGPathElement).setAttribute("d", d);
        });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="neuron-network-orb-container">
      <svg ref={svgRef} viewBox="0 0 200 200" className="neuron-network-orb" aria-hidden="true">
        <defs>
          <radialGradient id="orb-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="60%" stopColor="#13ffe5" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#005d7f" stopOpacity="0.7" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* Axon paths */}
        {axons.map((axon, i) => (
          <path
            key={i}
            className="axon-path"
            d={getPathD(axon.from, axon.to)}
            filter="url(#glow)"
          />
        ))}
        {/* Nodes */}
        {nodes.map((node, i) => (
          <circle
            key={i}
            className={i === 0 ? "main-node" : "sub-node"}
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill="url(#orb-gradient)"
            filter="url(#glow)"
          />
        ))}
        {/* Signal pulses */}
        {signals.map((signal, i) => (
          <circle
            key={i}
            className={`signal-pulse signal-pulse-${i}`}
            r="7"
          />
        ))}
      </svg>
      <div className="neuron-orb-label">Activate VERA</div>
      <div
        className="neuron-orb-activation-area"
        tabIndex={0}
        role="button"
        aria-label="Activate VERA"
        onClick={onActivate}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onActivate?.()}
      />
    </div>
  );
}
