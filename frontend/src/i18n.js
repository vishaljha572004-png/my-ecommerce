import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// We can import translations directly for simplicity, or use i18next-http-backend
// Here we import them statically to avoid extra network requests
import translationEN from '../public/locales/en/translation.json';
import translationHI from '../public/locales/hi/translation.json';

const resources = {
  en: {
    translation: translationEN
  },
  hi: {
    translation: translationHI
  }
};

const savedLanguage = localStorage.getItem('appLanguage') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes by default
    }
  });

export default i18n;
