import React from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useI18n } from '@/hooks';
import type { WeeklyStats } from '../types';

interface WeeklySummaryCardProps {
  stats: WeeklyStats;
  isCurrentWeek: boolean;
}

/**
 * Weekly summary card component
 * Displays overall weekly statistics
 */
export function WeeklySummaryCard({ stats, isCurrentWeek }: WeeklySummaryCardProps) {
  const { t } = useI18n();

  return (
    <View className="mx-4 my-2 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
      <ThemedText className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        {isCurrentWeek ? t('screens:stats.thisWeek') : t('screens:stats.weeklySummary')}
      </ThemedText>

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
