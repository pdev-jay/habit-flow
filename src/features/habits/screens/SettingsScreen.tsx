import React from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSettingsStore } from '@/features/habits/stores';
import type { ThemeType, LanguageType } from '@/features/habits/types';
import { useI18n, useTheme } from '@/hooks';
import { useNotificationPermissions } from '@/hooks/useNotificationPermissions';
import { rescheduleAllHabits, cancelAllNotifications } from '@/services/notificationService';
import { useHabitStore } from '@/features/habits/stores/habitStore';

/**
 * Settings screen
 */
export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { settings, updateSettings } = useSettingsStore();
  const { t } = useI18n();
  const colorScheme = useTheme();
  const { requestPermission } = useNotificationPermissions();
  const habits = useHabitStore((state) => state.habits);

  const handleThemeChange = (theme: ThemeType) => {
    updateSettings({ theme });
  };

  const handleLanguageChange = (language: LanguageType) => {
    updateSettings({ language });
  };

  // Notification toggle with permission handling
  const handleNotificationsToggle = async (value: boolean) => {
    if (value) {
      // Request permission first
      const granted = await requestPermission();
      if (granted) {
        updateSettings({ notificationsEnabled: true });
        // Schedule all notifications
        await rescheduleAllHabits(habits);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        // Permission denied, keep toggle off
        updateSettings({ notificationsEnabled: false });
      }
    } else {
      // Disable notifications
      updateSettings({ notificationsEnabled: false });
      await cancelAllNotifications();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleContactUs = async () => {
    const email = 'support@habitflow.com';
    const subject = 'HabitFlow Support Inquiry';
    const body = '';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert(t('screens:settings.contactError'), t('screens:settings.contactErrorMessage'));
      }
    } catch {
      Alert.alert(t('screens:settings.contactError'), t('screens:settings.contactErrorMessage'));
    }
  };

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View
        className="border-b border-gray-200 bg-white px-4 pb-4 dark:border-gray-800 dark:bg-gray-900"
        style={[{ paddingTop: insets.top }, styles.headerShadow]}>
        <ThemedText className="text-3xl font-bold">{t('screens:settings.title')}</ThemedText>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: insets.bottom }}>
        {/* Appearance Section */}
        <View
          className="mb-6 rounded-xl bg-white p-4 dark:bg-gray-800"
          style={[styles.card, { borderLeftWidth: 4, borderLeftColor: '#3B82F6' }]}>
          <View className="mb-3 flex-row items-center">
            <MaterialCommunityIcons
              name="palette"
              size={22}
              color="#3B82F6"
              style={{ marginRight: 8 }}
            />
            <ThemedText className="text-lg font-bold">
              {t('screens:settings.appearance')}
            </ThemedText>
          </View>

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
        <View
          className="mb-6 rounded-xl bg-white p-4 dark:bg-gray-800"
          style={[styles.card, { borderLeftWidth: 4, borderLeftColor: '#A855F7' }]}>
          <View className="mb-3 flex-row items-center">
            <MaterialCommunityIcons
              name="translate"
              size={22}
              color="#A855F7"
              style={{ marginRight: 8 }}
            />
            <ThemedText className="text-lg font-bold">
              {t('screens:settings.languageSection')}
            </ThemedText>
          </View>

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

        {/* Notifications Section */}
        <View
          className="mb-6 rounded-xl bg-white p-4 dark:bg-gray-800"
          style={[styles.card, { borderLeftWidth: 4, borderLeftColor: '#10B981' }]}>
          <View className="mb-3 flex-row items-center">
            <MaterialCommunityIcons
              name="bell-ring-outline"
              size={22}
              color="#10B981"
              style={{ marginRight: 8 }}
            />
            <ThemedText className="text-lg font-bold">
              {t('screens:settings.notificationsSection')}
            </ThemedText>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="mr-3 flex-1">
              <ThemedText className="font-semibold">
                {t('screens:settings.notificationsLabel')}
              </ThemedText>
              <ThemedText className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('screens:settings.notificationsDescription')}
              </ThemedText>
            </View>

            <Switch
              value={settings.notificationsEnabled}
              onValueChange={handleNotificationsToggle}
              trackColor={{
                false: colorScheme === 'dark' ? '#374151' : '#D1D5DB',
                true: '#60A5FA',
              }}
              thumbColor={settings.notificationsEnabled ? '#3B82F6' : '#F3F4F6'}
              ios_backgroundColor={colorScheme === 'dark' ? '#374151' : '#D1D5DB'}
            />
          </View>
        </View>

        {/* Premium Section */}
        <View
          className="mb-6 rounded-xl bg-white p-4 dark:bg-gray-800"
          style={[styles.card, { borderLeftWidth: 4, borderLeftColor: '#F59E0B' }]}>
          <View className="mb-3 flex-row items-center">
            <MaterialCommunityIcons
              name="crown"
              size={22}
              color="#F59E0B"
              style={{ marginRight: 8 }}
            />
            <ThemedText className="text-lg font-bold">{t('screens:settings.premium')}</ThemedText>
          </View>

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
            <Pressable className="mt-3 rounded-lg py-3" style={styles.premiumButton}>
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
        <View
          className="rounded-xl bg-white p-4 dark:bg-gray-800"
          style={[styles.card, { borderLeftWidth: 4, borderLeftColor: '#6B7280' }]}>
          <View className="mb-3 flex-row items-center">
            <MaterialCommunityIcons
              name="information-outline"
              size={22}
              color="#6B7280"
              style={{ marginRight: 8 }}
            />
            <ThemedText className="text-lg font-bold">{t('screens:settings.about')}</ThemedText>
          </View>

          <View className="mb-3 flex-row items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-700">
            <ThemedText className="text-gray-600 dark:text-gray-400">
              {t('screens:settings.version')}
            </ThemedText>
            <ThemedText className="font-semibold">1.0.0</ThemedText>
          </View>

          <View className="mb-3 flex-row items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-700">
            <ThemedText className="text-gray-600 dark:text-gray-400">
              {t('screens:settings.appName')}
            </ThemedText>
            <ThemedText className="font-semibold">{t('common:appName')}</ThemedText>
          </View>

          <Pressable
            onPress={handleContactUs}
            className="mt-3 flex-row items-center justify-center rounded-lg border border-gray-300 bg-white py-3 active:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:active:bg-gray-600">
            <MaterialCommunityIcons
              name="email-outline"
              size={20}
              color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
            <ThemedText className="ml-2 font-semibold text-gray-700 dark:text-gray-300">
              {t('screens:settings.contactUs')}
            </ThemedText>
          </Pressable>
        </View>

        {/* Developer Section */}
        <View
          className="mt-6 rounded-xl bg-white p-4 dark:bg-gray-800"
          style={[styles.card, { borderLeftWidth: 4, borderLeftColor: '#EF4444' }]}>
          <View className="mb-3 flex-row items-center">
            <MaterialCommunityIcons
              name="code-braces"
              size={22}
              color="#EF4444"
              style={{ marginRight: 8 }}
            />
            <ThemedText className="text-lg font-bold">개발자 모드</ThemedText>
          </View>

          <Pressable
            onPress={() => router.push('/share-test')}
            className="flex-row items-center justify-center rounded-lg border border-red-300 bg-white py-3 active:bg-red-50 dark:border-red-600 dark:bg-gray-700 dark:active:bg-gray-600">
            <MaterialCommunityIcons
              name="image-multiple-outline"
              size={20}
              color={colorScheme === 'dark' ? '#FCA5A5' : '#EF4444'}
            />
            <ThemedText className="ml-2 font-semibold text-red-600 dark:text-red-400">
              공유 템플릿 테스트
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  optionButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  premiumButton: {
    backgroundColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});
