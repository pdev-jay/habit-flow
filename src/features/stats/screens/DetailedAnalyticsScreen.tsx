import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTheme, useI18n } from '@/hooks';
import { WeekdayAnalysisCard } from '../components/WeekdayAnalysisCard';
import { StreakTrendCard } from '../components/StreakTrendCard';
import { TimePatternCard } from '../components/TimePatternCard';

/**
 * Detailed analytics screen (Premium feature)
 * Shows advanced insights after watching rewarded ad
 */
export function DetailedAnalyticsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useTheme();
  const { t } = useI18n();

  const handleWatchAd = () => {
    // TODO: 광고 SDK 연동
    console.log('Watch ad triggered');
  };

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View
        className="border-b border-gray-200 bg-white px-4 pb-4 dark:border-gray-800 dark:bg-gray-900"
        style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center justify-between pb-4">
          <View className="flex-row items-center gap-3">
            <Pressable onPress={() => router.back()} className="rounded-full p-1">
              <MaterialCommunityIcons
                name="chevron-left"
                size={28}
                color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
              />
            </Pressable>
            <ThemedText className="text-3xl font-bold">
              {t('screens:stats.detailedAnalytics')}
            </ThemedText>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-4">
        {/* Development mode: Show unlocked analytics */}
        {__DEV__ ? (
          <>
            {/* Unlocked Analytics */}
            <WeekdayAnalysisCard />
            <StreakTrendCard />
            <TimePatternCard />

            {/* TODO: Add more analytics cards */}
            {/* <HabitDetailCard /> */}
            {/* <MotivationInsightCard /> */}
          </>
        ) : (
          /* Production mode: Show lock screen */
          <View className="flex-1 items-center justify-center px-8 py-20">
            <View className="items-center rounded-3xl bg-white p-8 dark:bg-gray-800">
              <MaterialCommunityIcons
                name="lock-outline"
                size={64}
                color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
              />
              <Text className="mt-4 text-center text-xl font-bold text-gray-900 dark:text-white">
                {t('screens:stats.unlockDetailedAnalytics')}
              </Text>
              <Text className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                {t('screens:stats.detailedAnalyticsDescription')}
              </Text>

              {/* Features List */}
              <View className="mt-6 w-full space-y-3">
                {[
                  { icon: 'clock-outline', text: t('screens:stats.timePattern') },
                  { icon: 'chart-line', text: t('screens:stats.streakTrend') },
                  { icon: 'calendar-week', text: t('screens:stats.weekdayAnalysis') },
                  { icon: 'format-list-bulleted', text: t('screens:stats.habitDetails') },
                  { icon: 'lightbulb-outline', text: t('screens:stats.aiInsights') },
                ].map((item, index) => (
                  <View key={index} className="flex-row items-center gap-3">
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={20}
                      color={colorScheme === 'dark' ? '#60A5FA' : '#3B82F6'}
                    />
                    <Text className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                      {item.text}
                    </Text>
                  </View>
                ))}
              </View>

              {/* CTA Button */}
              <Pressable
                onPress={handleWatchAd}
                className="mt-8 w-full rounded-2xl bg-blue-500 px-6 py-4"
                style={{
                  shadowColor: '#3B82F6',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                }}>
                <Text className="text-center text-base font-bold text-white">
                  {t('screens:stats.watchAdToUnlock')}
                </Text>
                <Text className="mt-1 text-center text-xs text-white/80">
                  {t('screens:stats.freeFor24Hours')}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}
