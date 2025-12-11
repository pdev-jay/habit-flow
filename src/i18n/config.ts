import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import commonKo from './locales/ko/common.json';
import navigationKo from './locales/ko/navigation.json';
import screensKo from './locales/ko/screens.json';
import componentsKo from './locales/ko/components.json';
import validationKo from './locales/ko/validation.json';

import commonEn from './locales/en/common.json';
import navigationEn from './locales/en/navigation.json';
import screensEn from './locales/en/screens.json';
import componentsEn from './locales/en/components.json';
import validationEn from './locales/en/validation.json';

const resources = {
  ko: {
    common: commonKo,
    navigation: navigationKo,
    screens: screensKo,
    components: componentsKo,
    validation: validationKo,
  },
  en: {
    common: commonEn,
    navigation: navigationEn,
    screens: screensEn,
    components: componentsEn,
    validation: validationEn,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ko',
  fallbackLng: 'ko',
  defaultNS: 'common',
  ns: ['common', 'navigation', 'screens', 'components', 'validation'],
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
  returnNull: false,
});

export default i18n;
