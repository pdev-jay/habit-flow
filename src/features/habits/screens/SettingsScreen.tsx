import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSettingsStore } from '@/features/habits/stores';
import type { ThemeType, LanguageType } from '@/features/habits/types';
import { useI18n } from '@/hooks';

/**
 * Settings screen
 */
export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { settings, updateSettings } = useSettingsStore();
  const { t } = useI18n();

  const handleThemeChange = (theme: ThemeType) => {
    updateSettings({ theme });
  };

  const handleLanguageChange = (language: LanguageType) => {
    updateSettings({ language });
  };

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View className="bg-white px-4 pb-4 dark:bg-gray-900" style={{ paddingTop: insets.top }}>
        <ThemedText className="text-3xl font-bold">{t('screens:settings.title')}</ThemedText>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Appearance Section */}
        <View className="mb-4 rounded-xl bg-white p-4 dark:bg-gray-800">
          <ThemedText className="mb-3 text-lg font-bold">
            {t('screens:settings.appearance')}
          </ThemedText>

          <ThemedText className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            {t('screens:settings.themeLabel')}
          </ThemedText>

          <View className="flex-row">
            {(['system', 'light', 'dark'] as ThemeType[]).map((theme) => {
              const isSelected = settings.theme === theme;
              const labels: Record<ThemeType, string> = {
                system: t('common:theme.system'),
                light: t('common:theme.light'),
                dark: t('common:theme.dark'),
              };

              return (
                <Pressable
                  key={theme}
                  onPress={() => handleThemeChange(theme)}
                  className={`mr-2 flex-1 items-center justify-center rounded-lg py-3 ${
                    isSelected ? 'bg-blue-500' : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                  style={styles.optionButton}>
                  <ThemedText
                    className={`text-sm font-semibold ${
                      isSelected ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                    {labels[theme]}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Language Section */}
        <View className="mb-4 rounded-xl bg-white p-4 dark:bg-gray-800">
          <ThemedText className="mb-3 text-lg font-bold">
            {t('screens:settings.languageSection')}
          </ThemedText>

          <ThemedText className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            {t('screens:settings.languageLabel')}
          </ThemedText>

          <View className="flex-row">
            {(['ko', 'en'] as LanguageType[]).map((language) => {
              const isSelected = settings.language === language;
              const labels: Record<LanguageType, string> = {
                ko: t('common:language.korean'),
                en: t('common:language.english'),
              };

              return (
                <Pressable
                  key={language}
                  onPress={() => handleLanguageChange(language)}
                  className={`mr-2 flex-1 items-center justify-center rounded-lg py-3 ${
                    isSelected ? 'bg-blue-500' : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                  style={styles.optionButton}>
                  <ThemedText
                    className={`text-sm font-semibold ${
                      isSelected ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                    {labels[language]}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Premium Section */}
        <View className="mb-4 rounded-xl bg-white p-4 dark:bg-gray-800">
          <ThemedText className="mb-3 text-lg font-bold">
            {t('screens:settings.premium')}
          </ThemedText>

          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <ThemedText className="font-semibold">
                {t('screens:settings.premiumStatus')}
              </ThemedText>
              <ThemedText className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {settings.isPro
                  ? t('screens:settings.premiumMember')
                  : t('screens:settings.freeMember')}
              </ThemedText>
            </View>

            <View
              className={`rounded-full px-3 py-1 ${
                settings.isPro ? 'bg-yellow-100' : 'bg-gray-100 dark:bg-gray-700'
              }`}>
              <ThemedText
                className={`text-xs font-bold ${
                  settings.isPro ? 'text-yellow-700' : 'text-gray-500'
                }`}>
                {settings.isPro ? 'PRO' : 'FREE'}
              </ThemedText>
            </View>
          </View>

          {!settings.isPro && (
            <Pressable
              className="mt-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 py-3"
              style={styles.premiumButton}>
              <View className="flex-row items-center justify-center">
                <MaterialCommunityIcons name="crown" size={20} color="white" />
                <ThemedText className="ml-2 font-semibold text-white">
                  {t('screens:settings.upgrade')}
                </ThemedText>
              </View>
            </Pressable>
          )}
        </View>

        {/* About Section */}
        <View className="rounded-xl bg-white p-4 dark:bg-gray-800">
          <ThemedText className="mb-3 text-lg font-bold">{t('screens:settings.about')}</ThemedText>

          <View className="mb-3 flex-row items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-700">
            <ThemedText className="text-gray-600 dark:text-gray-400">
              {t('screens:settings.version')}
            </ThemedText>
            <ThemedText className="font-semibold">1.0.0</ThemedText>
          </View>

          <View className="flex-row items-center justify-between">
            <ThemedText className="text-gray-600 dark:text-gray-400">
              {t('screens:settings.appName')}
            </ThemedText>
            <ThemedText className="font-semibold">{t('common:appName')}</ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  optionButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  premiumButton: {
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
