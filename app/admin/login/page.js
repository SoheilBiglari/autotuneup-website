"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Mot de passe incorrect.");
        return;
      }

      router.push("/admin");
    } catch (err) {
      console.error(err);
      setError("Erreur côté client. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <span>G</span>
          <span>TU</span>
        </div>

        <h1 className="admin-login-title">Accès administrateur</h1>
        <p className="admin-login-subtitle">
          Zone réservée au garage pour consulter les réservations.
        </p>

        <form onSubmit={handleLogin} className="admin-login-form">
          <label>
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe admin"
            />
          </label>

          {error && <p className="admin-login-error">{error}</p>}

          <button
            type="submit"
            className="btn btn--primary admin-login-btn"
            disabled={loading || !password}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="admin-login-back">
          <a href="/">⬅ Retour au site</a>
        </p>
      </div>
    </div>
  );
}
