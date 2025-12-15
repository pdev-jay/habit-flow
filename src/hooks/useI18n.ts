import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

import { useSettingsStore } from '@/features/habits/api';

/**
 * Custom hook for i18n
 * Syncs language with settings store
 */
export function useI18n() {
  const { t, i18n } = useTranslation();
  const { settings } = useSettingsStore();

  // Sync i18n language with settings store
  useEffect(() => {
    if (i18n.language !== settings.language) {
      i18n.changeLanguage(settings.language);
    }
  }, [settings.language, i18n]);

  return { t, i18n, language: settings.language };
}
