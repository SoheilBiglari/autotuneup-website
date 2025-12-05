import "../styles/globals.css";
import { Exo_2, Poppins } from "next/font/google";
import CookieManager from "@/components/cookies/CookieManager";
import { TranslationProvider } from "@/app/TranslationProvider";

/* ============================
   📌 Global Metadata (SEO)
=============================== */
export const metadata = {
  metadataBase: new URL("https://autotuneup.be"),
  title: {
    default: "Garage Auto TUNEUP – Kraainem",
    template: "%s | Garage Auto TUNEUP Kraainem",
  },
  description:
    "Entretien, diagnostic, réparation automobile et réservation en ligne à Kraainem. Service rapide, professionnel et fiable.",
  robots: { index: true, follow: true },

  openGraph: {
    title: "Garage Auto TUNEUP – Kraainem",
    description:
      "Garage auto professionnel à Kraainem: entretien, diagnostic, réparation et réservation en ligne.",
    url: "https://autotuneup.be",
    siteName: "Garage Auto TUNEUP Kraainem",
    locale: "fr_BE",
    type: "website",
    images: [
      {
        url: "/images/hero/hero-1200.jpg",
        width: 1200,
        height: 800,
        alt: "Garage Auto TUNEUP Kraainem",
      },
    ],
  },

  alternates: {
    canonical: "https://autotuneup.be",
  },
};

/* ============================
   📌 Fonts
=============================== */
const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-exo2",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-poppins",
});

/* ============================
   📌 Root Layout
=============================== */
export default function RootLayout({ children }) {
  /* JSON-LD — Service catalog */
  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Services automobile – Garage Auto TUNEUP",
    provider: {
      "@type": "AutoRepair",
      name: "Garage Auto TUNEUP Kraainem",
      telephone: "+32487659570",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Tramlaan 7",
        addressLocality: "Kraainem",
        postalCode: "1950",
        addressCountry: "BE",
      },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Catalogue des services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Diagnostic complet" }},
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Vidange d’huile" }},
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Remplacement de filtres" }},
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Freins & Disques" }},
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Contrôle général" }},
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Chaîne de distribution" }},
      ],
    },
  };

  return (
    <html lang="fr" className={`${exo2.variable} ${poppins.variable}`}>
      <head>
        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />

        {/* JSON-LD — LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoRepair",
              name: "Garage Auto TUNEUP Kraainem",
              image: "https://autotuneup.be/images/hero/hero-1200.jpg",
              url: "https://autotuneup.be",
              telephone: "+32487659570",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Tramlaan 7",
                addressLocality: "Kraainem",
                postalCode: "1950",
                addressCountry: "BE",
              },
              openingHoursSpecification: [
                { dayOfWeek: "Monday", opens: "08:00", closes: "19:00" },
                { dayOfWeek: "Tuesday", opens: "08:00", closes: "19:00" },
                { dayOfWeek: "Wednesday", opens: "08:00", closes: "19:00" },
                { dayOfWeek: "Thursday", opens: "08:00", closes: "19:00" },
                { dayOfWeek: "Friday", opens: "09:00", closes: "19:00" },
                { dayOfWeek: "Saturday", opens: "09:00", closes: "12:00" },
              ],
              sameAs: [
                "https://www.facebook.com/profile.php?id=61556217011318",
              ],
            }),
          }}
        />

        {/* JSON-LD — FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Puis-je réserver en ligne au Garage Auto TUNEUP ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Oui, vous pouvez réserver votre entretien, diagnostic ou réparation directement en ligne via la page Réservation.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Quels sont les horaires d’ouverture du garage ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Ouvert du lundi au jeudi de 08:00 à 19:00, vendredi de 09:00 à 19:00 et samedi de 09:00 à 12:00.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Où se situe le Garage Auto TUNEUP ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Le garage se trouve à Tramlaan 7, 1950 Kraainem.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Quels services proposez-vous ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Vidange, diagnostic, entretien, freins, climatisation, chaîne de distribution et réparations complètes.",
                  },
                },
              ],
            }),
          }}
        />

        {/* JSON-LD — Service Catalog */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(servicesJsonLd),
          }}
        />
      </head>

      <body>
        <TranslationProvider>
          {children}
        </TranslationProvider>
        <CookieManager />
      </body>
    </html>
  );
}
