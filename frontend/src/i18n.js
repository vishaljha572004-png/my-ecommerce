import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';



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
      escapeValue: false 
    }
  });

export default i18n;
