"use client";

export default function CookieBanner({ openPreferences, acceptAll, rejectAll }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "25px",
        right: "25px",
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(10px)",
        padding: "22px",
        borderRadius: "16px",
        width: "340px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        zIndex: 99999,
        animation: "fadeIn 0.5s ease-out, slideUp 0.5s ease-out",
      }}
    >
      <h3
        style={{
          fontSize: "18px",
          marginBottom: "8px",
          fontWeight: "600",
        }}
      >
        Cookies & Confidentialité
      </h3>

      <p
        style={{
          fontSize: "14px",
          opacity: 0.85,
          lineHeight: "1.5",
          marginBottom: "16px",
        }}
      >
        Nous utilisons des cookies pour améliorer votre expérience et analyser
        le trafic du site.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button
          onClick={acceptAll}
          style={{
            background: "#0070F3",
            color: "white",
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          Tout accepter
        </button>

        <button
          onClick={openPreferences}
          style={{
            background: "#f1f1f1",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Personnaliser
        </button>

        <button
          onClick={rejectAll}
          style={{
            background: "white",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            cursor: "pointer",
            fontSize: "14px",
            color: "#444",
          }}
        >
          Tout refuser
        </button>
      </div>
    </div>
  );
}
