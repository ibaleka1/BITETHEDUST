export default function TestBanner() {
  return (
    <div className="test-banner" style={{
      background: "linear-gradient(90deg, #FFD700, #FFA500)",
      color: "#000",
      textAlign: "center",
      padding: "12px",
      position: "fixed",
      top: 0,
      width: "100%",
      zIndex: 10000,
      fontWeight: 600,
      boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
    }}>
      ⚠️ TEST MODE - Use Stripe test card: 4242 4242 4242 4242 • Any future date • Any CVC
    </div>
  );
}
