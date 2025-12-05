// ============================
// 📌 SEO Metadata — FINAL OPTIMIZED VERSION
// ============================
export const metadata = {
  metadataBase: new URL("https://autotuneup.be"),

  title: "Garage Auto Tune-Up – Kraainem | Entretien & Réparation",
  description:
    "Garage Auto Tune-Up situé à Kraainem. Entretien, vidange, diagnostic, freins, climatisation, distribution et réparations complètes. Réservation en ligne disponible.",

  alternates: {
    canonical: "https://autotuneup.be",
  },

  openGraph: {
    title: "Garage Auto Tune-Up – Kraainem | Entretien & Réparation",
    description:
      "Service automobile complet à Kraainem : entretien, vidange, diagnostic, climatisation, freins, réparations.",
    url: "https://autotuneup.be",
    type: "website",
    locale: "fr_BE",
    siteName: "Garage Auto Tune-Up Kraainem",
    images: [
      {
        url: "https://autotuneup.be/images/hero/hero-1200.jpg",
        width: 1200,
        height: 800,
        alt: "Garage Auto Tune-Up Kraainem",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Garage Auto Tune-Up – Kraainem",
    description:
      "Diagnostic, réparation et entretien automobile à Kraainem. Réservation rapide en ligne.",
    images: ["https://autotuneup.be/images/hero/hero-1200.jpg"],
  },
};

// ============================
// 📌 Client Component render
// ============================
import HomeClient from "./HomeClient";

export default function Page() {
  return <HomeClient />;
}
