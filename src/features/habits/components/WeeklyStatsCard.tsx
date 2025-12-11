import React, { useMemo } from 'react';
import { View } from 'react-native';
import { format, isSameDay } from 'date-fns';

import { ThemedText } from '@/components/ThemedText';
import { useI18n } from '@/hooks';
import { getDateLocale, getDateFormat } from '@/i18n';
import { useHabits } from '@/features/habits/hooks';
import { useHabitCheckStore } from '@/features/habits/stores';

interface WeeklyStatsCardProps {
  selectedDate: Date;
}

/**
 * Daily stats card component
 * Shows "Today X/Y done" with progress bar
 */
export function WeeklyStatsCard({ selectedDate }: WeeklyStatsCardProps) {
  const { t, language } = useI18n();
  const { getActiveHabitsForDate } = useHabits();
  const checks = useHabitCheckStore((state) => state.checks);

  const selectedDateString = useMemo(() => format(selectedDate, 'yyyy-MM-dd'), [selectedDate]);

  // Check if selected date is today
  const isToday = useMemo(() => isSameDay(selectedDate, new Date()), [selectedDate]);

  // Format date for display
  const dateText = useMemo(() => {
    const locale = getDateLocale(language);
    const datePattern = getDateFormat(language, 'monthDay');
    const formattedDate = format(selectedDate, datePattern, { locale });
    const dayName = format(selectedDate, 'EEE', { locale });
    return `${formattedDate} (${dayName})`;
  }, [selectedDate, language]);

  // Get selected date's active habits
  const activeHabits = useMemo(() => {
    return getActiveHabitsForDate(selectedDate);
  }, [getActiveHabitsForDate, selectedDate]);

  // Count completed habits on selected date
  const completedCount = useMemo(() => {
    return activeHabits.filter((habit) => {
      const key = `${habit.id}_${selectedDateString}`;
      return checks[key]?.completed ?? false;
    }).length;
  }, [activeHabits, checks, selectedDateString]);

  const totalCount = activeHabits.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <View className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
      <View className="flex-row items-center justify-between">
        <ThemedText className="text-base font-medium text-gray-600 dark:text-gray-300">
          {isToday ? t('components:weeklyStats.today') : t('components:weeklyStats.selected')}
        </ThemedText>
        <ThemedText className="text-sm text-gray-500 dark:text-gray-400">{dateText}</ThemedText>
      </View>
      <ThemedText className="mb-3 mt-1 text-2xl font-bold">
        {completedCount}/{totalCount} {t('components:weeklyStats.done')}
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
