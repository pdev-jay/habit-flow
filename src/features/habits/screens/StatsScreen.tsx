import React, { useMemo, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, View, Pressable, Text } from 'react-native';
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
import { useRouter } from 'expo-router';

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
import { useHabitCheckStore } from '@/features/habits/api';
import type { Habit } from '@/features/habits/types';

import { SegmentControl } from '../components/SegmentControl';
import { WeeklyView } from '../components/WeeklyView';
import { MonthlyView } from '../components/MonthlyView';
import { DayDetailModal } from '../components/DayDetailModal';

/**
 * Stats screen - shows weekly and monthly statistics
 */
export function StatsScreen() {
  const router = useRouter();
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

  const handleShare = useCallback(() => {
    router.push('/share');
  }, [router]);

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View
        className="border-b border-gray-200 bg-white px-4 pb-4 dark:border-gray-800 dark:bg-gray-900"
        style={[{ paddingTop: insets.top }, styles.headerShadow]}>
        <View className="flex-row items-center justify-between pb-4">
          <ThemedText className="text-3xl font-bold">{t('screens:stats.title')}</ThemedText>
          <Pressable onPress={handleShare} className="px-3 py-1">
            <Text
              className="text-lg font-semibold"
              style={{ color: colorScheme === 'dark' ? '#60A5FA' : '#3B82F6' }}>
              {t('common:share')}
            </Text>
          </Pressable>
        </View>
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
          <WeeklyView
            weeklyStats={weeklyStats}
            chartData={chartData}
            habitStats={habitStats}
            isCurrentWeek={isThisWeek(currentWeekDate)}
          />
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
