import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en.json";
import translationVI from "./locales/vi.json";
import translationJA from "./locales/ja.json";

// Cấu hình ngôn ngữ
const resources = {
  en: { translation: translationEN },
  vi: { translation: translationVI },
  ja: { translation: translationJA },
};
const savedLang = localStorage.getItem("lang") || "en";

i18n
  .use(initReactI18next)
  .init({
    lng: savedLang, 
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React đã xử lý XSS rồi
    },
  });

export default i18n;
