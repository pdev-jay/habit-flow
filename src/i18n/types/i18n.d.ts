import 'react-i18next';
import type commonKo from '../locales/ko/common.json';
import type navigationKo from '../locales/ko/navigation.json';
import type screensKo from '../locales/ko/screens.json';
import type componentsKo from '../locales/ko/components.json';
import type validationKo from '../locales/ko/validation.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof commonKo;
      navigation: typeof navigationKo;
      screens: typeof screensKo;
      components: typeof componentsKo;
      validation: typeof validationKo;
    };
  }
}
