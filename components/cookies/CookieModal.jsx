"use client";

import { useState } from "react";

export default function CookieModal({ close, save }) {
  const [prefs, setPrefs] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });

  function toggle(key) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(3px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999999,
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px 28px",
          borderRadius: "18px",
          width: "90%",
          maxWidth: "520px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
          animation: "slideUp 0.4s ease",
        }}
      >
        <h2 style={{ marginBottom: "5px", fontSize: "22px" }}>
          Paramètres des cookies
        </h2>
        <p style={{ fontSize: "14px", opacity: 0.75 }}>
          Contrôlez vos préférences pour les cookies utilisés sur ce site.
        </p>

        <div style={{ marginTop: "25px" }}>
          <CookieToggle
            label="Essentiels"
            description="Nécessaires au fonctionnement du site."
            checked={true}
            disabled
          />

          <CookieToggle
            label="Analytics"
            description="Mesure l’audience et les performances du site."
            checked={prefs.analytics}
            onChange={() => toggle("analytics")}
          />

          <CookieToggle
            label="Marketing"
            description="Personnalisation et ciblage marketing."
            checked={prefs.marketing}
            onChange={() => toggle("marketing")}
          />
        </div>

        <div
          style={{
            marginTop: "25px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button
            onClick={close}
            style={{
              padding: "10px 16px",
              background: "#eee",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Annuler
          </button>

          <button
            onClick={() => {
              save(prefs);
              close();
            }}
            style={{
              padding: "10px 20px",
              background: "#0070F3",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

function CookieToggle({ label, description, checked, onChange, disabled }) {
  return (
    <div
      style={{
        padding: "12px 0",
        borderBottom: "1px solid #eee",
      }}
    >
      <label style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <strong>{label}</strong>
          <p style={{ fontSize: "13px", opacity: 0.7 }}>{description}</p>
        </div>

        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          style={{ width: "20px", height: "20px" }}
        />
      </label>
    </div>
  );
}
