import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import commonKo from './locales/ko/common.json';
import navigationKo from './locales/ko/navigation.json';
import screensKo from './locales/ko/screens.json';
import componentsKo from './locales/ko/components.json';
import validationKo from './locales/ko/validation.json';
import shareKo from './locales/ko/share.json';

import commonEn from './locales/en/common.json';
import navigationEn from './locales/en/navigation.json';
import screensEn from './locales/en/screens.json';
import componentsEn from './locales/en/components.json';
import validationEn from './locales/en/validation.json';
import shareEn from './locales/en/share.json';

const resources = {
  ko: {
    common: commonKo,
    navigation: navigationKo,
    screens: screensKo,
    components: componentsKo,
    validation: validationKo,
    share: shareKo,
  },
  en: {
    common: commonEn,
    navigation: navigationEn,
    screens: screensEn,
    components: componentsEn,
    validation: validationEn,
    share: shareEn,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // 초기 언어 (settingsStore에서 감지한 언어로 곧 변경됨)
  fallbackLng: 'en', // 한국어가 아니면 영어로 fallback
  defaultNS: 'common',
  ns: ['common', 'navigation', 'screens', 'components', 'validation', 'share'],
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
  returnNull: false,
});

export default i18n;
