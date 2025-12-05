"use client";

import { useEffect, useState } from "react";
import CookieBanner from "./CookieBanner";
import CookieModal from "./CookieModal";

export default function CookieManager() {
  const [prefs, setPrefs] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cookie-preferences");
    if (!saved) return;

    const parsed = JSON.parse(saved);
    setPrefs(parsed);
    applyPreferences(parsed);
  }, []);

  function applyPreferences(p) {
    if (p.analytics) loadGA();
    // if (p.marketing) loadMarketingPixels();
  }

  function loadGA() {
    if (window.gaLoaded) return;
    window.gaLoaded = true;

    const s1 = document.createElement("script");
    s1.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX";
    s1.async = true;
    document.head.appendChild(s1);

    const s2 = document.createElement("script");
    s2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag("js", new Date());
      gtag("config", "G-XXXXXXX");
    `;
    document.head.appendChild(s2);
  }

  function savePreferences(p) {
    localStorage.setItem("cookie-preferences", JSON.stringify(p));
    setPrefs(p);
    applyPreferences(p);
  }

  // Show banner only first time
  const showBanner = prefs === null;

  return (
    <>
      {showBanner && (
        <CookieBanner
          openPreferences={() => setShowModal(true)}
          acceptAll={() =>
            savePreferences({ essential: true, analytics: true, marketing: true })
          }
          rejectAll={() =>
            savePreferences({ essential: true, analytics: false, marketing: false })
          }
        />
      )}

      {showModal && (
        <CookieModal close={() => setShowModal(false)} save={savePreferences} />
      )}
    </>
  );
}
