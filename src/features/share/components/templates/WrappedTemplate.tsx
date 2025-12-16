import React from 'react';
import { View, Text } from 'react-native';
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

  return (
    <View className="w-[380px]">
      <LinearGradient
        colors={['#191414', '#121212']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingVertical: 32, paddingHorizontal: 32 }}>
        {/* Header */}
        <View className="mb-5 flex-row items-start justify-between">
          <Text className="text-[22px] font-extrabold text-white">{t('common:appName')}</Text>
          <View className="rounded-[20px] bg-[#1db954] px-[14px] py-[6px]">
            <Text className="text-[11px] font-bold text-black">WEEK {stats.weekNumber}</Text>
          </View>
        </View>

        {/* Intro Section */}
        <View className="mb-4">
          <Text className="mb-2 text-[13px] text-white/60">{t('share:wrapped.weekly.intro')}</Text>
          <Text className="text-[28px] font-extrabold leading-[34px] text-white">
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
          <Text className="mb-2 text-[11px] uppercase tracking-[2px] text-white/50">
            {t('share:wrapped.weekly.completionRate')}
          </Text>
          <Text className="text-[64px] font-black leading-[64px] text-[#1db954]">
            {Math.round(stats.completionRate)}%
          </Text>
          <Text className="mt-1 text-[13px] text-white/60">
            {stats.habits.length} {t('share:wrapped.weekly.averageAchievement')}
          </Text>
        </View>

        {/* Habits Section */}
        <View className="mb-4">
          <Text className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-[#1db954]">
            {t('share:wrapped.weekly.topHabits')}
          </Text>

          {stats.habits.slice(0, 3).map((habit, index) => (
            <View
              key={habit.id}
              className="border-white/6 flex-row items-center gap-4 border-b py-4">
              <Text className="w-8 flex-shrink-0 text-[18px] font-extrabold text-white/20">
                {String(index + 1).padStart(2, '0')}
              </Text>
              <View className="min-w-0 flex-1 items-start">
                <Text className="w-full text-[14px] font-semibold text-white" numberOfLines={1}>
                  {habit.name}
                </Text>
                <Text className="mt-[2px] w-full text-[10px] text-white/40" numberOfLines={1}>
                  {habit.completedDays}/{habit.totalDays} {t('share:wrapped.weekly.daysCompleted')}
                </Text>
              </View>
              <Text
                className="flex-shrink-0 text-[15px] font-bold text-[#1db954]"
                numberOfLines={1}>
                {Math.round(habit.completionRate)}%
              </Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text className="pt-3 text-[11px] text-white/30">#{t('common:appName')}</Text>
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

  // Extract month display based on language
  const monthDisplay =
    language === 'ko' && stats.month.includes('년 ')
      ? stats.month.split('년 ')[1] // Extract "12월" from "2025년 12월"
      : stats.month; // Use full format for other languages

  return (
    <View className="w-[380px]">
      <LinearGradient
        colors={['#1db954', '#169c46', '#121212']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ paddingVertical: 32, paddingHorizontal: 32 }}>
        {/* Header */}
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-[22px] font-extrabold text-black">{t('common:appName')}</Text>
          <Text className="text-[14px] font-bold text-black/60">{stats.year}</Text>
        </View>

        {/* Hero Section */}
        <View className="mb-3 items-center">
          <Text className="mb-2 text-[36px]">🏆</Text>
          <Text className="mb-1 text-center text-[26px] font-black leading-[32px] text-black">
            {t('share:wrapped.monthly.perfect')} {monthDisplay}
            {t('share:wrapped.monthly.monthSuffix')}
          </Text>
          <Text className="text-[12px] text-black/70">
            {t('share:wrapped.monthly.perseverance')}
          </Text>
        </View>

        {/* Stats Card */}
        <View className="mb-3 rounded-[20px] bg-black/15 p-4">
          <View className="mb-3 items-center">
            <Text className="text-[60px] font-black leading-[60px] text-white">
              {Math.round(stats.averageCompletionRate)}%
            </Text>
            <Text className="mt-1 text-[12px] text-white/80">
              {t('share:wrapped.monthly.averageCompletionRate')}
            </Text>
          </View>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-[22px] font-extrabold text-white">{stats.perfectDays}</Text>
              <Text className="mt-[2px] text-[10px] text-white/70">
                {t('share:wrapped.monthly.perfectDays')}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-[22px] font-extrabold text-white">{stats.maxStreak}</Text>
              <Text className="mt-[2px] text-[10px] text-white/70">
                {t('share:wrapped.monthly.maxStreak')}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-[22px] font-extrabold text-white">{stats.totalHabits}</Text>
              <Text className="mt-[2px] text-[10px] text-white/70">
                {t('share:wrapped.monthly.totalHabits')}
              </Text>
            </View>
          </View>
        </View>

        {/* Habits Section */}
        <View className="mb-2 rounded-[20px] bg-[#121212] p-3">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-[11px] font-bold text-[#1db954]">Top Habits</Text>
            <View className="rounded-[10px] bg-[#1db954]/20 px-[10px] py-1">
              <Text className="text-[10px] font-bold text-[#1db954]">🏆 MVP</Text>
            </View>
          </View>

          {stats.habits.slice(0, 3).map((habit, index) => (
            <View
              key={habit.id}
              className="border-white/6 flex-row items-center gap-4 border-b py-3.5">
              <Text
                className={`w-8 flex-shrink-0 text-[14px] font-bold ${index === 0 ? 'text-[#1db954]' : 'text-white/20'}`}>
                {String(index + 1).padStart(2, '0')}
              </Text>
              <View className="min-w-0 flex-1 items-start">
                <Text className="w-full text-[13px] font-semibold text-white" numberOfLines={1}>
                  {habit.name}
                </Text>
                <Text className="w-full text-[10px] text-white/40" numberOfLines={1}>
                  {habit.completedDays} {t('share:wrapped.monthly.timesCompleted')}{' '}
                  {habit.streak > 0 && `🔥`}
                </Text>
              </View>
              <View className="flex-shrink-0 rounded-lg bg-[#1db954]/15 px-[10px] py-1">
                <Text className="text-[11px] font-bold text-[#1db954]" numberOfLines={1}>
                  {Math.round(habit.completionRate)}%
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text className="mt-3 text-center text-[10px] text-white/30">
          #{t('common:appName')} #{stats.year}Wrapped
        </Text>
      </LinearGradient>
    </View>
  );
}
