"use client";

import { useState } from "react";
import { useT } from "@/app/TranslationProvider";

/* ------------------ SEO METADATA ------------------ */
export const metadata = {
  title: "Contact & Adresse | Garage Auto Tune-Up Kraainem",
  description:
    "Contactez le Garage Auto Tune-Up à Kraainem : adresse, téléphone, horaires et formulaire de contact.",
  alternates: { canonical: "/contact" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Contact – Garage Auto Tune-Up Kraainem",
    description:
      "Adresse, téléphone, horaires et formulaire pour contacter le Garage Auto Tune-Up.",
    url: "https://autotuneup.be/contact",
    type: "website",
  },
};

/* ------------------ JSON-LD ------------------ */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: "Garage Auto Tune-Up Kraainem",
  image: "https://autotuneup.be/images/hero/hero-1200.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Tramlaan 7",
    addressLocality: "Kraainem",
    postalCode: "1950",
    addressCountry: "BE",
  },
  telephone: "+32487659570",
  url: "https://autotuneup.be/contact",
  sameAs: [
    "https://www.facebook.com/profile.php?id=61556217011318",
    "https://wa.me/32487659570",
  ],
};

export default function ContactPage() {
  const { t } = useT();

  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    honey: "",
  });

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    if (form.honey.length > 0) return;

    if (!form.name || !form.email || !form.message) {
      alert(t("contact.error_required"));
      return;
    }

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert(t("contact.error_server"));
      return;
    }

    setSent(true);
  };

  return (
    <div className="contact-wrapper">

      {/* JSON-LD SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1 className="contact-title">{t("contact.title")}</h1>
      <p className="contact-subtitle">{t("contact.subtitle")}</p>

      <div className="contact-layout">

        {/* LEFT PANEL */}
        <div className="contact-card contact-card--info">
          <h2>{t("contact.garage_title")}</h2>

          <div className="contact-info-list">

            <div className="contact-info-item">
              <div className="contact-icon">
                <i className="fa-solid fa-location-dot" />
              </div>
              <strong>{t("contact.address")}</strong>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">
                <i className="fa-solid fa-phone" />
              </div>
              <strong>
                <a href="tel:+32487659570">+32 487 65 95 70</a>
              </strong>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">
                <i className="fa-brands fa-whatsapp" />
              </div>
              <strong>
                <a href="https://wa.me/32487659570" target="_blank">
                  {t("contact.whatsapp")}
                </a>
              </strong>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">
                <i className="fa-solid fa-envelope" />
              </div>
              <strong>
                <a href="mailto:garageautotuneup@gmail.com">
                  garageautotuneup@gmail.com
                </a>
              </strong>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">
                <i className="fa-solid fa-clock" />
              </div>
              <strong style={{ whiteSpace: "pre-line" }}>
                {t("contact.hours")}
              </strong>
            </div>
          </div>

          <p className="contact-note">{t("contact.parking")}</p>
        </div>

        {/* RIGHT PANEL — FORM */}
        <div className="contact-card contact-card--form">
          <h2>{t("contact.form_title")}</h2>

          <form onSubmit={submit} className="contact-form-grid">

            <input
              type="text"
              name="honey"
              style={{ display: "none" }}
              onChange={update}
            />

            <label>
              {t("contact.form_name")}
              <input
                name="name"
                required
                value={form.name}
                onChange={update}
                placeholder={t("contact.placeholder_name")}
              />
            </label>

            <label>
              {t("contact.form_email")}
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={update}
                placeholder={t("contact.placeholder_email")}
              />
            </label>

            <label>
              {t("contact.form_phone")}
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={update}
                placeholder={t("contact.placeholder_phone")}
              />
            </label>

            <label className="full-row">
              {t("contact.form_message")}
              <textarea
                required
                name="message"
                value={form.message}
                onChange={update}
                placeholder={t("contact.placeholder_msg")}
              />
            </label>

            <button type="submit">
              {t("contact.form_send")}
            </button>

            {sent && (
              <p className="contact-sent">{t("contact.form_success")}</p>
            )}
          </form>
        </div>
      </div>

      {/* MAP */}
      <div className="contact-map-wrapper">
        <iframe
          title="Google Maps – Garage Auto Tune-Up"
          src="https://www.google.com/maps?q=Tramlaan%207%201950%20Kraainem&output=embed"
          width="100%"
          height="360"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
        />
      </div>
    </div>
  );
}
