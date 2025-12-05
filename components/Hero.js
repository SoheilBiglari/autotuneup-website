"use client";

import Image from "next/image";
import { useT } from "@/app/TranslationProvider";

export default function Hero() {
  const { t } = useT();

  return (
    <section
      id="hero"
      className="hero"
      aria-label={t("hero.aria")}
    >
      {/* Background */}
      <div className="hero__bg-wrapper">
        <Image
          src="/images/hero/hero-2000.jpg"
          alt={t("hero.img_alt")}
          fill
          priority
          quality={100}
          sizes="100vw"
          className="hero__bg"
        />
      </div>

      {/* ❌ REMOVE THIS — overlay breaks layout */}
      {/* <div className="hero__overlay" /> */}

      {/* Content */}
      <div className="hero__content">
        <div className="container">
          <h1>{t("hero.title")}</h1>

          <p className="hero__tagline">{t("hero.tagline")}</p>

          <p className="muted hero__subtitle">
            {t("hero.subtitle")}
          </p>

          <div className="hero__cta">
            <a className="btn btn--primary" href={`/reservation?lang=${lang}`}>
              {t("hero.btn_book")}
            </a>
            <a className="btn btn--outline" href="#services">
              {t("hero.btn_services")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
