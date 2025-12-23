import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { WeeklyStats, MonthlyStats } from '../../types/share.types';
import { useI18n } from '@/hooks';

interface GlassmorphismWeeklyProps {
  stats: WeeklyStats;
}

/**
 * Glassmorphism-style weekly template component
 * Semi-transparent glass effect with soft gradients
 */
export function GlassmorphismWeekly({ stats }: GlassmorphismWeeklyProps) {
  const { t } = useI18n();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const templateWidth = isTablet ? Math.min(width * 0.75, 680) : width * 0.9;

  return (
    <View className="overflow-hidden rounded-3xl" style={{ width: templateWidth }}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingVertical: 32, paddingHorizontal: 32, borderRadius: 24 }}>
        {/* Header */}
        <View className="mb-5 flex-row items-center justify-between">
          <Text className={`${isTablet ? 'text-[32px]' : 'text-[22px]'} font-bold text-white`}>
            {t('common:appName')}
          </Text>
          <View className="rounded-full bg-white/20 px-3 py-1">
            <Text className={`${isTablet ? 'text-[16px]' : 'text-[11px]'} font-semibold text-white`}>
              WEEK {stats.weekNumber}
            </Text>
          </View>
        </View>

        {/* Glass Card - Hero */}
        <View className="mb-5 rounded-3xl border border-white/30 bg-white/10 p-6">
          <Text
            className={`${isTablet ? 'text-[20px]' : 'text-[13px]'} mb-3 uppercase tracking-wider text-white/70`}>
            {t('share:glassmorphism.weekly.completionRate')}
          </Text>
          <Text
            className={`${isTablet ? 'text-[120px] leading-[120px]' : 'text-[80px] leading-[80px]'} font-black text-white`}>
            {Math.round(stats.completionRate)}%
          </Text>
          <Text className={`${isTablet ? 'text-[21px]' : 'text-[14px]'} mt-2 text-white/80`}>
            {stats.completedCount} {t('share:glassmorphism.weekly.habitsCompleted')}
          </Text>
        </View>

        {/* Glass Card - Habits */}
        <View className="mb-4 rounded-3xl border border-white/30 bg-white/10 p-5">
          <Text
            className={`${isTablet ? 'text-[16px]' : 'text-[11px]'} mb-4 font-bold uppercase tracking-wider text-white/70`}>
            {t('share:glassmorphism.weekly.topHabits')}
          </Text>

          {stats.habits.slice(0, 3).map((habit, index) => (
            <View key={habit.id} className="mb-4 border-b border-white/20 pb-4 last:border-b-0">
              <View className="flex-row items-center gap-4">
                <Text
                  className={`${isTablet ? 'w-12 text-[24px]' : 'w-8 text-[16px]'} flex-shrink-0 font-bold text-white/50`}>
                  {String(index + 1).padStart(2, '0')}
                </Text>
                <View className="min-w-0 flex-1">
                  <Text
                    className={`${isTablet ? 'text-[21px]' : 'text-[14px]'} w-full font-semibold text-white`}
                    numberOfLines={1}>
                    {habit.name}
                  </Text>
                  <Text
                    className={`${isTablet ? 'text-[16px]' : 'text-[11px]'} w-full text-white/60`}
                    numberOfLines={1}>
                    {habit.completedDays}/{habit.totalDays} {t('share:glassmorphism.weekly.days')}
                  </Text>
                </View>
                <View className="rounded-full bg-white/20 px-3 py-1">
                  <Text
                    className={`${isTablet ? 'text-[18px]' : 'text-[12px]'} font-bold text-white`}
                    numberOfLines={1}>
                    {Math.round(habit.completionRate)}%
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text className={`${isTablet ? 'text-[16px]' : 'text-[11px]'} mt-auto text-center text-white/50`}>
          #{t('common:appName')}
        </Text>
      </LinearGradient>
    </View>
  );
}

interface GlassmorphismMonthlyProps {
  stats: MonthlyStats;
}

/**
 * Glassmorphism-style monthly template component
 * Semi-transparent glass effect with soft gradients
 */
export function GlassmorphismMonthly({ stats }: GlassmorphismMonthlyProps) {
  const { t } = useI18n();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const templateWidth = isTablet ? Math.min(width * 0.75, 680) : width * 0.9;

  return (
    <View className="overflow-hidden rounded-3xl" style={{ width: templateWidth }}>
      <LinearGradient
        colors={['#fbc2eb', '#a6c1ee', '#c2e9fb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ paddingVertical: 32, paddingHorizontal: 32, borderRadius: 24 }}>
        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text className={`${isTablet ? 'text-[32px]' : 'text-[22px]'} font-bold text-gray-800`}>
            {t('common:appName')}
          </Text>
          <Text className={`${isTablet ? 'text-[20px]' : 'text-[13px]'} font-semibold text-gray-600`}>
            {stats.year}
          </Text>
        </View>

        {/* Glass Card - Hero */}
        <View className="mb-4 items-center rounded-3xl border border-white/50 bg-white/20 p-5">
          <Text className={`${isTablet ? 'text-[42px]' : 'text-[28px]'} mb-1 font-black text-gray-800`}>
            {stats.month}
          </Text>
          <Text className={`${isTablet ? 'text-[18px]' : 'text-[12px]'} text-gray-600`}>
            {t('share:glassmorphism.monthly.monthlyReport')}
          </Text>
        </View>

        {/* Glass Card - Stats */}
        <View className="mb-4 rounded-3xl border border-white/50 bg-white/20 p-5">
          <View className="mb-4 items-center">
            <Text
              className={`${isTablet ? 'text-[96px] leading-[96px]' : 'text-[64px] leading-[64px]'} font-black text-gray-800`}>
              {Math.round(stats.averageCompletionRate)}%
            </Text>
            <Text className={`${isTablet ? 'text-[18px]' : 'text-[12px]'} mt-1 text-gray-600`}>
              {t('share:glassmorphism.monthly.averageCompletionRate')}
            </Text>
          </View>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className={`${isTablet ? 'text-[42px]' : 'text-[28px]'} font-bold text-gray-800`}>
                {stats.perfectDays}
              </Text>
              <Text className={`${isTablet ? 'text-[15px]' : 'text-[10px]'} text-gray-600`}>
                {t('share:glassmorphism.monthly.perfectDays')}
              </Text>
            </View>
            <View className="items-center">
              <Text className={`${isTablet ? 'text-[42px]' : 'text-[28px]'} font-bold text-gray-800`}>
                {stats.maxStreak}
              </Text>
              <Text className={`${isTablet ? 'text-[15px]' : 'text-[10px]'} text-gray-600`}>
                {t('share:glassmorphism.monthly.maxStreak')}
              </Text>
            </View>
            <View className="items-center">
              <Text className={`${isTablet ? 'text-[42px]' : 'text-[28px]'} font-bold text-gray-800`}>
                {stats.totalHabits}
              </Text>
              <Text className={`${isTablet ? 'text-[15px]' : 'text-[10px]'} text-gray-600`}>
                {t('share:glassmorphism.monthly.totalHabits')}
              </Text>
            </View>
          </View>
        </View>

        {/* Glass Card - Habits */}
        <View className="mb-3 rounded-3xl border border-white/50 bg-white/20 p-4">
          <Text
            className={`${isTablet ? 'text-[16px]' : 'text-[11px]'} mb-3 font-bold uppercase tracking-wider text-gray-700`}>
            {t('share:glassmorphism.weekly.topHabits')}
          </Text>

          {stats.habits.slice(0, 3).map((habit, index) => (
            <View key={habit.id} className="mb-3 border-b border-white/30 pb-3 last:border-b-0">
              <View className="flex-row items-center gap-3">
                <Text
                  className={`${isTablet ? 'w-12 text-[21px]' : 'w-8 text-[14px]'} flex-shrink-0 font-bold text-gray-500`}>
                  {String(index + 1).padStart(2, '0')}
                </Text>
                <View className="min-w-0 flex-1">
                  <Text
                    className={`${isTablet ? 'text-[20px]' : 'text-[13px]'} w-full font-semibold text-gray-800`}
                    numberOfLines={1}>
                    {habit.name}
                  </Text>
                  <Text
                    className={`${isTablet ? 'text-[15px]' : 'text-[10px]'} w-full text-gray-600`}
                    numberOfLines={1}>
                    {habit.completedDays} {t('share:glassmorphism.monthly.times')}{' '}
                    {habit.streak > 0 && '🔥'}
                  </Text>
                </View>
                <View className="rounded-full bg-white/30 px-2.5 py-1">
                  <Text
                    className={`${isTablet ? 'text-[16px]' : 'text-[11px]'} font-bold text-gray-800`}
                    numberOfLines={1}>
                    {Math.round(habit.completionRate)}%
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text className={`${isTablet ? 'text-[15px]' : 'text-[10px]'} mt-auto text-center text-gray-600`}>
          #{t('common:appName')} #{stats.year}Wrapped
        </Text>
      </LinearGradient>
    </View>
  );
}
