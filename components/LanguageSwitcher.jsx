"use client";

import { useT } from "@/app/TranslationProvider";

const LANGS = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "nl", label: "NL" },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useT();

  return (
    <div className="lang-switcher" aria-label="Language selector">
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          className={
            "lang-switcher__btn" +
            (lang === l.code ? " lang-switcher__btn--active" : "")
          }
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
