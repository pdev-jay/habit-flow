import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
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
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const templateWidth = isTablet ? Math.min(width * 0.75, 680) : width * 0.9;

  return (
    <View className="overflow-hidden rounded-3xl bg-white p-8" style={{ width: templateWidth }}>
      {/* Header */}
      <View className="mb-6 flex-row items-center justify-between">
        <Text className={`${isTablet ? 'text-[36px]' : 'text-[24px]'} font-bold text-black`}>
          {t('common:appName')}
        </Text>
        <Text className={`${isTablet ? 'text-[21px]' : 'text-[14px]'} text-gray-500`}>
          WEEK {stats.weekNumber}
        </Text>
      </View>

      {/* Hero Section */}
      <View className="mb-8 items-center border-b border-gray-200 pb-8">
        <Text
          className={`${isTablet ? 'text-[21px]' : 'text-[14px]'} mb-2 uppercase tracking-wider text-gray-500`}>
          {t('share:minimal.weekly.completionRate')}
        </Text>
        <Text
          className={`${isTablet ? 'text-[144px] leading-[144px]' : 'text-[96px] leading-[96px]'} font-bold text-black`}>
          {Math.round(stats.completionRate)}%
        </Text>
        <Text className={`${isTablet ? 'text-[22px]' : 'text-[15px]'} mt-2 text-gray-600`}>
          {stats.completedCount} {t('share:minimal.weekly.habitsCompleted')}
        </Text>
      </View>

      {/* Habits Section */}
      <View className="mb-6">
        <Text
          className={`${isTablet ? 'text-[18px]' : 'text-[12px]'} mb-4 font-semibold uppercase tracking-wider text-gray-500`}>
          {t('share:minimal.weekly.topHabits')}
        </Text>

        {stats.habits.slice(0, 3).map((habit, index) => (
          <View
            key={habit.id}
            className="mb-4 flex-row items-center gap-4 border-b border-gray-100 pb-4">
            <Text
              className={`${isTablet ? 'w-12 text-[30px]' : 'w-8 text-[20px]'} flex-shrink-0 font-bold text-gray-300`}>
              {String(index + 1).padStart(2, '0')}
            </Text>
            <View className="min-w-0 flex-1">
              <Text
                className={`${isTablet ? 'text-[24px]' : 'text-[16px]'} w-full font-semibold text-black`}
                numberOfLines={1}>
                {habit.name}
              </Text>
              <Text
                className={`${isTablet ? 'text-[18px]' : 'text-[12px]'} w-full text-gray-500`}
                numberOfLines={1}>
                {habit.completedDays}/{habit.totalDays} {t('share:minimal.weekly.daysCompleted')}
              </Text>
            </View>
            <Text
              className={`${isTablet ? 'text-[27px]' : 'text-[18px]'} flex-shrink-0 font-bold text-black`}
              numberOfLines={1}>
              {Math.round(habit.completionRate)}%
            </Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <Text className={`${isTablet ? 'text-[16px]' : 'text-[11px]'} mt-auto text-center text-gray-400`}>
        #{t('common:appName')}
      </Text>
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
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const templateWidth = isTablet ? Math.min(width * 0.75, 680) : width * 0.9;

  return (
    <View className="overflow-hidden rounded-3xl bg-white p-8" style={{ width: templateWidth }}>
      {/* Header */}
      <View className="mb-5 flex-row items-center justify-between">
        <Text className={`${isTablet ? 'text-[36px]' : 'text-[24px]'} font-bold text-black`}>
          {t('common:appName')}
        </Text>
        <Text className={`${isTablet ? 'text-[21px]' : 'text-[14px]'} text-gray-500`}>{stats.year}</Text>
      </View>

      {/* Hero Section */}
      <View className="mb-6 items-center border-b border-gray-200 pb-6">
        <Text
          className={`${isTablet ? 'text-[48px] leading-[57px]' : 'text-[32px] leading-[38px]'} mb-1 font-bold text-black`}>
          {stats.month}
        </Text>
        <Text className={`${isTablet ? 'text-[21px]' : 'text-[14px]'} text-gray-500`}>
          {t('share:minimal.monthly.monthlyReport')}
        </Text>
      </View>

      {/* Stats Grid */}
      <View className="mb-6 flex-row justify-around border-b border-gray-200 pb-6">
        <View className="items-center">
          <Text className={`${isTablet ? 'text-[54px]' : 'text-[36px]'} font-bold text-black`}>
            {Math.round(stats.averageCompletionRate)}%
          </Text>
          <Text className={`${isTablet ? 'text-[16px]' : 'text-[11px]'} mt-1 text-gray-500`}>
            {t('share:minimal.monthly.averageCompletionRate')}
          </Text>
        </View>
        <View className="items-center">
          <Text className={`${isTablet ? 'text-[54px]' : 'text-[36px]'} font-bold text-black`}>
            {stats.perfectDays}
          </Text>
          <Text className={`${isTablet ? 'text-[16px]' : 'text-[11px]'} mt-1 text-gray-500`}>
            {t('share:minimal.monthly.perfectDays')}
          </Text>
        </View>
        <View className="items-center">
          <Text className={`${isTablet ? 'text-[54px]' : 'text-[36px]'} font-bold text-black`}>
            {stats.maxStreak}
          </Text>
          <Text className={`${isTablet ? 'text-[16px]' : 'text-[11px]'} mt-1 text-gray-500`}>
            {t('share:minimal.monthly.maxStreak')}
          </Text>
        </View>
      </View>

      {/* Habits Section */}
      <View className="mb-5">
        <Text
          className={`${isTablet ? 'text-[18px]' : 'text-[12px]'} mb-4 font-semibold uppercase tracking-wider text-gray-500`}>
          {t('share:minimal.weekly.topHabits')}
        </Text>

        {stats.habits.slice(0, 3).map((habit, index) => (
          <View
            key={habit.id}
            className="mb-3 flex-row items-center gap-3 border-b border-gray-100 pb-3">
            <Text
              className={`${isTablet ? 'w-12 text-[27px]' : 'w-8 text-[18px]'} flex-shrink-0 font-bold text-gray-300`}>
              {String(index + 1).padStart(2, '0')}
            </Text>
            <View className="min-w-0 flex-1">
              <Text
                className={`${isTablet ? 'text-[22px]' : 'text-[15px]'} w-full font-semibold text-black`}
                numberOfLines={1}>
                {habit.name}
              </Text>
              <Text
                className={`${isTablet ? 'text-[16px]' : 'text-[11px]'} w-full text-gray-500`}
                numberOfLines={1}>
                {habit.completedDays} {t('share:minimal.monthly.timesCompleted')}{' '}
                {habit.streak > 0 && '🔥'}
              </Text>
            </View>
            <Text
              className={`${isTablet ? 'text-[24px]' : 'text-[16px]'} flex-shrink-0 font-bold text-black`}
              numberOfLines={1}>
              {Math.round(habit.completionRate)}%
            </Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <Text className={`${isTablet ? 'text-[16px]' : 'text-[11px]'} mt-auto text-center text-gray-400`}>
        #{t('common:appName')} #{stats.year}Wrapped
      </Text>
    </View>
  );
}
