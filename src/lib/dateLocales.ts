import { ko, enUS } from 'date-fns/locale';
import type { Locale } from 'date-fns';
import type { LanguageType } from '@/features/habits/types';

export const dateLocales: Record<LanguageType, Locale> = {
  ko: ko,
  en: enUS,
};

export function getDateLocale(language: LanguageType): Locale {
  return dateLocales[language] || ko;
}

// Date format patterns by language
export const dateFormats = {
  ko: {
    monthDay: 'M월 d일',
    yearMonth: 'yyyy년 M월',
    weekRange: 'M월 d일',
  },
  en: {
    monthDay: 'MMM d',
    yearMonth: 'MMM yyyy',
    weekRange: 'MMM d',
  },
};

export function getDateFormat(
  language: LanguageType,
  formatType: keyof typeof dateFormats.ko
): string {
  return dateFormats[language][formatType] || dateFormats.ko[formatType];
}
