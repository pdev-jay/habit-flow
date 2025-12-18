import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getLocales } from 'expo-localization';
import { zustandStorage } from './storage';
import type { UserSettings } from '../types';

interface SettingsStore {
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
}

/**
 * 시스템 언어를 감지하여 기본 언어 설정
 * - 한국어(ko)면 'ko', 아니면 'en'으로 설정
 */
function getDefaultLanguage(): 'ko' | 'en' {
  try {
    const locales = getLocales();
    const systemLanguage = locales[0]?.languageCode;

    // 한국어인 경우 'ko', 아니면 'en'
    return systemLanguage === 'ko' ? 'ko' : 'en';
  } catch (error) {
    console.error('Failed to detect system language:', error);
    return 'en'; // 기본값: 영어
  }
}

const defaultSettings: UserSettings = {
  theme: 'system',
  language: getDefaultLanguage(),
  isPro: false,
  notificationsEnabled: false,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,

      updateSettings: (updates: Partial<UserSettings>) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...updates,
          },
        }));
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
