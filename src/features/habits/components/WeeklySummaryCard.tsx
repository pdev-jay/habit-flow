import React from 'react';
import { View, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { useI18n, useTheme } from '@/hooks';
import type { WeeklyStats } from '../types';

interface WeeklySummaryCardProps {
  stats: WeeklyStats;
  isCurrentWeek: boolean;
  onShare?: () => void;
}

/**
 * Weekly summary card component
 * Displays overall weekly statistics
 */
export function WeeklySummaryCard({ stats, isCurrentWeek, onShare }: WeeklySummaryCardProps) {
  const { t } = useI18n();
  const colorScheme = useTheme();

  return (
    <View className="mx-4 my-2 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
      <View className="mb-3 flex-row items-center justify-between">
        <ThemedText className="text-lg font-semibold text-gray-900 dark:text-white">
          {isCurrentWeek ? t('screens:stats.thisWeek') : t('screens:stats.weeklySummary')}
        </ThemedText>
        {onShare && (
          <Pressable
            onPress={onShare}
            className="h-8 w-8 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-gray-700">
            <MaterialCommunityIcons
              name="share-variant"
              size={20}
              color={colorScheme === 'dark' ? '#60A5FA' : '#3B82F6'}
            />
          </Pressable>
        )}
      </View>

      <View className="flex-row justify-between">
        <View className="flex-1 items-center">
          <ThemedText className="text-2xl font-bold text-blue-500">
            {stats.completionRate}%
          </ThemedText>
          <ThemedText className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t('screens:stats.completionRate')}
          </ThemedText>
        </View>

        <View className="flex-1 items-center">
          <ThemedText className="text-2xl font-bold text-green-500">
            {stats.completedCount}
          </ThemedText>
          <ThemedText className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t('screens:stats.completedHabits')}
          </ThemedText>
        </View>

        <View className="flex-1 items-center">
          <ThemedText className="text-2xl font-bold text-purple-500">{stats.streakDays}</ThemedText>
          <ThemedText className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t('screens:stats.streakDays')}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}
