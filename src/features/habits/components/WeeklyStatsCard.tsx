import React, { useMemo } from 'react';
import { View } from 'react-native';
import { format } from 'date-fns';

import { ThemedText } from '@/components/ThemedText';
import { useHabits } from '@/features/habits/hooks';
import { useHabitCheckStore } from '@/features/habits/stores';

/**
 * Daily stats card component
 * Shows "Today X/Y done" with progress bar
 */
export function WeeklyStatsCard() {
  const { getActiveHabitsForDate } = useHabits();
  const checks = useHabitCheckStore((state) => state.checks);

  const today = useMemo(() => new Date(), []);
  const todayString = format(today, 'yyyy-MM-dd');

  // Format date for display
  const dateText = useMemo(() => {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const day = weekdays[today.getDay()];
    return `${month}월 ${date}일 (${day})`;
  }, [today]);

  // Get today's active habits
  const activeHabits = useMemo(() => {
    return getActiveHabitsForDate(today);
  }, [getActiveHabitsForDate, today]);

  // Count completed habits today
  const completedCount = useMemo(() => {
    return activeHabits.filter((habit) => {
      const key = `${habit.id}_${todayString}`;
      return checks[key]?.completed ?? false;
    }).length;
  }, [activeHabits, checks, todayString]);

  const totalCount = activeHabits.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <View className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
      <View className="flex-row items-center justify-between">
        <ThemedText className="text-base font-medium text-gray-600 dark:text-gray-300">
          Today
        </ThemedText>
        <ThemedText className="text-sm text-gray-500 dark:text-gray-400">{dateText}</ThemedText>
      </View>
      <ThemedText className="mb-3 mt-1 text-2xl font-bold">
        {completedCount}/{totalCount} done
      </ThemedText>

      {/* Progress Bar */}
      <View className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <View
          className="h-full rounded-full bg-blue-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </View>
    </View>
  );
}
