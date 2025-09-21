// Simple accessible footer.
import React from "react";

export default function VERAFooter() {
  return (
    <footer
      style={{
        textAlign: "center",
        background:
          "linear-gradient(90deg, var(--vera-neural-blue), #0A0E27 90%)",
        color: "var(--text-muted)",
        fontSize: 15,
        padding: "2.3em 0 1.1em",
        marginTop: 40
      }}
    >
      <div>
        <a
          href="#privacy"
          style={{ color: "var(--vera-lavender)", textDecoration: "none" }}
        >
          Privacy
        </a>{" "}
        |{" "}
        <a
          href="#feedback"
          style={{ color: "var(--vera-neural-blue)", textDecoration: "none" }}
        >
          Feedback
        </a>
      </div>
      <div style={{ marginTop: 8 }}>
        © {new Date().getFullYear()} VERA Technologies &bull; Where souls remember safety
      </div>
    </footer>
  );
}
