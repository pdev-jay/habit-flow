import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useI18n } from '@/hooks';
import type { WeeklyStats, MonthlyStats } from '../../types/share.types';

interface WrappedWeeklyProps {
  stats: WeeklyStats;
}

/**
 * Wrapped-style weekly template component
 * Spotify Wrapped-inspired design with gradient backgrounds
 */
export function WrappedWeekly({ stats }: WrappedWeeklyProps) {
  const { t } = useI18n();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const templateWidth = isTablet ? Math.min(width * 0.75, 680) : width * 0.9;

  return (
    <View className="overflow-hidden rounded-3xl" style={{ width: templateWidth }}>
      <LinearGradient
        colors={['#191414', '#121212']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingVertical: 32, paddingHorizontal: 32, borderRadius: 24 }}>
        {/* Header */}
        <View className="mb-5 flex-row items-start justify-between">
          <Text className={`${isTablet ? 'text-[32px]' : 'text-[22px]'} font-extrabold text-white`}>
            {t('common:appName')}
          </Text>
          <View className="rounded-[20px] bg-[#1db954] px-[14px] py-[6px]">
            <Text className={`${isTablet ? 'text-[16px]' : 'text-[11px]'} font-bold text-black`}>
              WEEK {stats.weekNumber}
            </Text>
          </View>
        </View>

        {/* Intro Section */}
        <View className="mb-4">
          <Text className={`${isTablet ? 'text-[20px]' : 'text-[13px]'} mb-2 text-white/60`}>
            {t('share:wrapped.weekly.intro')}
          </Text>
          <Text
            className={`${isTablet ? 'text-[42px] leading-[48px]' : 'text-[28px] leading-[34px]'} font-extrabold text-white`}>
            <Text className="text-[#1db954]">
              {stats.completedCount} {t('share:wrapped.weekly.habitsCompleted')}
            </Text>
            {t('share:wrapped.weekly.ofHabits')}
            {'\n'}
            {t('share:wrapped.weekly.completed')}
          </Text>
        </View>

        {/* Hero Card */}
        <View className="border-white/8 mb-4 rounded-2xl border bg-white/5 p-5">
          <Text
            className={`${isTablet ? 'text-[16px]' : 'text-[11px]'} mb-2 uppercase tracking-[2px] text-white/50`}>
            {t('share:wrapped.weekly.completionRate')}
          </Text>
          <Text
            className={`${isTablet ? 'text-[96px] leading-[96px]' : 'text-[64px] leading-[64px]'} font-black text-[#1db954]`}>
            {Math.round(stats.completionRate)}%
          </Text>
          <Text className={`${isTablet ? 'text-[20px]' : 'text-[13px]'} mt-1 text-white/60`}>
            {stats.habits.length} {t('share:wrapped.weekly.averageAchievement')}
          </Text>
        </View>

        {/* Habits Section */}
        <View className="mb-4">
          <Text
            className={`${isTablet ? 'text-[16px]' : 'text-[11px]'} mb-3 font-bold uppercase tracking-[2px] text-[#1db954]`}>
            {t('share:wrapped.weekly.topHabits')}
          </Text>

          {stats.habits.slice(0, 3).map((habit, index) => (
            <View
              key={habit.id}
              className="border-white/6 flex-row items-center justify-between gap-4 border-b py-4">
              <View className="flex-row items-center gap-4">
                <Text
                  className={`${isTablet ? 'w-12 text-[27px]' : 'w-8 text-[18px]'} flex-shrink-0 font-extrabold text-white/20`}>
                  {String(index + 1).padStart(2, '0')}
                </Text>
                <View className="min-w-0 items-start">
                  <Text
                    className={`${isTablet ? 'text-[21px]' : 'text-[14px]'} font-semibold text-white`}
                    numberOfLines={1}>
                    {habit.name}
                  </Text>
                  <Text
                    className={`${isTablet ? 'text-[15px]' : 'text-[10px]'} mt-[2px] text-white/40`}
                    numberOfLines={1}>
                    {habit.completedDays}/{habit.totalDays} {t('share:wrapped.weekly.daysCompleted')}
                  </Text>
                </View>
              </View>
              <Text
                className={`${isTablet ? 'text-[22px]' : 'text-[15px]'} flex-shrink-0 font-bold text-[#1db954]`}
                numberOfLines={1}>
                {Math.round(habit.completionRate)}%
              </Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text className={`${isTablet ? 'text-[16px]' : 'text-[11px]'} pt-3 text-white/30`}>
          #{t('common:appName')}
        </Text>
      </LinearGradient>
    </View>
  );
}

interface WrappedMonthlyProps {
  stats: MonthlyStats;
}

/**
 * Wrapped-style monthly template component
 * Spotify Wrapped-inspired design with gradient backgrounds
 */
export function WrappedMonthly({ stats }: WrappedMonthlyProps) {
  const { t, language } = useI18n();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const templateWidth = isTablet ? Math.min(width * 0.75, 680) : width * 0.9;

  // Extract month display based on language
  const monthDisplay =
    language === 'ko' && stats.month.includes('년 ')
      ? stats.month.split('년 ')[1] // Extract "12월" from "2025년 12월"
      : stats.month; // Use full format for other languages

  return (
    <View className="overflow-hidden rounded-3xl" style={{ width: templateWidth }}>
      <LinearGradient
        colors={['#1db954', '#169c46', '#121212']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ paddingVertical: 32, paddingHorizontal: 32, borderRadius: 24 }}>
        {/* Header */}
        <View className="mb-3 flex-row items-center justify-between">
          <Text className={`${isTablet ? 'text-[32px]' : 'text-[22px]'} font-extrabold text-black`}>
            {t('common:appName')}
          </Text>
          <Text className={`${isTablet ? 'text-[21px]' : 'text-[14px]'} font-bold text-black/60`}>
            {stats.year}
          </Text>
        </View>

        {/* Hero Section */}
        <View className="mb-3 items-center">
          <Text className={`${isTablet ? 'text-[54px]' : 'text-[36px]'} mb-2`}>🏆</Text>
          <Text
            className={`${isTablet ? 'text-[39px] leading-[45px]' : 'text-[26px] leading-[32px]'} mb-1 text-center font-black text-black`}>
            {t('share:wrapped.monthly.perfect')} {monthDisplay}
            {t('share:wrapped.monthly.monthSuffix')}
          </Text>
          <Text className={`${isTablet ? 'text-[18px]' : 'text-[12px]'} text-black/70`}>
            {t('share:wrapped.monthly.perseverance')}
          </Text>
        </View>

        {/* Stats Card */}
        <View className="mb-3 rounded-[20px] bg-black/15 p-4">
          <View className="mb-3 items-center">
            <Text
              className={`${isTablet ? 'text-[90px] leading-[90px]' : 'text-[60px] leading-[60px]'} font-black text-white`}>
              {Math.round(stats.averageCompletionRate)}%
            </Text>
            <Text className={`${isTablet ? 'text-[18px]' : 'text-[12px]'} mt-1 text-white/80`}>
              {t('share:wrapped.monthly.averageCompletionRate')}
            </Text>
          </View>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className={`${isTablet ? 'text-[33px]' : 'text-[22px]'} font-extrabold text-white`}>
                {stats.perfectDays}
              </Text>
              <Text className={`${isTablet ? 'text-[15px]' : 'text-[10px]'} mt-[2px] text-white/70`}>
                {t('share:wrapped.monthly.perfectDays')}
              </Text>
            </View>
            <View className="items-center">
              <Text className={`${isTablet ? 'text-[33px]' : 'text-[22px]'} font-extrabold text-white`}>
                {stats.maxStreak}
              </Text>
              <Text className={`${isTablet ? 'text-[15px]' : 'text-[10px]'} mt-[2px] text-white/70`}>
                {t('share:wrapped.monthly.maxStreak')}
              </Text>
            </View>
            <View className="items-center">
              <Text className={`${isTablet ? 'text-[33px]' : 'text-[22px]'} font-extrabold text-white`}>
                {stats.totalHabits}
              </Text>
              <Text className={`${isTablet ? 'text-[15px]' : 'text-[10px]'} mt-[2px] text-white/70`}>
                {t('share:wrapped.monthly.totalHabits')}
              </Text>
            </View>
          </View>
        </View>

        {/* Habits Section */}
        <View className="mb-2 rounded-[20px] bg-[#121212] p-3">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className={`${isTablet ? 'text-[16px]' : 'text-[11px]'} font-bold text-[#1db954]`}>
              Top Habits
            </Text>
            <View className="rounded-[10px] bg-[#1db954]/20 px-[10px] py-1">
              <Text className={`${isTablet ? 'text-[15px]' : 'text-[10px]'} font-bold text-[#1db954]`}>
                🏆 MVP
              </Text>
            </View>
          </View>

          {stats.habits.slice(0, 3).map((habit, index) => (
            <View
              key={habit.id}
              className="border-white/6 flex-row items-center justify-between gap-4 border-b py-3.5">
              <View className="flex-row items-center gap-4">
                <Text
                  className={`${isTablet ? 'w-12 text-[21px]' : 'w-8 text-[14px]'} flex-shrink-0 font-bold ${index === 0 ? 'text-[#1db954]' : 'text-white/20'}`}>
                  {String(index + 1).padStart(2, '0')}
                </Text>
                <View className="min-w-0 items-start">
                  <Text
                    className={`${isTablet ? 'text-[20px]' : 'text-[13px]'} font-semibold text-white`}
                    numberOfLines={1}>
                    {habit.name}
                  </Text>
                  <Text
                    className={`${isTablet ? 'text-[15px]' : 'text-[10px]'} text-white/40`}
                    numberOfLines={1}>
                    {habit.completedDays} {t('share:wrapped.monthly.timesCompleted')}{' '}
                    {habit.streak > 0 && `🔥`}
                  </Text>
                </View>
              </View>
              <View className="flex-shrink-0 rounded-lg bg-[#1db954]/15 px-[10px] py-1">
                <Text
                  className={`${isTablet ? 'text-[17px]' : 'text-[11px]'} font-bold text-[#1db954]`}
                  numberOfLines={1}>
                  {Math.round(habit.completionRate)}%
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text className={`${isTablet ? 'text-[15px]' : 'text-[10px]'} mt-3 text-center text-white/30`}>
          #{t('common:appName')} #{stats.year}Wrapped
        </Text>
      </LinearGradient>
    </View>
  );
}
