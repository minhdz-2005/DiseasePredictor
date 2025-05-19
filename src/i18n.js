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

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // ngôn ngữ mặc định
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React đã xử lý XSS rồi
    },
  });

export default i18n;
