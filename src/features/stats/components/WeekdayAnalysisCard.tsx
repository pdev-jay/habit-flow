import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme, useI18n } from '@/hooks';
import { useWeekdayAnalysis } from '../hooks/useWeekdayAnalysis';

/**
 * Weekday analysis card component
 * Shows completion rate for each day of the week with insights
 */
export function WeekdayAnalysisCard() {
  const colorScheme = useTheme();
  const { t } = useI18n();
  const weekdayStats = useWeekdayAnalysis();

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
    <View className="mx-4 mb-4 rounded-2xl bg-white p-6 dark:bg-gray-800">
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
            <Text className="text-2xl">🥇</Text>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                {t('screens:stats.bestDay')}:{' '}
                {t(`common:weekdays.full.${weekdayFullKeys[bestDay.weekday]}`)} (
                {bestDay.completionRate}%)
              </Text>
            </View>
          </View>
          <View className="mt-2 flex-row items-center gap-2">
            <Text className="text-2xl">📉</Text>
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
            <View key={stat.weekday}>
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
