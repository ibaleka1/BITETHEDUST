import Head from "next/head";
import GroundingExercise from "../src/components/GroundingExercise";
import SomaticMismatchPattern from "../src/components/SomaticMismatchPattern";
import VERASomaticMismatch from "../src/components/VERASomaticMismatch";

export default function Home() {
  return (
    <>
      <Head>
        <title>VERA: Nervous System Regulation Portal</title>
        <meta name="description" content="Grounding, somatic mismatch, and sensory surprise tools for nervous system regulation." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{
        background: "linear-gradient(135deg, #232046 0%, #27215a 100%)",
        minHeight: "100vh",
        padding: "0",
        margin: "0",
        fontFamily: "'Poppins', Arial, sans-serif"
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 16px", textAlign: "center" }}>
          <h1 style={{
            color: "#13ffe5",
            fontWeight: 700,
            fontSize: "2.5em",
            letterSpacing: 2,
            marginTop: 40,
            marginBottom: 0
          }}>VERA</h1>
          <div style={{
            color: "#fff9",
            fontSize: "1.2em",
            marginBottom: 36,
            marginTop: 12,
            maxWidth: 700,
            textAlign: "center"
          }}>
            Nervous System Regulation Portal: Explore grounding, somatic mismatch, and sensory surprise with VERA's neuroscience-based tools.
          </div>
        </div>
        <div style={{ maxWidth: 540, margin: "0 auto", padding: "0 16px" }}>
          <GroundingExercise />
          <SomaticMismatchPattern />
          <VERASomaticMismatch />
        </div>
      </main>
    </>
  );
}
