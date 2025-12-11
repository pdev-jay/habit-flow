import React, { useMemo, useState, useCallback } from 'react';
import { ScrollView, View, Pressable } from 'react-native';
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
import { ko } from 'date-fns/locale';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks';
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
  const { habits } = useHabits();
  const checks = useHabitCheckStore((state) => state.checks);

  // View mode state
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [currentWeekDate, setCurrentWeekDate] = useState(new Date());
  const [selectedDayForDetail, setSelectedDayForDetail] = useState<Date | null>(null);

  // Get week range
  const weekStart = useMemo(
    () => startOfWeek(currentWeekDate, { weekStartsOn: 1 }),
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
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    return days.map((day, index) => {
      const date = format(addDays(weekStart, index), 'yyyy-MM-dd');
      const stats = dailyStatsRange.find((s: { date: string }) => s.date === date);
      return {
        day,
        completed: stats?.completedCount || 0,
        total: stats?.totalHabits || 0,
      };
    });
  }, [weekStart, dailyStatsRange]);

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
      <View className="bg-white px-4 pb-4 dark:bg-gray-900" style={{ paddingTop: insets.top }}>
        <ThemedText className="pb-4 text-3xl font-bold">통계</ThemedText>
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
              {format(weekStart, 'M월 d일', { locale: ko })} ~{' '}
              {format(weekEnd, 'M월 d일', { locale: ko })}
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
              {format(currentMonthDate, 'yyyy년 M월', { locale: ko })}
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
      <View className="px-4 py-2">
        <SegmentControl value={viewMode} onChange={handleViewModeChange} />
      </View>

      <ScrollView className="flex-1 pt-4">
        {viewMode === 'weekly' && (
          <View>
            {/* Overall Stats */}
            <View className="mx-4 my-2 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
              <ThemedText className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                {isThisWeek(currentWeekDate) ? '이번 주 요약' : '주간 요약'}
              </ThemedText>

              <View className="flex-row justify-between">
                <View className="flex-1 items-center">
                  <ThemedText className="text-2xl font-bold text-blue-500">
                    {weeklyStats.completionRate}%
                  </ThemedText>
                  <ThemedText className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    완료율
                  </ThemedText>
                </View>

                <View className="flex-1 items-center">
                  <ThemedText className="text-2xl font-bold text-green-500">
                    {weeklyStats.completedCount}
                  </ThemedText>
                  <ThemedText className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    완료한 습관
                  </ThemedText>
                </View>

                <View className="flex-1 items-center">
                  <ThemedText className="text-2xl font-bold text-purple-500">
                    {weeklyStats.streakDays}
                  </ThemedText>
                  <ThemedText className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    연속 달성일
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* Weekly Chart */}
            <View className="mx-4 my-2 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
              <ThemedText className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                주간 완료 현황
              </ThemedText>
              <WeeklyChart data={chartData} />
            </View>

            {/* Habit-specific Stats */}
            <View className="mx-4 my-2 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
              <ThemedText className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                습관별 달성률
              </ThemedText>

              {habitStats.length === 0 ? (
                <ThemedText className="text-center text-gray-500 dark:text-gray-400">
                  습관을 추가하면 통계가 표시됩니다.
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
                          {stat.completedDays}/{stat.totalDays}일 완료
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
