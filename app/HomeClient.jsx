'use client';

import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Reviews from "../components/Reviews";
import { Footer } from "../components/Footer";
import Contact from "../components/Contact";
import ServicesGrid from "../components/ServicesGrid";

export default function HomeClient() {

  useEffect(() => {
    const handleSmoothScroll = (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: "smooth",
      });
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) =>
      link.addEventListener("click", handleSmoothScroll)
    );

    return () => {
      links.forEach((link) =>
        link.removeEventListener("click", handleSmoothScroll)
      );
    };
  }, []);

  return (
    <>
      <Navbar />
      <Hero />

      <section id="services" className="section section--services">
        <ServicesGrid />
      </section>

      <section id="about" className="section">
        <About />
      </section>

      <section id="reviews" className="section">
        <Reviews />
      </section>

      <section id="contact" className="section">
        <Contact />
      </section>

      <Footer />
    </>
  );
}
