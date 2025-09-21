import { useEffect } from "react";

export default function LivingUniverse() {
  useEffect(() => {
    const universe = document.getElementById("livingUniverse");
    if (!universe) return;
    universe.innerHTML = "";

    for (let i = 0; i < 120; i++) {
      const neuron = document.createElement("div");
      neuron.className = "living-neuron";
      neuron.style.position = "absolute";
      neuron.style.left = Math.random() * 100 + "%";
      neuron.style.top = Math.random() * 100 + "%";
      neuron.style.animationDelay = Math.random() * 30 + "s";
      neuron.style.animationDuration = (20 + Math.random() * 15) + "s";
      const size = 2 + Math.random() * 6;
      neuron.style.width = size + "px";
      neuron.style.height = size + "px";
      const colors = [
        "var(--vera-purple)",
        "var(--vera-neural-blue)",
        "var(--vera-lavender)",
        "var(--vera-glow-pink)",
        "var(--vera-emerald)",
        "var(--vera-soft-gold)"
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      neuron.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
      neuron.style.borderRadius = "50%";
      universe.appendChild(neuron);
    }
  }, []);
  return (
    <div
      id="livingUniverse"
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        top: 0, left: 0,
        pointerEvents: "none",
        zIndex: 0
      }}
    />
  );
}
