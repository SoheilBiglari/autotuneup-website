"use client";

import { useEffect } from "react";
import { useT } from "@/app/TranslationProvider";

export default function ServicesGrid() {
  const { t } = useT();

  const services = [
    { title: t("services.diagnostic"), key: "diagnostic" },
    { title: t("services.oil"), key: "oil-change" },
    { title: t("services.filters"), key: "filter" },
    { title: t("services.brake"), key: "brake" },
    { title: t("services.checkup"), key: "full-checkup" },
    { title: t("services.chain"), key: "distribution-chain" },
  ];

  /* Reveal animation */
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal--in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.2 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* SERVICES SECTION */}
      <section id="services" className="services-wrapper">
        <h2 className="services-title">
          {t("services.title")}
        </h2>

        <div className="grid grid--3">
          {services.map((s) => (
            <div key={s.key} className="card reveal">
              <picture>
                <source
                  type="image/webp"
                  srcSet={`
                    /images/services/${s.key}-800.webp 800w,
                    /images/services/${s.key}-1200.webp 1200w,
                    /images/services/${s.key}-1600.webp 1600w
                  `}
                  sizes="(max-width: 640px) 100vw,
                         (max-width: 1024px) 50vw,
                         33vw"
                />
                <source
                  type="image/jpeg"
                  srcSet={`
                    /images/services/${s.key}-800.jpg 800w,
                    /images/services/${s.key}-1200.jpg 1200w,
                    /images/services/${s.key}-1600.jpg 1600w
                  `}
                  sizes="(max-width: 640px) 100vw,
                         (max-width: 1024px) 50vw,
                         33vw"
                />
                <img
                  src={`/images/services/${s.key}-1200.jpg`}
                  alt={t("services.img_alt", { title: s.title })}
                  className="card__img"
                  loading="lazy"
                />
              </picture>

              <div className="card__body">
                <h3 className="service-title">{s.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
