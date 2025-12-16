import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme, useI18n } from '@/hooks';
import { useHabitDetail } from '../hooks/useHabitDetail';

/**
 * Habit detail card component
 * Shows top 3 habits by default, with "Show All" button to expand
 */
export function HabitDetailCard() {
  const colorScheme = useTheme();
  const { t } = useI18n();
  const habitStats = useHabitDetail();
  const [showAll, setShowAll] = useState(false);

  // Sort by completion rate (highest first)
  const sortedStats = [...habitStats].sort((a, b) => b.completionRate - a.completionRate);

  // Show top 3 by default, all when expanded
  const displayStats = showAll ? sortedStats : sortedStats.slice(0, 3);
  const hasMore = sortedStats.length > 3;

  // Helper function to format frequency text
  const getFrequencyText = (habit: typeof habitStats[0]['habit']) => {
    if (habit.frequency === 'custom' && habit.customDays) {
      const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      const selectedDays = habit.customDays
        .sort((a, b) => a - b)
        .map((dayIndex) => t(`common:weekdays.short.${dayNames[dayIndex]}`));
      return selectedDays.join(' · ');
    }
    return t(`components:habitForm.${habit.frequency}`);
  };

  return (
    <View className="mx-4 mb-4 rounded-2xl bg-white p-6 dark:bg-gray-800">
      {/* Header */}
      <View className="mb-4 flex-row items-center gap-2">
        <MaterialCommunityIcons
          name="format-list-bulleted"
          size={24}
          color={colorScheme === 'dark' ? '#60A5FA' : '#3B82F6'}
        />
        <Text className="text-lg font-bold text-gray-900 dark:text-white">
          {t('screens:stats.habitDetails')}
        </Text>
      </View>

      {sortedStats.length === 0 ? (
        /* No habits */
        <View className="items-center py-8">
          <MaterialCommunityIcons
            name="format-list-bulleted"
            size={48}
            color={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
          />
          <Text className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t('screens:stats.noData')}
          </Text>
        </View>
      ) : (
        <>
          <View>
            {displayStats.map((stat, index) => (
              <View
                key={stat.habit.id}
                className={`rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900 ${
                  index < displayStats.length - 1 ? 'mb-4' : ''
                }`}>
                {/* Habit Name with Icon */}
                <View className="mb-3 flex-row items-center gap-2">
                  <View
                    className="h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: stat.habit.color }}>
                    <MaterialCommunityIcons
                      name={stat.habit.icon as any}
                      size={20}
                      color="#FFFFFF"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-gray-900 dark:text-white">
                      {stat.habit.name}
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      {getFrequencyText(stat.habit)}
                    </Text>
                  </View>
                  {index === 0 && sortedStats.length > 1 && <Text className="text-2xl">🏆</Text>}
                </View>

                {/* Stats Grid */}
                <View className="flex-row flex-wrap gap-2">
                  {/* Completion Rate */}
                  <View className="flex-1 min-w-[45%] rounded-lg bg-white p-3 dark:bg-gray-800">
                    <Text className="text-xs text-gray-600 dark:text-gray-400">
                      {t('screens:habitDetail.completionRate')}
                    </Text>
                    <Text className="mt-1 text-2xl font-black text-blue-600 dark:text-blue-400">
                      {stat.completionRate}%
                    </Text>
                  </View>

                  {/* Current Streak */}
                  <View className="flex-1 min-w-[45%] rounded-lg bg-white p-3 dark:bg-gray-800">
                    <Text className="text-xs text-gray-600 dark:text-gray-400">
                      {t('screens:habitDetail.currentStreak')}
                    </Text>
                    <Text className="mt-1 text-2xl font-black text-green-600 dark:text-green-400">
                      {stat.currentStreak}{' '}
                      <Text className="text-sm font-normal">{t('screens:habitDetail.days')}</Text>
                    </Text>
                  </View>

                  {/* Best Streak */}
                  <View className="flex-1 min-w-[45%] rounded-lg bg-white p-3 dark:bg-gray-800">
                    <Text className="text-xs text-gray-600 dark:text-gray-400">
                      {t('screens:habitDetail.bestStreak')}
                    </Text>
                    <Text className="mt-1 text-2xl font-black text-purple-600 dark:text-purple-400">
                      {stat.bestStreak}{' '}
                      <Text className="text-sm font-normal">{t('screens:habitDetail.days')}</Text>
                    </Text>
                  </View>

                  {/* Total Completions */}
                  <View className="flex-1 min-w-[45%] rounded-lg bg-white p-3 dark:bg-gray-800">
                    <Text className="text-xs text-gray-600 dark:text-gray-400">
                      {t('screens:habitDetail.totalCompletions')}
                    </Text>
                    <Text className="mt-1 text-2xl font-black text-orange-600 dark:text-orange-400">
                      {stat.totalCompletions}{' '}
                      <Text className="text-sm font-normal">{t('screens:habitDetail.times')}</Text>
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Show All / Collapse Button */}
          {hasMore && (
            <Pressable
              onPress={() => setShowAll(!showAll)}
              className="mt-3 flex-row items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-3 dark:border-gray-700 dark:bg-gray-800">
              <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {showAll
                  ? t('screens:stats.showLess')
                  : t('screens:stats.showAll', { count: sortedStats.length })}
              </Text>
              <MaterialCommunityIcons
                name={showAll ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
              />
            </Pressable>
          )}
        </>
      )}

      {/* Tip */}
      {sortedStats.length > 0 && (
        <View className="mt-4 rounded-xl bg-blue-50 p-3 dark:bg-blue-900/20">
          <View className="flex-row items-start gap-2">
            <MaterialCommunityIcons
              name="information-outline"
              size={20}
              color={colorScheme === 'dark' ? '#60A5FA' : '#3B82F6'}
            />
            <Text className="flex-1 text-sm text-gray-700 dark:text-gray-300">
              {t('screens:stats.habitDetailTip')}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
