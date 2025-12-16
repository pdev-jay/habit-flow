import React from 'react';
import { View, Text } from 'react-native';
import type { WeeklyStats, MonthlyStats } from '../../types/share.types';
import { useI18n } from '@/hooks';

interface BrutalistWeeklyProps {
  stats: WeeklyStats;
}

/**
 * Brutalist-style weekly template component
 * Bold, raw design with strong contrasts and thick borders
 */
export function BrutalistWeekly({ stats }: BrutalistWeeklyProps) {
  const { t } = useI18n();

  return (
    <View className="w-[380px] overflow-hidden rounded-3xl bg-white p-6">
      {/* Header */}
      <View className="mb-5 border-4 border-black bg-black p-3">
        <Text className="text-[24px] font-black uppercase text-white">
          {t('common:appName').toUpperCase()}
        </Text>
        <Text className="text-[12px] font-bold text-yellow-400">WEEK {stats.weekNumber}</Text>
      </View>

      {/* Hero Section */}
      <View className="mb-5 border-4 border-black p-6">
        <Text className="text-[14px] font-bold uppercase text-black">
          {t('share:brutalist.weekly.achievement')}
        </Text>
        <Text className="mt-2 text-[88px] font-black leading-[88px] text-black">
          {Math.round(stats.completionRate)}
          <Text className="text-[48px]">%</Text>
        </Text>
        <View className="mt-3 h-1 bg-black" />
        <Text className="mt-2 text-[14px] font-bold text-black">
          {stats.completedCount} / {stats.totalCount} {t('share:brutalist.weekly.done')}
        </Text>
      </View>

      {/* Habits Section */}
      <View className="mb-4 border-4 border-black bg-yellow-400 p-4">
        <Text className="mb-3 text-[13px] font-black uppercase text-black">TOP 3</Text>

        {stats.habits.slice(0, 3).map((habit, index) => (
          <View key={habit.id} className="mb-3 border-b-2 border-black pb-3 last:border-b-0">
            <View className="flex-row items-center gap-3">
              <Text className="flex-shrink-0 text-[24px] font-black text-black">{index + 1}.</Text>
              <View className="min-w-0 flex-1">
                <Text
                  className="w-full text-[15px] font-bold uppercase text-black"
                  numberOfLines={1}>
                  {habit.name}
                </Text>
                <Text className="w-full text-[11px] font-bold text-black/70" numberOfLines={1}>
                  {habit.completedDays}/{habit.totalDays} DAYS
                </Text>
              </View>
              <View className="border-2 border-black bg-black px-2 py-1">
                <Text className="text-[14px] font-black text-yellow-400" numberOfLines={1}>
                  {Math.round(habit.completionRate)}%
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View className="mt-auto border-2 border-black bg-black p-2">
        <Text className="text-center text-[10px] font-bold text-white">
          #{t('common:appName').toUpperCase()}
        </Text>
      </View>
    </View>
  );
}

interface BrutalistMonthlyProps {
  stats: MonthlyStats;
}

/**
 * Brutalist-style monthly template component
 * Bold, raw design with strong contrasts and thick borders
 */
export function BrutalistMonthly({ stats }: BrutalistMonthlyProps) {
  const { t } = useI18n();

  return (
    <View className="w-[380px] overflow-hidden rounded-3xl bg-yellow-400 p-6">
      {/* Header */}
      <View className="mb-4 border-4 border-black bg-black p-3">
        <Text className="text-[24px] font-black uppercase text-yellow-400">
          {t('common:appName').toUpperCase()}
        </Text>
        <Text className="text-[12px] font-bold text-white">
          {stats.year} {t('share:brutalist.monthly.report')}
        </Text>
      </View>

      {/* Hero Section */}
      <View className="mb-4 border-4 border-black bg-white p-4">
        <Text className="text-center text-[26px] font-black uppercase text-black">
          {stats.month}
        </Text>
      </View>

      {/* Stats Section */}
      <View className="mb-4 border-4 border-black bg-black p-5">
        <View className="mb-4 items-center">
          <Text className="text-[72px] font-black leading-[72px] text-yellow-400">
            {Math.round(stats.averageCompletionRate)}
            <Text className="text-[40px]">%</Text>
          </Text>
          <Text className="mt-1 text-[11px] font-bold text-white">
            {t('share:brutalist.monthly.average')}
          </Text>
        </View>
        <View className="h-1 bg-yellow-400" />
        <View className="mt-4 flex-row justify-around">
          <View className="items-center">
            <Text className="text-[32px] font-black text-yellow-400">{stats.perfectDays}</Text>
            <Text className="text-[9px] font-bold uppercase text-white">
              {t('share:brutalist.monthly.perfect')}
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-[32px] font-black text-yellow-400">{stats.maxStreak}</Text>
            <Text className="text-[9px] font-bold uppercase text-white">
              {t('share:brutalist.monthly.streak')}
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-[32px] font-black text-yellow-400">{stats.totalHabits}</Text>
            <Text className="text-[9px] font-bold uppercase text-white">
              {t('share:brutalist.monthly.habits')}
            </Text>
          </View>
        </View>
      </View>

      {/* Habits Section */}
      <View className="mb-3 border-4 border-black bg-white p-4">
        <Text className="mb-3 text-[12px] font-black uppercase text-black">
          {t('share:brutalist.monthly.topHabits')}
        </Text>

        {stats.habits.slice(0, 3).map((habit, index) => (
          <View key={habit.id} className="mb-2.5 border-b-2 border-black pb-2.5 last:border-b-0">
            <View className="flex-row items-center gap-2">
              <Text className="flex-shrink-0 text-[20px] font-black text-black">{index + 1}.</Text>
              <View className="min-w-0 flex-1">
                <Text
                  className="w-full text-[14px] font-bold uppercase text-black"
                  numberOfLines={1}>
                  {habit.name}
                </Text>
                <Text className="w-full text-[10px] font-bold text-black/60" numberOfLines={1}>
                  {habit.completedDays} {t('share:brutalist.monthly.times')}{' '}
                  {habit.streak > 0 && '🔥'}
                </Text>
              </View>
              <View className="border-2 border-black bg-black px-2 py-0.5">
                <Text className="text-[13px] font-black text-yellow-400" numberOfLines={1}>
                  {Math.round(habit.completionRate)}%
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View className="mt-auto border-2 border-black bg-black px-3 py-2">
        <Text className="text-center text-[10px] font-bold text-yellow-400">
          #{t('common:appName').toUpperCase()} #{stats.year}
        </Text>
      </View>
    </View>
  );
}
