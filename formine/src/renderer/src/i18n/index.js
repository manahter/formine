import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './en.json';
import tr from './tr.json';

i18n
  .use(LanguageDetector) // Tarayıcı dil algılaması
  .use(initReactI18next) // React için i18next entegrasyonu
  .init({
    resources: {
      en: { translation: en },
      tr: { translation: tr },
    },
    lng: "tr", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    fallbackLng: 'en', // Dil bulunmazsa varsayılan dil
    interpolation: {
      escapeValue: false, // React zaten XSS korumalı
    },
    react: {
      useSuspense: false, // Suspense'ı devre dışı bırakır (isteğe bağlı)
    },
  });

export default i18n;
