import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme, useI18n } from '@/hooks';
import { useWeekdayAnalysis } from '../hooks/useWeekdayAnalysis';
import { useHabits } from '@/features/habits/hooks';
import type { Habit } from '@/features/habits/types';

/**
 * Weekday analysis card component
 * Shows completion rate for each day of the week with insights
 */
export function WeekdayAnalysisCard() {
  const colorScheme = useTheme();
  const { t } = useI18n();
  const weekdayStats = useWeekdayAnalysis();
  const { habits } = useHabits();

  // Calculate active habits count for each weekday
  const weekdayHabitCounts = useMemo(() => {
    const counts = Array(7).fill(0);

    habits.forEach((habit: Habit) => {
      for (let weekday = 0; weekday < 7; weekday++) {
        let isActive = false;

        switch (habit.frequency) {
          case 'daily':
            isActive = true;
            break;
          case 'weekdays':
            isActive = weekday >= 1 && weekday <= 5;
            break;
          case 'weekends':
            isActive = weekday === 0 || weekday === 6;
            break;
          case 'custom':
            isActive = habit.customDays?.includes(weekday) ?? false;
            break;
        }

        if (isActive) {
          counts[weekday]++;
        }
      }
    });

    return counts;
  }, [habits]);

  // Find best and worst performing days
  const validStats = weekdayStats.filter((stat) => stat.totalActiveDays > 0);
  const bestDay = validStats.reduce(
    (max, stat) => (stat.completionRate > max.completionRate ? stat : max),
    validStats[0] || weekdayStats[0]
  );
  const worstDay = validStats.reduce(
    (min, stat) => (stat.completionRate < min.completionRate ? stat : min),
    validStats[0] || weekdayStats[0]
  );

  // Calculate weekday vs weekend averages
  const weekdayStats_MonFri = weekdayStats.filter((stat) => stat.weekday >= 1 && stat.weekday <= 5);
  const weekendStats = weekdayStats.filter((stat) => stat.weekday === 0 || stat.weekday === 6);

  const weekdayAverage = weekdayStats_MonFri.length > 0
    ? Math.round(weekdayStats_MonFri.reduce((sum, stat) => sum + stat.completionRate, 0) / weekdayStats_MonFri.length)
    : 0;
  const weekendAverage = weekendStats.length > 0
    ? Math.round(weekendStats.reduce((sum, stat) => sum + stat.completionRate, 0) / weekendStats.length)
    : 0;

  // Weekday labels (full names for display)
  const weekdayFullKeys = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  const weekdayShortKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  return (
    <View className="mx-2 mb-4 rounded-2xl bg-white p-6 dark:bg-gray-800">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <MaterialCommunityIcons
            name="calendar-week"
            size={24}
            color={colorScheme === 'dark' ? '#60A5FA' : '#3B82F6'}
          />
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            {t('screens:stats.weekdayAnalysis')}
          </Text>
        </View>
        <Text className="text-xs text-gray-500 dark:text-gray-400">
          {t('screens:stats.lastNWeeks', { n: 4 })}
        </Text>
      </View>

      {/* Summary */}
      {validStats.length > 0 && bestDay.weekday !== worstDay.weekday && (
        <View className="mb-4 rounded-xl bg-blue-50 p-3 dark:bg-blue-900/20">
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="medal"
              size={24}
              color="#FCD34D"
            />
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                {t('screens:stats.bestDay')}:{' '}
                {t(`common:weekdays.full.${weekdayFullKeys[bestDay.weekday]}`)} (
                {bestDay.completionRate}%)
              </Text>
            </View>
          </View>
          <View className="mt-2 flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="chart-line-variant"
              size={24}
              color={colorScheme === 'dark' ? '#EF4444' : '#DC2626'}
            />
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                {t('screens:stats.needsImprovement')}:{' '}
                {t(`common:weekdays.full.${weekdayFullKeys[worstDay.weekday]}`)} (
                {worstDay.completionRate}%)
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Weekday vs Weekend Comparison */}
      {validStats.length > 0 && (
        <View className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
          <Text className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
            평일 vs 주말 비교
          </Text>
          <View className="flex-row gap-3">
            {/* Weekday */}
            <View className="flex-1 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <View className="mb-2 flex-row items-center gap-2">
                <MaterialCommunityIcons
                  name="briefcase"
                  size={20}
                  color={colorScheme === 'dark' ? '#60A5FA' : '#3B82F6'}
                />
                <Text className="text-xs text-gray-600 dark:text-gray-400">
                  평일
                </Text>
              </View>
              <Text className="text-2xl font-black text-gray-900 dark:text-white">
                {weekdayAverage}%
              </Text>
              <Text className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                월-금 평균
              </Text>
            </View>

            {/* Weekend */}
            <View className="flex-1 rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
              <View className="mb-2 flex-row items-center gap-2">
                <MaterialCommunityIcons
                  name="beach"
                  size={20}
                  color={colorScheme === 'dark' ? '#A78BFA' : '#8B5CF6'}
                />
                <Text className="text-xs text-gray-600 dark:text-gray-400">
                  주말
                </Text>
              </View>
              <Text className="text-2xl font-black text-gray-900 dark:text-white">
                {weekendAverage}%
              </Text>
              <Text className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                토-일 평균
              </Text>
            </View>
          </View>

          {/* Comparison indicator */}
          <View className="mt-3 flex-row items-center justify-center gap-2">
            <MaterialCommunityIcons
              name={weekdayAverage > weekendAverage ? 'trending-up' : weekdayAverage < weekendAverage ? 'trending-down' : 'minus'}
              size={16}
              color={weekdayAverage > weekendAverage ? '#10B981' : weekdayAverage < weekendAverage ? '#EF4444' : '#6B7280'}
            />
            <Text className="text-xs text-gray-600 dark:text-gray-400">
              {weekdayAverage > weekendAverage
                ? '평일에 더 열심히 하셨네요!'
                : weekdayAverage < weekendAverage
                  ? '주말에 더 집중하셨어요!'
                  : '평일과 주말이 비슷해요'}
            </Text>
          </View>
        </View>
      )}

      {/* Weekday bars */}
      <View className="space-y-3">
        {weekdayStats.map((stat) => {
          const isBest = stat.weekday === bestDay.weekday && validStats.length > 0;
          const isWorst = stat.weekday === worstDay.weekday && validStats.length > 0;
          const barColor = isBest
            ? colorScheme === 'dark'
              ? '#10B981'
              : '#059669'
            : isWorst
              ? colorScheme === 'dark'
                ? '#EF4444'
                : '#DC2626'
              : colorScheme === 'dark'
                ? '#60A5FA'
                : '#3B82F6';

          return (
            <View key={stat.weekday} className="my-1">
              <View className="mb-1 flex-row items-center justify-between">
                <Text className="w-12 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t(`common:weekdays.short.${weekdayShortKeys[stat.weekday]}`)}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm font-bold text-gray-900 dark:text-white">
                    {stat.completionRate}%
                  </Text>
                  {isBest && (
                    <MaterialCommunityIcons
                      name="star"
                      size={14}
                      color="#FCD34D"
                    />
                  )}
                  {isWorst && stat.completionRate < 70 && (
                    <MaterialCommunityIcons
                      name="alert"
                      size={14}
                      color={colorScheme === 'dark' ? '#FBBF24' : '#F59E0B'}
                    />
                  )}
                </View>
              </View>
              <View className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${stat.completionRate}%`,
                    backgroundColor: barColor,
                  }}
                />
              </View>
            </View>
          );
        })}
      </View>

      {/* Detailed Statistics */}
      {validStats.length > 0 && (
        <View className="mt-4">
          <Text className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
            요일별 상세 통계
          </Text>
          <View className="gap-2">
            {weekdayStats.map((stat) => {
              const isBest = stat.weekday === bestDay.weekday;
              return (
                <View
                  key={stat.weekday}
                  className="flex-row items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-900">
                  <View className="flex-row items-center gap-2">
                    <Text className="w-10 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t(`common:weekdays.short.${weekdayShortKeys[stat.weekday]}`)}
                    </Text>
                    {isBest && (
                      <MaterialCommunityIcons
                        name="crown"
                        size={12}
                        color="#FCD34D"
                      />
                    )}
                  </View>
                  <View className="flex-row items-center gap-6">
                    <View className="items-center">
                      <Text className="text-sm font-bold text-gray-900 dark:text-white">
                        {stat.completedDays}
                      </Text>
                      <Text className="text-xs text-gray-500 dark:text-gray-400">
                        완료
                      </Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-sm font-bold text-gray-900 dark:text-white">
                        {weekdayHabitCounts[stat.weekday]}
                      </Text>
                      <Text className="text-xs text-gray-500 dark:text-gray-400">
                        습관
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Insight */}
      {validStats.length > 0 && worstDay.completionRate < 70 && (
        <View className="mt-4 rounded-xl bg-amber-50 p-3 dark:bg-amber-900/20">
          <View className="flex-row items-start gap-2">
            <MaterialCommunityIcons
              name="lightbulb-outline"
              size={20}
              color={colorScheme === 'dark' ? '#FCD34D' : '#F59E0B'}
            />
            <Text className="flex-1 text-sm text-gray-700 dark:text-gray-300">
              {t('screens:stats.weekdayTip', {
                day: t(`common:weekdays.full.${weekdayFullKeys[worstDay.weekday]}`),
              })}
            </Text>
          </View>
        </View>
      )}

      {/* No data */}
      {validStats.length === 0 && (
        <View className="items-center py-4">
          <MaterialCommunityIcons
            name="calendar-blank"
            size={48}
            color={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
          />
          <Text className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t('screens:stats.noData')}
          </Text>
        </View>
      )}
    </View>
  );
}
