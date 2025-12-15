import React from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useI18n } from '@/hooks';
import { WeeklyChart } from './WeeklyChart';

interface WeeklyChartCardProps {
  chartData: {
    day: string;
    completed: number;
    total: number;
  }[];
}

/**
 * Weekly chart card component
 * Displays weekly completion chart
 */
export function WeeklyChartCard({ chartData }: WeeklyChartCardProps) {
  const { t } = useI18n();

  return (
    <View className="mx-4 my-2 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
      <ThemedText className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        {t('screens:stats.weeklyStatus')}
      </ThemedText>
      <WeeklyChart data={chartData} />
    </View>
  );
}
