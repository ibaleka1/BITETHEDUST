import { useMemo } from "react";
import "./NeuronOrb.css";

/**
 * Dense, glowing neuron orb with animated axons + pulses.
 * Matches the vibe of your HTML "living neural" visuals.
 */
export default function NeuronOrb() {
  // Dense coordinates & edges; built once.
  const { nodes, edges, pulses } = useMemo(() => {
    // Core + satellites
    const center = { id: "c", x: 100, y: 100, r: 20, main: true };

    const satellites = [
      { id: "n1", x: 50, y: 38, r: 8 },
      { id: "n2", x: 150, y: 45, r: 8 },
      { id: "n3", x: 36, y: 92, r: 7 },
      { id: "n4", x: 168, y: 90, r: 7 },
      { id: "n5", x: 46, y: 160, r: 8 },
      { id: "n6", x: 155, y: 160, r: 8 },
      { id: "n7", x: 92, y: 40, r: 6 },
      { id: "n8", x: 120, y: 28, r: 6 },
      { id: "n9", x: 22, y: 122, r: 6 },
      { id: "n10", x: 178, y: 126, r: 6 },
      { id: "n11", x: 22, y: 70, r: 6 },
      { id: "n12", x: 178, y: 70, r: 6 },
      { id: "n13", x: 82, y: 176, r: 6 },
      { id: "n14", x: 116, y: 176, r: 6 },
      { id: "n15", x: 76, y: 132, r: 5 },
      { id: "n16", x: 124, y: 132, r: 5 },
      { id: "n17", x: 70, y: 88, r: 5 },
      { id: "n18", x: 130, y: 88, r: 5 },
      { id: "n19", x: 100, y: 20, r: 5 },
      { id: "n20", x: 100, y: 180, r: 5 },
    ];

    // Edges from center to many, plus cross-links for webbing
    const toC = satellites.map((s) => ({
      from: center,
      to: s,
      curve: (dx: number, dy: number) => ({
        // slight bezier curve toward mid
        cx: center.x + dx * 0.25,
        cy: center.y + dy * 0.25,
      }),
    }));

    const cross: Array<{
      from: (typeof satellites)[number];
      to: (typeof satellites)[number];
      bend?: number;
    }> = [
      { from: satellites[0], to: satellites[7], bend: 0.2 },
      { from: satellites[1], to: satellites[8], bend: -0.25 },
      { from: satellites[2], to: satellites[4], bend: 0.3 },
      { from: satellites[3], to: satellites[5], bend: -0.2 },
      { from: satellites[7], to: satellites[10], bend: 0.25 },
      { from: satellites[8], to: satellites[11], bend: -0.25 },
      { from: satellites[13], to: satellites[14], bend: 0.15 },
      { from: satellites[15], to: satellites[16], bend: -0.15 },
      { from: satellites[17], to: satellites[7], bend: 0.2 },
      { from: satellites[18], to: satellites[8], bend: -0.2 },
    ];

    const edges = [
      ...toC.map((e) => {
        const dx = e.to.x - e.from.x;
        const dy = e.to.y - e.from.y;
        const { cx, cy } = e.curve(dx, dy);
        return {
          d: `M${e.from.x},${e.from.y} C${cx},${cy} ${e.to.x},${e.to.y} ${e.to.x},${e.to.y}`,
        };
      }),
      ...cross.map(({ from, to, bend = 0.2 }) => {
        const mx = (from.x + to.x) / 2 + (to.y - from.y) * bend;
        const my = (from.y + to.y) / 2 + (from.x - to.x) * bend;
        return {
          d: `M${from.x},${from.y} Q${mx},${my} ${to.x},${to.y}`,
        };
      }),
    ];

    // Pulses radiating along different vectors (CSS anim handles motion)
    const pulses = new Array(12).fill(0).map((_, i) => ({
      key: `p-${i}`,
      className: `signal-pulse signal-pulse-${i % 7}`,
      r: 2.8,
    }));

    return { nodes: [center, ...satellites], edges, pulses };
  }, []);

  return (
    <div className="neuron-network-orb-container" aria-hidden="true">
      <svg className="neuron-network-orb" viewBox="0 0 200 200">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {edges.map((e, idx) => (
          <path key={`e-${idx}`} d={e.d} className="axon-path" />
        ))}

        {/* Nodes */}
        {nodes.map((n) =>
          n.main ? (
            <circle key={n.id} cx={n.x} cy={n.y} r={n.r} className="main-node" fill="none" />
          ) : (
            <circle key={n.id} cx={n.x} cy={n.y} r={n.r} className="sub-node" fill="none" />
          )
        )}

        {/* Animated pulses (CSS keyframes handle motion) */}
        {pulses.map((p) => (
          <circle key={p.key} r={p.r} className={p.className} />
        ))}
      </svg>

      <div className="neuron-orb-label">VERA</div>
      <div className="neuron-orb-activation-area" tabIndex={0} aria-label="decorative neuron orb" />
    </div>
  );
}
