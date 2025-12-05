"use client";

import { useEffect, useState } from "react";
import { useT } from "@/app/TranslationProvider";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const { t } = useT();

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      setReviews(data.reviews || []);
    }
    load();
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll(".review-card");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("reveal--in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });

    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [reviews]);

  const Stars = ({ n }) => (
    <div className="stars-row" style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          fill={i <= n ? "var(--brand-orange)" : "#444"}
        >
          <path d="M12 17.3L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 
            8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );

  if (!reviews.length) return null;

  return (
    <section className="reviews-section">
      
      {/* 🔥 عنوان چندزبانه */}
      <h2 style={{ textAlign: "center", marginBottom: 40, color: "#fff" }}>
        {t("reviews_title")}
      </h2>

      {/* TOP ROW */}
      <div className="reviews-grid-top">
        {reviews.slice(0, 3).map((r, i) => (
          <div className="review-card" key={i}>
            <div className="review-header">
              <img src={r.profile_photo} alt={r.author} />
              <span className="review-author">{r.author}</span>
            </div>

            <Stars n={r.rating} />
            <p className="review-text">“{r.text}”</p>
            <p className="review-time">{r.relative_time}</p>
          </div>
        ))}
      </div>

      {/* BOTTOM ROW */}
      <div className="reviews-grid-bottom">
        {reviews.slice(3, 5).map((r, i) => (
          <div className="review-card" key={i}>
            <div className="review-header">
              <img src={r.profile_photo} alt={r.author} />
              <span className="review-author">{r.author}</span>
            </div>

            <Stars n={r.rating} />
            <p className="review-text">“{r.text}”</p>
            <p className="review-time">{r.relative_time}</p>
          </div>
        ))}
      </div>

    </section>
  );
}
