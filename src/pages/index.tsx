import Head from "next/head";
import dynamic from "next/dynamic";

// If you want to lazy load your interactive exercises, you can use dynamic imports like this:
const GroundingExercise = dynamic(() => import("../src/components/GroundingExercise"), { ssr: false });
const SomaticMismatchPattern = dynamic(() => import("../src/components/SomaticMismatchPattern"), { ssr: false });
const VERASomaticMismatch = dynamic(() => import("../src/components/VERASomaticMismatch"), { ssr: false });

export default function Home() {
  return (
    <>
      <Head>
        <title>VERA: Nervous System Regulation Portal</title>
        <meta name="description" content="VERA is a living portal for nervous system regulation, supporting your journey with grounding, somatic mismatch, and sensory surprise tools." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet"/>
      </Head>
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          font-family: 'Poppins', Arial, sans-serif;
          background: #232046;
        }
      `}</style>

      {/* Animated living neural network background */}
      <NeuralBackground />

      <div style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start"
      }}>
        <header style={{padding: "70px 0 32px 0", textAlign: "center"}}>
          <h1 style={{
            color: "#13ffe5",
            fontWeight: 700,
            fontSize: "3em",
            letterSpacing: 2,
            textShadow: "0 2px 36px #13ffe5c0, 0 0px 20px #fff6"
          }}>VERA</h1>
          <p style={{
            color: "#fffce6",
            fontSize: "1.25em",
            maxWidth: 620,
            margin: "18px auto 0 auto",
            textShadow: "0 2px 22px #23204688",
            lineHeight: 1.45
          }}>
            Welcome to your living portal for nervous system regulation.<br/>
            VERA breathes, glows, and supports you on your journey to balance.<br/>
            Explore gentle tools, neuroscience, and self-discovery.
          </p>
        </header>

        <main style={{
          width: "100%",
          maxWidth: "560px",
          margin: "0 auto",
          padding: "0 16px",
        }}>
          {/* You can show previews, or make these collapsible/expandable if you wish */}
          <section style={{margin: "48px 0"}}>
            <h2 style={{color: "#ffd966", textAlign: "center", fontWeight: 700, fontSize: "1.4em"}}>Grounding Tools</h2>
            <div style={{margin: "24px 0"}}>
              <GroundingExercise />
            </div>
          </section>
          <section style={{margin: "48px 0"}}>
            <h2 style={{color: "#13ffe5", textAlign: "center", fontWeight: 700, fontSize: "1.4em"}}>Somatic Mismatch Patterns</h2>
            <div style={{margin: "24px 0"}}>
              <SomaticMismatchPattern />
            </div>
          </section>
          <section style={{margin: "48px 0"}}>
            <h2 style={{color: "#ffd966", textAlign: "center", fontWeight: 700, fontSize: "1.4em"}}>VERA Sensory Surprise</h2>
            <div style={{margin: "24px 0"}}>
              <VERASomaticMismatch />
            </div>
          </section>
        </main>

        <footer style={{margin: "48px 0 24px 0", color: "#fff9", fontSize: "1em", textAlign: "center"}}>
          &copy; {new Date().getFullYear()} VERA. Made with nervous system wisdom.
        </footer>
      </div>
    </>
  );
}

// Living neural network background component
function NeuralBackground() {
  // This will only run on the client (not SSR)
  // You can move this into src/components/NeuralBackground.tsx if you like
  React.useEffect(() => {
    // Basic animated neural network from earlier answer (vanilla JS in React)
    let canvas = document.getElementById("neurons-bg") as HTMLCanvasElement | null;
    if (!canvas) return;
    let ctx = canvas.getContext('2d');
    let w = window.innerWidth, h = window.innerHeight;
    canvas.width = w; canvas.height = h;

    function resizeCanvas() {
      w = window.innerWidth; h = window.innerHeight;
      canvas!.width = w; canvas!.height = h;
      setupNeurons();
    }
    window.addEventListener('resize', resizeCanvas);

    const NEURON_COUNT = Math.floor((w * h) / 9500) + 18;
    const LINK_DISTANCE = 180;
    const NEURON_RADIUS = [12, 28];
    const PULSE_SPEED = 0.65;

    function randomBetween(a:number,b:number){return a+Math.random()*(b-a);}
    function angle(){return Math.random()*2*Math.PI;}

    class Neuron {
      x:number; y:number; baseX:number; baseY:number; radius:number;
      phase:number; connections:number[]; color:string;
      floatAngle:number; floatSpeed:number; floatRadius:number; currentRadius:number=0;
      constructor() {
        this.x = randomBetween(0.15*w,0.85*w);
        this.y = randomBetween(0.17*h,0.83*h);
        this.baseX = this.x; this.baseY = this.y;
        this.radius = randomBetween(NEURON_RADIUS[0], NEURON_RADIUS[1]);
        this.phase = Math.random() * Math.PI * 2;
        this.connections = [];
        this.color = `rgba(19,255,229,${randomBetween(0.51,0.85)})`;
        this.floatAngle = angle();
        this.floatSpeed = randomBetween(0.18, 0.36);
        this.floatRadius = randomBetween(18, 42);
      }
      update(time:number) {
        const pulse = Math.sin(time * PULSE_SPEED + this.phase) * 0.23 + 1;
        this.x = this.baseX + Math.cos(time * this.floatSpeed + this.floatAngle) * this.floatRadius;
        this.y = this.baseY + Math.sin(time * this.floatSpeed + this.floatAngle) * this.floatRadius;
        this.currentRadius = this.radius * pulse;
      }
      draw(ctx:CanvasRenderingContext2D) {
        const grad = ctx.createRadialGradient(this.x, this.y, this.currentRadius*0.2, this.x, this.y, this.currentRadius);
        grad.addColorStop(0, "#fff6");
        grad.addColorStop(0.18, this.color);
        grad.addColorStop(0.85, "rgba(35,32,70,0.14)");
        ctx.save();
        ctx.globalAlpha = 0.91;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius, 0, 2 * Math.PI);
        ctx.fillStyle = grad;
        ctx.shadowColor = "#13ffe5bb";
        ctx.shadowBlur = this.currentRadius * 1.3;
        ctx.fill();
        ctx.restore();
      }
    }

    let neurons:Neuron[] = [];
    function setupNeurons() {
      neurons = [];
      for (let i = 0; i < NEURON_COUNT; i++) neurons.push(new Neuron());
      for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
          const dx = neurons[i].x - neurons[j].x, dy = neurons[i].y - neurons[j].y;
          if (Math.sqrt(dx*dx + dy*dy) < LINK_DISTANCE) {
            neurons[i].connections.push(j);
            neurons[j].connections.push(i);
          }
        }
      }
    }
    setupNeurons();

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, w, h);
      const t = performance.now() / 1100;
      for (let i = 0; i < neurons.length; i++) {
        const n = neurons[i];
        n.update(t);
        for (let c of n.connections) {
          if (c > i) {
            const n2 = neurons[c];
            const dist = Math.hypot(n.x - n2.x, n.y - n2.y);
            if (dist < LINK_DISTANCE) {
              const axonPulse = 0.3 + 0.7 * Math.abs(Math.sin(t * 0.8 + i * 0.9 + c));
              ctx.save();
              ctx.globalAlpha = 0.16 + 0.15 * axonPulse;
              ctx.beginPath();
              ctx.moveTo(n.x, n.y);
              const midX = (n.x + n2.x) / 2 + Math.sin(t + i + c) * 8;
              const midY = (n.y + n2.y) / 2 + Math.cos(t + i - c) * 10;
              ctx.quadraticCurveTo(midX, midY, n2.x, n2.y);
              ctx.strokeStyle = `rgba(19,255,229,${0.17 + 0.14 * axonPulse})`;
              ctx.lineWidth = 3 + 2 * axonPulse;
              ctx.shadowColor = "#13ffe5";
              ctx.shadowBlur = 10 + 10 * axonPulse;
              ctx.stroke();
              ctx.restore();
            }
          }
        }
      }
      for (let n of neurons) n.draw(ctx);
      requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      id="neurons-bg"
      style={{
        position: "fixed",
        top:0, left:0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.93,
        transition: "opacity 0.5s"
      }}
    />
  );
}
