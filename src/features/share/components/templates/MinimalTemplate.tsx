import React from 'react';
import { View, Text } from 'react-native';
import type { WeeklyStats, MonthlyStats } from '../../types/share.types';
import { useI18n } from '@/hooks';

interface MinimalWeeklyProps {
  stats: WeeklyStats;
}

/**
 * Minimal-style weekly template component
 * Clean, simple design with black and white color scheme
 */
export function MinimalWeekly({ stats }: MinimalWeeklyProps) {
  const { t } = useI18n();

  return (
    <View className="w-[380px] bg-white p-8">
      {/* Header */}
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-[24px] font-bold text-black">{t('common:appName')}</Text>
        <Text className="text-[14px] text-gray-500">WEEK {stats.weekNumber}</Text>
      </View>

      {/* Hero Section */}
      <View className="mb-8 items-center border-b border-gray-200 pb-8">
        <Text className="mb-2 text-[14px] uppercase tracking-wider text-gray-500">
          {t('share:minimal.weekly.completionRate')}
        </Text>
        <Text className="text-[96px] font-bold leading-[96px] text-black">
          {Math.round(stats.completionRate)}%
        </Text>
        <Text className="mt-2 text-[15px] text-gray-600">
          {stats.completedCount} {t('share:minimal.weekly.habitsCompleted')}
        </Text>
      </View>

      {/* Habits Section */}
      <View className="mb-6">
        <Text className="mb-4 text-[12px] font-semibold uppercase tracking-wider text-gray-500">
          {t('share:minimal.weekly.topHabits')}
        </Text>

        {stats.habits.slice(0, 3).map((habit, index) => (
          <View
            key={habit.id}
            className="mb-4 flex-row items-center gap-4 border-b border-gray-100 pb-4">
            <Text className="w-8 flex-shrink-0 text-[20px] font-bold text-gray-300">
              {String(index + 1).padStart(2, '0')}
            </Text>
            <View className="min-w-0 flex-1">
              <Text className="w-full text-[16px] font-semibold text-black" numberOfLines={1}>
                {habit.name}
              </Text>
              <Text className="w-full text-[12px] text-gray-500" numberOfLines={1}>
                {habit.completedDays}/{habit.totalDays} {t('share:minimal.weekly.daysCompleted')}
              </Text>
            </View>
            <Text className="flex-shrink-0 text-[18px] font-bold text-black" numberOfLines={1}>
              {Math.round(habit.completionRate)}%
            </Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <Text className="mt-auto text-center text-[11px] text-gray-400">#{t('common:appName')}</Text>
    </View>
  );
}

interface MinimalMonthlyProps {
  stats: MonthlyStats;
}

/**
 * Minimal-style monthly template component
 * Clean, simple design with black and white color scheme
 */
export function MinimalMonthly({ stats }: MinimalMonthlyProps) {
  const { t } = useI18n();

  return (
    <View className="w-[380px] bg-white p-8">
      {/* Header */}
      <View className="mb-5 flex-row items-center justify-between">
        <Text className="text-[24px] font-bold text-black">{t('common:appName')}</Text>
        <Text className="text-[14px] text-gray-500">{stats.year}</Text>
      </View>

      {/* Hero Section */}
      <View className="mb-6 items-center border-b border-gray-200 pb-6">
        <Text className="mb-1 text-[32px] font-bold leading-[38px] text-black">{stats.month}</Text>
        <Text className="text-[14px] text-gray-500">
          {t('share:minimal.monthly.monthlyReport')}
        </Text>
      </View>

      {/* Stats Grid */}
      <View className="mb-6 flex-row justify-around border-b border-gray-200 pb-6">
        <View className="items-center">
          <Text className="text-[36px] font-bold text-black">
            {Math.round(stats.averageCompletionRate)}%
          </Text>
          <Text className="mt-1 text-[11px] text-gray-500">
            {t('share:minimal.monthly.averageCompletionRate')}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-[36px] font-bold text-black">{stats.perfectDays}</Text>
          <Text className="mt-1 text-[11px] text-gray-500">
            {t('share:minimal.monthly.perfectDays')}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-[36px] font-bold text-black">{stats.maxStreak}</Text>
          <Text className="mt-1 text-[11px] text-gray-500">
            {t('share:minimal.monthly.maxStreak')}
          </Text>
        </View>
      </View>

      {/* Habits Section */}
      <View className="mb-5">
        <Text className="mb-4 text-[12px] font-semibold uppercase tracking-wider text-gray-500">
          {t('share:minimal.weekly.topHabits')}
        </Text>

        {stats.habits.slice(0, 3).map((habit, index) => (
          <View
            key={habit.id}
            className="mb-3 flex-row items-center gap-3 border-b border-gray-100 pb-3">
            <Text className="w-8 flex-shrink-0 text-[18px] font-bold text-gray-300">
              {String(index + 1).padStart(2, '0')}
            </Text>
            <View className="min-w-0 flex-1">
              <Text className="w-full text-[15px] font-semibold text-black" numberOfLines={1}>
                {habit.name}
              </Text>
              <Text className="w-full text-[11px] text-gray-500" numberOfLines={1}>
                {habit.completedDays} {t('share:minimal.monthly.timesCompleted')}{' '}
                {habit.streak > 0 && '🔥'}
              </Text>
            </View>
            <Text className="flex-shrink-0 text-[16px] font-bold text-black" numberOfLines={1}>
              {Math.round(habit.completionRate)}%
            </Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <Text className="mt-auto text-center text-[11px] text-gray-400">
        #{t('common:appName')} #{stats.year}Wrapped
      </Text>
    </View>
  );
}
