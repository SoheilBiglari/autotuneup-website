"use client";

import { createContext, useContext, useState } from "react";
import fr from "./i18n/fr.json";
import en from "./i18n/en.json";
import nl from "./i18n/nl.json";

const LangContext = createContext();

export function TranslationProvider({ children }) {
  const [lang, setLang] = useState("fr");

  const dictionaries = { fr, en, nl };
  const t = (key) => dictionaries[lang][key] || key;

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useT() {
  return useContext(LangContext);
}
