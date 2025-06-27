import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Impor file terjemahan
import translationEN from './locales/en/translation.json';
import translationID from './locales/id/translation.json';

const resources = {
  en: {
    translation: translationEN
  },
  id: {
    translation: translationID
  }
};

i18n
  .use(initReactI18next) // Mengintegrasikan i18next dengan React
  .init({
    resources,
    lng: 'en', // Bahasa default
    fallbackLng: 'en', // Bahasa fallback jika terjemahan tidak ditemukan

    interpolation: {
      escapeValue: false // Tidak perlu untuk React karena sudah aman dari XSS
    }
  });

export default i18n;