"use client";

import { useEffect, useRef } from "react";
import { useT } from "@/app/TranslationProvider";

export default function About() {
  const ref = useRef(null);
  const { t } = useT();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add("reveal--in");
        io.disconnect();
      }
    }, { threshold: 0.2 });

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} className="section reveal">
      <div className="container about__wrap">
        
        {/* TEXT */}
        <div className="about__text">
          
          <h2>{t("about.title")}</h2>

          <p className="muted">
            {t("about.text")}
          </p>

          <h3 style={{ marginTop: 10 }}>
            {t("about.why")}
          </h3>

          <ul className="about__bullets">
            <li>✔️ {t("about.b1")}</li>
            <li>✔️ {t("about.b2")}</li>
            <li>✔️ {t("about.b3")}</li>
          </ul>

          <div className="about__cta">
            <a href="/reservation" className="btn btn--primary">
              {t("about.btn_book")}
            </a>

            <a href="#services" className="btn btn--outline">
              {t("about.btn_services")}
            </a>
          </div>
        </div>

        {/* IMAGE */}
        <div className="about__card">
          <picture>
            <source
              type="image/webp"
              srcSet="
                /images/garage/garage-800.webp 800w,
                /images/garage/garage-1200.webp 1200w,
                /images/garage/garage-1600.webp 1600w
              "
              sizes="(min-width: 900px) 40vw, 100vw"
            />

            <img
              src="/images/garage/garage-1200.jpg"
              alt={t("about.img_alt")}
              className="about__img"
              loading="lazy"
            />
          </picture>

          <div className="about__badge">
            {t("about.badge")}
          </div>
        </div>

      </div>
    </section>
  );
}
