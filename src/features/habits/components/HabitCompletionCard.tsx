import React, { useMemo } from 'react';
import { View, useWindowDimensions } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useI18n } from '@/hooks';

interface HabitStat {
  id: string;
  name: string;
  color: string;
  rate: number;
  completedDays: number;
  totalDays: number;
}

interface HabitCompletionCardProps {
  habitStats: HabitStat[];
}

/**
 * Habit completion card component
 * Displays individual habit completion rates
 */
export function HabitCompletionCard({ habitStats }: HabitCompletionCardProps) {
  const { t } = useI18n();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const filteredStats = habitStats.filter((stat) => stat.totalDays > 0);

  // Group stats into rows of 2 for tablet
  const groupedStats = useMemo(() => {
    if (!isTablet) {
      return filteredStats.map((stat) => [stat]);
    }

    const rows: HabitStat[][] = [];
    for (let i = 0; i < filteredStats.length; i += 2) {
      rows.push(filteredStats.slice(i, i + 2));
    }
    return rows;
  }, [filteredStats, isTablet]);

  const renderHabitStat = (stat: HabitStat) => (
    <View key={stat.id} className={`mb-5 ${isTablet ? 'flex-1 px-2' : ''}`}>
      <View className="mb-2 flex-row items-center justify-between">
        <ThemedText className="flex-1 font-semibold">{stat.name}</ThemedText>
        <ThemedText className="text-sm font-bold text-blue-600 dark:text-blue-400">
          {stat.rate}%
        </ThemedText>
      </View>

      {/* Progress Bar */}
      <View className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <View
          className="h-full rounded-full"
          style={{
            width: `${stat.rate}%`,
            backgroundColor: stat.color,
          }}
        />
      </View>

      <ThemedText className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {t('screens:stats.completedDays', {
          completed: stat.completedDays,
          total: stat.totalDays,
        })}
      </ThemedText>
    </View>
  );

  return (
    <View className="mx-4 my-2 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
      <ThemedText className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        {t('screens:stats.habitCompletion')}
      </ThemedText>

      {filteredStats.length === 0 ? (
        <ThemedText className="text-center text-gray-500 dark:text-gray-400">
          {t('screens:stats.addHabitsPrompt')}
        </ThemedText>
      ) : (
        groupedStats.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} className={isTablet ? 'flex-row' : ''}>
            {row.map((stat) => renderHabitStat(stat))}
            {/* Add empty placeholder if odd number on tablet */}
            {isTablet && row.length === 1 && <View className="flex-1 px-2" />}
          </View>
        ))
      )}
    </View>
  );
}
