export const metadata = {
  title: "Réserver un service | Garage Auto Tune-Up Kraainem",
  description:
    "Réservez un entretien, une vidange, un diagnostic ou une réparation automobile directement en ligne au Garage Auto Tune-Up à Kraainem.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://autotuneup.be/reservation",
  },
  openGraph: {
    title: "Réservation en ligne | Garage Auto Tune-Up Kraainem",
    description:
      "Choisissez une date, une heure et un service pour votre entretien automobile à Kraainem.",
    url: "https://autotuneup.be/reservation",
    type: "website",
    images: [
      {
        url: "/images/hero/hero-1200.jpg",
        width: 1200,
        height: 800,
        alt: "Réservation Garage Auto Tune-Up",
      },
    ],
  },
};

export default function ReservationLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: "Garage Auto Tune-Up Kraainem",
    url: "https://autotuneup.be/reservation",
    image: "https://autotuneup.be/images/hero/hero-1200.jpg",
    telephone: "+32487659570",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Tramlaan 7",
      addressLocality: "Kraainem",
      postalCode: "1950",
      addressCountry: "BE",
    },
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://autotuneup.be/reservation",
      },
      result: {
        "@type": "Reservation",
        name: "Réservation Atelier Automobile",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      {children}
    </>
  );
}
