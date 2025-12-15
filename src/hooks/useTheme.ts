import { useColorScheme as useSystemColorScheme } from 'react-native';

import { useSettingsStore } from '@/features/habits/api';

/**
 * Custom hook for theme management
 * Respects user's theme preference from settings
 * Falls back to system theme when set to 'system'
 *
 * @returns 'light' | 'dark' | null | undefined - The effective theme to use
 */
export function useTheme(): 'light' | 'dark' | null | undefined {
  const systemColorScheme = useSystemColorScheme();
  const { settings } = useSettingsStore();

  // Resolve effective theme based on user preference
  const effectiveTheme = settings.theme === 'system' ? systemColorScheme : settings.theme;

  return effectiveTheme;
}
