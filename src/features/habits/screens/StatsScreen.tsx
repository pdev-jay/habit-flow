import React, { useMemo, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import {
  startOfWeek,
  addDays,
  format,
  addMonths,
  subMonths,
  subWeeks,
  addWeeks,
  isThisWeek,
} from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme, useI18n } from '@/hooks';
import { getDateLocale, getDateFormat } from '@/i18n';
import {
  useHabits,
  useWeeklyStats,
  useDailyStatsRange,
  useMonthlyStats,
  useMonthlyHeatmapData,
  useMonthlyInsight,
  useMonthComparison,
} from '@/features/habits/hooks';
import { useHabitCheckStore } from '@/features/habits/stores';
import type { Habit } from '@/features/habits/types';

import { WeeklyChart } from '../components/WeeklyChart';
import { SegmentControl } from '../components/SegmentControl';
import { MonthlyView } from '../components/MonthlyView';
import { DayDetailModal } from '../components/DayDetailModal';

/**
 * Stats screen - shows weekly and monthly statistics
 */
export function StatsScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useTheme();
  const { t, language } = useI18n();
  const locale = getDateLocale(language);
  const { habits } = useHabits();
  const checks = useHabitCheckStore((state) => state.checks);

  // View mode state
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [currentWeekDate, setCurrentWeekDate] = useState(new Date());
  const [selectedDayForDetail, setSelectedDayForDetail] = useState<Date | null>(null);

  // Get week range
  const weekStart = useMemo(
    () => startOfWeek(currentWeekDate, { weekStartsOn: 0 }),
    [currentWeekDate]
  );
  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

  const weeklyStats = useWeeklyStats(weekStart, weekEnd);

  // Monthly data hooks
  const monthlyStats = useMonthlyStats(currentMonthDate);
  const heatmapData = useMonthlyHeatmapData(currentMonthDate);
  const monthlyInsight = useMonthlyInsight(currentMonthDate);
  const monthComparison = useMonthComparison(currentMonthDate);

  const dailyStatsRange = useDailyStatsRange(
    format(weekStart, 'yyyy-MM-dd'),
    format(weekEnd, 'yyyy-MM-dd')
  );

  // Prepare chart data
  const chartData = useMemo(() => {
    const weekdayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return weekdayKeys.map((key, index) => {
      const date = format(addDays(weekStart, index), 'yyyy-MM-dd');
      const stats = dailyStatsRange.find((s: { date: string }) => s.date === date);
      return {
        day: t(`common:weekdays.short.${key}`),
        completed: stats?.completedCount || 0,
        total: stats?.totalHabits || 0,
      };
    });
  }, [weekStart, dailyStatsRange, t]);

  // Habit-specific stats (with createdAt and frequency validation)
  const habitStats = useMemo(() => {
    return habits.map((habit: Habit) => {
      // 1. Generate 7 dates for the week
      const dates: Date[] = [];
      const current = new Date(weekStart);
      while (current <= weekEnd) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }

      // 2. Count actual active days for this habit
      let totalDays = 0;
      let completedDays = 0;

      dates.forEach((date) => {
        const dateString = format(date, 'yyyy-MM-dd');

        // Check createdAt
        const createdAt = new Date(habit.createdAt);
        createdAt.setHours(0, 0, 0, 0);
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        if (targetDate < createdAt) {
          return; // Skip dates before habit was created
        }

        // Check frequency (day of week)
        const dayOfWeek = date.getDay();
        let isActiveDay = false;

        switch (habit.frequency) {
          case 'daily':
            isActiveDay = true;
            break;
          case 'weekdays':
            isActiveDay = dayOfWeek >= 1 && dayOfWeek <= 5;
            break;
          case 'weekends':
            isActiveDay = dayOfWeek === 0 || dayOfWeek === 6;
            break;
          case 'custom':
            isActiveDay = habit.customDays?.includes(dayOfWeek) ?? false;
            break;
        }

        if (isActiveDay) {
          totalDays++;

          // Check if completed on this day
          const key = `${habit.id}_${dateString}`;
          const check = checks[key];
          if (check?.completed) {
            completedDays++;
          }
        }
      });

      const rate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

      return {
        id: habit.id,
        name: habit.name,
        color: habit.color,
        icon: habit.icon,
        completedDays,
        totalDays,
        rate,
      };
    });
  }, [habits, weekStart, weekEnd, checks]);

  const handlePreviousMonth = useCallback(() => {
    setCurrentMonthDate((prev) => subMonths(prev, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonthDate((prev) => addMonths(prev, 1));
  }, []);

  const handlePreviousWeek = useCallback(() => {
    setCurrentWeekDate((prev) => subWeeks(prev, 1));
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentWeekDate((prev) => addWeeks(prev, 1));
  }, []);

  const handleDayPress = useCallback((date: Date) => {
    setSelectedDayForDetail(date);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedDayForDetail(null);
  }, []);

  const handleViewModeChange = useCallback((newMode: 'weekly' | 'monthly') => {
    setViewMode(newMode);
  }, []);

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View
        className="border-b border-gray-200 bg-white px-4 pb-4 dark:border-gray-800 dark:bg-gray-900"
        style={[{ paddingTop: insets.top }, styles.headerShadow]}>
        <ThemedText className="pb-4 text-3xl font-bold">{t('screens:stats.title')}</ThemedText>
        {viewMode === 'weekly' ? (
          <View className="flex-row items-center justify-between">
            <Pressable
              className="h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700"
              onPress={handlePreviousWeek}>
              <MaterialCommunityIcons
                name="chevron-left"
                size={20}
                color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
              />
            </Pressable>
            <ThemedText className="text-sm text-gray-600 dark:text-gray-400">
              {format(weekStart, getDateFormat(language, 'weekRange'), { locale })} ~{' '}
              {format(weekEnd, getDateFormat(language, 'weekRange'), { locale })}
            </ThemedText>
            <Pressable
              className="h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700"
              onPress={handleNextWeek}>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
              />
            </Pressable>
          </View>
        ) : (
          <View className="flex-row items-center justify-between">
            <Pressable
              className="h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700"
              onPress={handlePreviousMonth}>
              <MaterialCommunityIcons
                name="chevron-left"
                size={20}
                color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
              />
            </Pressable>
            <ThemedText className="text-sm text-gray-600 dark:text-gray-400">
              {format(currentMonthDate, getDateFormat(language, 'yearMonth'), { locale })}
            </ThemedText>
            <Pressable
              className="h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700"
              onPress={handleNextMonth}>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
              />
            </Pressable>
          </View>
        )}
      </View>

      {/* Segment Control */}
      <View className="px-4 py-4">
        <SegmentControl value={viewMode} onChange={handleViewModeChange} />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingTop: 16 }}>
        {viewMode === 'weekly' && (
          <View>
            {/* Overall Stats */}
            <View className="mx-4 my-2 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
              <ThemedText className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                {isThisWeek(currentWeekDate)
                  ? t('screens:stats.thisWeek')
                  : t('screens:stats.weeklySummary')}
              </ThemedText>

              <View className="flex-row justify-between">
                <View className="flex-1 items-center">
                  <ThemedText className="text-2xl font-bold text-blue-500">
                    {weeklyStats.completionRate}%
                  </ThemedText>
                  <ThemedText className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {t('screens:stats.completionRate')}
                  </ThemedText>
                </View>

                <View className="flex-1 items-center">
                  <ThemedText className="text-2xl font-bold text-green-500">
                    {weeklyStats.completedCount}
                  </ThemedText>
                  <ThemedText className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {t('screens:stats.completedHabits')}
                  </ThemedText>
                </View>

                <View className="flex-1 items-center">
                  <ThemedText className="text-2xl font-bold text-purple-500">
                    {weeklyStats.streakDays}
                  </ThemedText>
                  <ThemedText className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {t('screens:stats.streakDays')}
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* Weekly Chart */}
            <View className="mx-4 my-2 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
              <ThemedText className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                {t('screens:stats.weeklyStatus')}
              </ThemedText>
              <WeeklyChart data={chartData} />
            </View>

            {/* Habit-specific Stats */}
            <View className="mx-4 my-2 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
              <ThemedText className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                {t('screens:stats.habitCompletion')}
              </ThemedText>

              {habitStats.length === 0 ? (
                <ThemedText className="text-center text-gray-500 dark:text-gray-400">
                  {t('screens:stats.addHabitsPrompt')}
                </ThemedText>
              ) : (
                habitStats
                  .filter((stat) => stat.totalDays > 0)
                  .map(
                    (stat: {
                      id: string;
                      name: string;
                      color: string;
                      rate: number;
                      completedDays: number;
                      totalDays: number;
                    }) => (
                      <View
                        key={stat.id}
                        className="mb-3 border-b border-gray-200 pb-3 last:mb-0 last:border-b-0 last:pb-0 dark:border-gray-700">
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
                    )
                  )
              )}
            </View>
          </View>
        )}

        {/* Monthly View */}
        {viewMode === 'monthly' && (
          <MonthlyView
            currentMonthDate={currentMonthDate}
            monthlyStats={monthlyStats}
            heatmapData={heatmapData}
            monthlyInsight={monthlyInsight}
            monthComparison={monthComparison}
            onDayPress={handleDayPress}
          />
        )}
      </ScrollView>

      {/* Day Detail Modal */}
      <DayDetailModal
        visible={selectedDayForDetail !== null}
        date={selectedDayForDetail}
        onClose={handleCloseModal}
      />
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
});
