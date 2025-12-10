import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import type { MonthlyStats } from '../types/stats.types';

interface Props {
  stats: MonthlyStats;
}

export function MonthlySummaryCard({ stats }: Props) {
  return (
    <ThemedView className="mx-4 my-2 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
      <ThemedText className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        이번 달 요약
      </ThemedText>
      <View className="flex-row justify-between">
        <View className="flex-1 items-center">
          <ThemedText className="text-2xl font-bold text-blue-500">
            {stats.averageCompletionRate.toFixed(0)}%
          </ThemedText>
          <ThemedText className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            평균 완료율
          </ThemedText>
        </View>
        <View className="flex-1 items-center">
          <ThemedText className="text-2xl font-bold text-green-500">{stats.perfectDays}</ThemedText>
          <ThemedText className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            완벽한 날
          </ThemedText>
        </View>
        <View className="flex-1 items-center">
          <ThemedText className="text-2xl font-bold text-purple-500">
            {stats.longestStreak}
          </ThemedText>
          <ThemedText className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            최장 스트릭
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}
