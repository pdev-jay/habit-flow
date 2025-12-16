import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';

import { useTheme, useI18n } from '@/hooks';
import { useStreakTrend } from '../hooks/useStreakTrend';

/**
 * Streak trend card component
 * Shows maximum streak per week over the last 8 weeks with a simple line chart
 */
export function StreakTrendCard() {
  const colorScheme = useTheme();
  const { t } = useI18n();
  const { weeklyData, bestStreak, averageStreak, currentStreak } = useStreakTrend();

  // Calculate chart dimensions
  const maxValue = Math.max(...weeklyData.map((w) => w.maxStreak), 1);
  const chartHeight = 120;
  const chartWidth = 280;
  const pointWidth = chartWidth / Math.max(weeklyData.length - 1, 1);

  return (
    <View className="mx-4 mb-4 rounded-2xl bg-white p-6 dark:bg-gray-800">
      {/* Header */}
      <View className="mb-4 flex-row items-center gap-2">
        <MaterialCommunityIcons
          name="chart-line"
          size={24}
          color={colorScheme === 'dark' ? '#60A5FA' : '#3B82F6'}
        />
        <Text className="text-lg font-bold text-gray-900 dark:text-white">
          {t('screens:stats.streakTrend')}
        </Text>
      </View>

      {/* Summary Stats */}
      <View className="mb-4 flex-row justify-around rounded-xl bg-blue-50 p-3 dark:bg-blue-900/20">
        <View className="items-center">
          <Text className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {bestStreak}
          </Text>
          <Text className="text-xs text-gray-600 dark:text-gray-400">
            {t('screens:stats.bestStreak')}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-black text-gray-900 dark:text-white">
            {averageStreak}
          </Text>
          <Text className="text-xs text-gray-600 dark:text-gray-400">
            {t('screens:stats.average')}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-black text-green-600 dark:text-green-400">
            {currentStreak}
          </Text>
          <Text className="text-xs text-gray-600 dark:text-gray-400">
            {t('screens:stats.current')}
          </Text>
        </View>
      </View>

      {/* Chart */}
      <View style={{ height: chartHeight + 40 }}>
        {/* Y-axis labels */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: chartHeight,
            justifyContent: 'space-between',
          }}>
          <Text className="text-xs text-gray-500 dark:text-gray-400">{maxValue}</Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            {maxValue > 2 ? Math.round(maxValue / 2) : ''}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">0</Text>
        </View>

        {/* Chart area */}
        <View style={{ marginLeft: 24, height: chartHeight + 20 }}>
          {/* Grid lines */}
          <View
            style={{
              position: 'absolute',
              width: chartWidth,
              height: chartHeight,
              justifyContent: 'space-between',
            }}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                className="h-[1px] bg-gray-200 dark:bg-gray-700"
                style={{ width: chartWidth }}
              />
            ))}
          </View>

          {/* Line chart */}
          <View style={{ position: 'absolute', width: chartWidth, height: chartHeight }}>
            {weeklyData.map((week, index) => {
              if (index === 0) return null;

              const prevWeek = weeklyData[index - 1];
              const x1 = (index - 1) * pointWidth;
              const y1 = chartHeight - (prevWeek.maxStreak / maxValue) * chartHeight;
              const x2 = index * pointWidth;
              const y2 = chartHeight - (week.maxStreak / maxValue) * chartHeight;

              // Calculate line angle and length
              const dx = x2 - x1;
              const dy = y2 - y1;
              const length = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);

              return (
                <View
                  key={index}
                  style={{
                    position: 'absolute',
                    left: x1,
                    top: y1,
                    width: length,
                    height: 3,
                    backgroundColor: colorScheme === 'dark' ? '#60A5FA' : '#3B82F6',
                    transform: [{ rotate: `${angle}deg` }],
                    transformOrigin: 'left center',
                  }}
                />
              );
            })}

            {/* Data points */}
            {weeklyData.map((week, index) => {
              const x = index * pointWidth;
              const y = chartHeight - (week.maxStreak / maxValue) * chartHeight;
              const isBest = week.maxStreak === bestStreak && bestStreak > 0;

              return (
                <View
                  key={`point-${index}`}
                  style={{
                    position: 'absolute',
                    left: x - 4,
                    top: y - 4,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: isBest
                      ? '#10B981'
                      : colorScheme === 'dark'
                        ? '#60A5FA'
                        : '#3B82F6',
                    borderWidth: 2,
                    borderColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
                  }}
                />
              );
            })}
          </View>

          {/* X-axis labels */}
          <View
            style={{
              position: 'absolute',
              top: chartHeight + 8,
              width: chartWidth,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {weeklyData.map((week, index) => (
              <Text
                key={index}
                className="text-xs text-gray-500 dark:text-gray-400"
                style={{ width: 30, textAlign: 'center' }}>
                {format(week.weekStart, 'M/d')}
              </Text>
            ))}
          </View>
        </View>
      </View>

      {/* Motivation message */}
      {currentStreak > 0 && (
        <View className="mt-4 rounded-xl bg-green-50 p-3 dark:bg-green-900/20">
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="fire"
              size={24}
              color={colorScheme === 'dark' ? '#34D399' : '#10B981'}
            />
            <Text className="flex-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t('screens:stats.streakMotivation', { days: currentStreak })}
            </Text>
          </View>
        </View>
      )}

      {/* No data */}
      {bestStreak === 0 && (
        <View className="items-center py-4">
          <MaterialCommunityIcons
            name="chart-line-variant"
            size={48}
            color={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
          />
          <Text className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t('screens:stats.noStreakData')}
          </Text>
        </View>
      )}
    </View>
  );
}
