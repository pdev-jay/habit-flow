import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useI18n } from '@/hooks';
import type { MonthlyStats } from '../types/stats.types';

interface Props {
  stats: MonthlyStats;
}

export function MonthlySummaryCard({ stats }: Props) {
  const { t } = useI18n();

  return (
    <View className="mx-4 my-2 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
      <ThemedText className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        {t('components:monthlySummary.title')}
      </ThemedText>
      <View className="flex-row justify-between">
        <View className="flex-1 items-center">
          <ThemedText className="text-2xl font-bold text-blue-500">
            {stats.averageCompletionRate.toFixed(0)}%
          </ThemedText>
          <ThemedText className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t('components:monthlySummary.avgCompletionRate')}
          </ThemedText>
        </View>
        <View className="flex-1 items-center">
          <ThemedText className="text-2xl font-bold text-green-500">{stats.perfectDays}</ThemedText>
          <ThemedText className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t('components:monthlySummary.perfectDays')}
          </ThemedText>
        </View>
        <View className="flex-1 items-center">
          <ThemedText className="text-2xl font-bold text-purple-500">
            {stats.longestStreak}
          </ThemedText>
          <ThemedText className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t('components:monthlySummary.longestStreak')}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}
