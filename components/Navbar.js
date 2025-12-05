"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useT } from "@/app/TranslationProvider";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { t } = useT();

  const LINKS = [
    { href: "#hero", label: t("nav.home") },
    { href: "#services", label: t("nav.services") },
    { href: "#about", label: t("nav.about") },
    { href: "#reviews", label: t("nav.reviews") },
    { href: "#contact", label: t("nav.contact") },
  ];

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#hero");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const smoothScroll = useCallback((e, href) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - 84;
    window.scrollTo({ top: y, behavior: "smooth" });
    setOpen(false);
  }, []);

  useEffect(() => {
    const handler = () => {
      const sections = ["#hero", "#services", "#about", "#reviews", "#contact"];
      let cur = "#hero";
      const offset = 120;

      sections.forEach((id) => {
        const el = document.querySelector(id);
        if (!el) return;
        if (window.scrollY + offset >= el.offsetTop) cur = id;
      });

      setActive(cur);
    };

    window.addEventListener("scroll", handler);
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="container nav__inner">

        {/* Logo */}
        <a
          className="nav__brand"
          href="#hero"
          onClick={(e) => smoothScroll(e, "#hero")}
        >
          <span style={{ color: "#fff" }}>G</span>
          <span style={{ color: "var(--brand-orange)" }}>TU</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="nav__links">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => smoothScroll(e, l.href)}
              className={active === l.href ? "is-active" : ""}
            >
              {l.label}
            </a>
          ))}

          {/* 🔥 زبان‌ها */}
          <LanguageSwitcher />

          <Link href="/reservation" className="btn btn--primary nav__cta">
            {t("nav.reserve")}
          </Link>
        </nav>

        {/* Hamburger */}
        <button className="nav__hamb" onClick={() => setOpen(true)}>
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`drawer ${open ? "drawer--open" : ""}`} onClick={() => setOpen(false)}>
        <aside className="drawer__panel" onClick={(e) => e.stopPropagation()}>
          
          <div className="drawer__header">
            <strong>GTU</strong>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <nav className="drawer__nav">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => smoothScroll(e, l.href)}
                className={active === l.href ? "is-active" : ""}
              >
                {l.label}
              </a>
            ))}

            <Link href="/reservation" className="btn btn--primary" onClick={() => setOpen(false)}>
              {t("nav.reserve")}
            </Link>

            {/* 🔥 سوییچر موبایل */}
            <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
              <LanguageSwitcher />
            </div>
          </nav>
        </aside>
      </div>
    </header>
  );
}
