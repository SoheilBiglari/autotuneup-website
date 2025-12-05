'use client';
import { useT } from "@/app/TranslationProvider";

export function Footer() {
  const { t } = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__cols">

        {/* Logo */}
        <div>
          <div className="logo">
            GT<span className="accent">U</span>
          </div>
          <p className="muted">{t("footer.tagline")}</p>
        </div>

        {/* Contact */}
        <div>
          <h4>{t("footer.contact_title")}</h4>
          <p className="muted">
            <a
              href="https://maps.app.goo.gl/1v9PwxFaQFqTnFhv7"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__link"
            >
              {t("contact.address")}
            </a>
            <br />
            <a href="tel:+32487659570" className="footer__link">
              +32 487 65 95 70
            </a>
            <br />
            <a href="mailto:garageautotuneup@gmail.com" className="footer__link">
              garageautotuneup@gmail.com
            </a>
          </p>
        </div>

        {/* Hours */}
        <div>
          <h4>{t("footer.hours_title")}</h4>
          <p className="muted" style={{ whiteSpace: "pre-line" }}>
            {t("contact.hours")}
          </p>
        </div>

        {/* Socials */}
        <div>
          <h4>{t("footer.follow")}</h4>
          <div className="footer__socials">
            <a
              href="https://www.facebook.com/profile.php?id=61556217011318"
              aria-label="Facebook Auto Tune-Up"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-facebook"></i>
            </a>

            <a
              href="https://wa.me/32487659570"
              aria-label="WhatsApp Auto Tune-Up"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-whatsapp"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        © {year} {t("footer.rights")}
      </div>
    </footer>
  );
}
