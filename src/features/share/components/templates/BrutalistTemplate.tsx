import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
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
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const templateWidth = isTablet ? Math.min(width * 0.75, 680) : width * 0.9;

  return (
    <View className="overflow-hidden rounded-3xl bg-white p-6" style={{ width: templateWidth }}>
      {/* Header */}
      <View className="mb-5 border-4 border-black bg-black p-3">
        <Text className={`${isTablet ? 'text-[36px]' : 'text-[24px]'} font-black uppercase text-white`}>
          {t('common:appName').toUpperCase()}
        </Text>
        <Text className={`${isTablet ? 'text-[18px]' : 'text-[12px]'} font-bold text-yellow-400`}>
          WEEK {stats.weekNumber}
        </Text>
      </View>

      {/* Hero Section */}
      <View className="mb-5 border-4 border-black p-6">
        <Text className={`${isTablet ? 'text-[21px]' : 'text-[14px]'} font-bold uppercase text-black`}>
          {t('share:brutalist.weekly.achievement')}
        </Text>
        <Text
          className={`${isTablet ? 'text-[132px] leading-[132px]' : 'text-[88px] leading-[88px]'} mt-2 font-black text-black`}>
          {Math.round(stats.completionRate)}
          <Text className={`${isTablet ? 'text-[72px]' : 'text-[48px]'}`}>%</Text>
        </Text>
        <View className="mt-3 h-1 bg-black" />
        <Text className={`${isTablet ? 'text-[21px]' : 'text-[14px]'} mt-2 font-bold text-black`}>
          {stats.completedCount} / {stats.totalCount} {t('share:brutalist.weekly.done')}
        </Text>
      </View>

      {/* Habits Section */}
      <View className="mb-4 border-4 border-black bg-yellow-400 p-4">
        <Text className={`${isTablet ? 'text-[20px]' : 'text-[13px]'} mb-3 font-black uppercase text-black`}>
          TOP 3
        </Text>

        {stats.habits.slice(0, 3).map((habit, index) => (
          <View key={habit.id} className="mb-3 border-b-2 border-black pb-3 last:border-b-0">
            <View className="flex-row items-center gap-3">
              <Text
                className={`${isTablet ? 'text-[36px]' : 'text-[24px]'} flex-shrink-0 font-black text-black`}>
                {index + 1}.
              </Text>
              <View className="min-w-0 flex-1">
                <Text
                  className={`${isTablet ? 'text-[22px]' : 'text-[15px]'} w-full font-bold uppercase text-black`}
                  numberOfLines={1}>
                  {habit.name}
                </Text>
                <Text
                  className={`${isTablet ? 'text-[16px]' : 'text-[11px]'} w-full font-bold text-black/70`}
                  numberOfLines={1}>
                  {habit.completedDays}/{habit.totalDays} DAYS
                </Text>
              </View>
              <View className="border-2 border-black bg-black px-2 py-1">
                <Text
                  className={`${isTablet ? 'text-[21px]' : 'text-[14px]'} font-black text-yellow-400`}
                  numberOfLines={1}>
                  {Math.round(habit.completionRate)}%
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View className="mt-auto border-2 border-black bg-black p-2">
        <Text className={`${isTablet ? 'text-[15px]' : 'text-[10px]'} text-center font-bold text-white`}>
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
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const templateWidth = isTablet ? Math.min(width * 0.75, 680) : width * 0.9;

  return (
    <View className="overflow-hidden rounded-3xl bg-yellow-400 p-6" style={{ width: templateWidth }}>
      {/* Header */}
      <View className="mb-4 border-4 border-black bg-black p-3">
        <Text className={`${isTablet ? 'text-[36px]' : 'text-[24px]'} font-black uppercase text-yellow-400`}>
          {t('common:appName').toUpperCase()}
        </Text>
        <Text className={`${isTablet ? 'text-[18px]' : 'text-[12px]'} font-bold text-white`}>
          {stats.year} {t('share:brutalist.monthly.report')}
        </Text>
      </View>

      {/* Hero Section */}
      <View className="mb-4 border-4 border-black bg-white p-4">
        <Text className={`${isTablet ? 'text-[39px]' : 'text-[26px]'} text-center font-black uppercase text-black`}>
          {stats.month}
        </Text>
      </View>

      {/* Stats Section */}
      <View className="mb-4 border-4 border-black bg-black p-5">
        <View className="mb-4 items-center">
          <Text
            className={`${isTablet ? 'text-[108px] leading-[108px]' : 'text-[72px] leading-[72px]'} font-black text-yellow-400`}>
            {Math.round(stats.averageCompletionRate)}
            <Text className={`${isTablet ? 'text-[60px]' : 'text-[40px]'}`}>%</Text>
          </Text>
          <Text className={`${isTablet ? 'text-[16px]' : 'text-[11px]'} mt-1 font-bold text-white`}>
            {t('share:brutalist.monthly.average')}
          </Text>
        </View>
        <View className="h-1 bg-yellow-400" />
        <View className="mt-4 flex-row justify-around">
          <View className="items-center">
            <Text className={`${isTablet ? 'text-[48px]' : 'text-[32px]'} font-black text-yellow-400`}>
              {stats.perfectDays}
            </Text>
            <Text className={`${isTablet ? 'text-[13px]' : 'text-[9px]'} font-bold uppercase text-white`}>
              {t('share:brutalist.monthly.perfect')}
            </Text>
          </View>
          <View className="items-center">
            <Text className={`${isTablet ? 'text-[48px]' : 'text-[32px]'} font-black text-yellow-400`}>
              {stats.maxStreak}
            </Text>
            <Text className={`${isTablet ? 'text-[13px]' : 'text-[9px]'} font-bold uppercase text-white`}>
              {t('share:brutalist.monthly.streak')}
            </Text>
          </View>
          <View className="items-center">
            <Text className={`${isTablet ? 'text-[48px]' : 'text-[32px]'} font-black text-yellow-400`}>
              {stats.totalHabits}
            </Text>
            <Text className={`${isTablet ? 'text-[13px]' : 'text-[9px]'} font-bold uppercase text-white`}>
              {t('share:brutalist.monthly.habits')}
            </Text>
          </View>
        </View>
      </View>

      {/* Habits Section */}
      <View className="mb-3 border-4 border-black bg-white p-4">
        <Text className={`${isTablet ? 'text-[18px]' : 'text-[12px]'} mb-3 font-black uppercase text-black`}>
          {t('share:brutalist.monthly.topHabits')}
        </Text>

        {stats.habits.slice(0, 3).map((habit, index) => (
          <View key={habit.id} className="mb-2.5 border-b-2 border-black pb-2.5 last:border-b-0">
            <View className="flex-row items-center gap-2">
              <Text className={`${isTablet ? 'text-[30px]' : 'text-[20px]'} flex-shrink-0 font-black text-black`}>
                {index + 1}.
              </Text>
              <View className="min-w-0 flex-1">
                <Text
                  className={`${isTablet ? 'text-[21px]' : 'text-[14px]'} w-full font-bold uppercase text-black`}
                  numberOfLines={1}>
                  {habit.name}
                </Text>
                <Text
                  className={`${isTablet ? 'text-[15px]' : 'text-[10px]'} w-full font-bold text-black/60`}
                  numberOfLines={1}>
                  {habit.completedDays} {t('share:brutalist.monthly.times')}{' '}
                  {habit.streak > 0 && '🔥'}
                </Text>
              </View>
              <View className="border-2 border-black bg-black px-2 py-0.5">
                <Text
                  className={`${isTablet ? 'text-[20px]' : 'text-[13px]'} font-black text-yellow-400`}
                  numberOfLines={1}>
                  {Math.round(habit.completionRate)}%
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View className="mt-auto border-2 border-black bg-black px-3 py-2">
        <Text className={`${isTablet ? 'text-[15px]' : 'text-[10px]'} text-center font-bold text-yellow-400`}>
          #{t('common:appName').toUpperCase()} #{stats.year}
        </Text>
      </View>
    </View>
  );
}
