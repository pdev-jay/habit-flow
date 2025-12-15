import React from 'react';
import { View, Text } from 'react-native';
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

  return (
    <View className="w-[380px]">
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingVertical: 32, paddingHorizontal: 32 }}>
        {/* Header */}
        <View className="mb-5 flex-row items-center justify-between">
          <Text className="text-[22px] font-bold text-white">{t('common:appName')}</Text>
          <View className="rounded-full bg-white/20 px-3 py-1">
            <Text className="text-[11px] font-semibold text-white">WEEK {stats.weekNumber}</Text>
          </View>
        </View>

        {/* Glass Card - Hero */}
        <View className="mb-5 rounded-3xl border border-white/30 bg-white/10 p-6">
          <Text className="mb-3 text-[13px] uppercase tracking-wider text-white/70">
            {t('share:glassmorphism.weekly.completionRate')}
          </Text>
          <Text className="text-[80px] font-black leading-[80px] text-white">
            {Math.round(stats.completionRate)}%
          </Text>
          <Text className="mt-2 text-[14px] text-white/80">
            {stats.completedCount}
            {t('share:glassmorphism.weekly.habitsCompleted')}
          </Text>
        </View>

        {/* Glass Card - Habits */}
        <View className="mb-4 rounded-3xl border border-white/30 bg-white/10 p-5">
          <Text className="mb-4 text-[11px] font-bold uppercase tracking-wider text-white/70">
            {t('share:glassmorphism.weekly.topHabits')}
          </Text>

          {stats.habits.slice(0, 3).map((habit, index) => (
            <View key={habit.id} className="mb-4 border-b border-white/20 pb-4 last:border-b-0">
              <View className="flex-row items-center gap-4">
                <Text className="w-8 flex-shrink-0 text-[16px] font-bold text-white/50">
                  {String(index + 1).padStart(2, '0')}
                </Text>
                <View className="min-w-0 flex-1">
                  <Text className="w-full text-[14px] font-semibold text-white" numberOfLines={1}>
                    {habit.name}
                  </Text>
                  <Text className="w-full text-[11px] text-white/60" numberOfLines={1}>
                    {habit.completedDays}/{habit.totalDays}
                    {t('share:glassmorphism.weekly.days')}
                  </Text>
                </View>
                <View className="rounded-full bg-white/20 px-3 py-1">
                  <Text className="text-[12px] font-bold text-white" numberOfLines={1}>
                    {Math.round(habit.completionRate)}%
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text className="mt-auto text-center text-[11px] text-white/50">
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

  return (
    <View className="w-[380px]">
      <LinearGradient
        colors={['#fbc2eb', '#a6c1ee', '#c2e9fb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ paddingVertical: 32, paddingHorizontal: 32 }}>
        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-[22px] font-bold text-gray-800">{t('common:appName')}</Text>
          <Text className="text-[13px] font-semibold text-gray-600">{stats.year}</Text>
        </View>

        {/* Glass Card - Hero */}
        <View className="mb-4 items-center rounded-3xl border border-white/50 bg-white/20 p-5">
          <Text className="mb-1 text-[28px] font-black text-gray-800">{stats.month}</Text>
          <Text className="text-[12px] text-gray-600">
            {t('share:glassmorphism.monthly.monthlyReport')}
          </Text>
        </View>

        {/* Glass Card - Stats */}
        <View className="mb-4 rounded-3xl border border-white/50 bg-white/20 p-5">
          <View className="mb-4 items-center">
            <Text className="text-[64px] font-black leading-[64px] text-gray-800">
              {Math.round(stats.averageCompletionRate)}%
            </Text>
            <Text className="mt-1 text-[12px] text-gray-600">
              {t('share:glassmorphism.monthly.averageCompletionRate')}
            </Text>
          </View>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-[28px] font-bold text-gray-800">{stats.perfectDays}</Text>
              <Text className="text-[10px] text-gray-600">
                {t('share:glassmorphism.monthly.perfectDays')}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-[28px] font-bold text-gray-800">{stats.maxStreak}</Text>
              <Text className="text-[10px] text-gray-600">
                {t('share:glassmorphism.monthly.maxStreak')}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-[28px] font-bold text-gray-800">{stats.totalHabits}</Text>
              <Text className="text-[10px] text-gray-600">
                {t('share:glassmorphism.monthly.totalHabits')}
              </Text>
            </View>
          </View>
        </View>

        {/* Glass Card - Habits */}
        <View className="mb-3 rounded-3xl border border-white/50 bg-white/20 p-4">
          <Text className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-700">
            {t('share:glassmorphism.weekly.topHabits')}
          </Text>

          {stats.habits.slice(0, 3).map((habit, index) => (
            <View key={habit.id} className="mb-3 border-b border-white/30 pb-3 last:border-b-0">
              <View className="flex-row items-center gap-3">
                <Text className="w-8 flex-shrink-0 text-[14px] font-bold text-gray-500">
                  {String(index + 1).padStart(2, '0')}
                </Text>
                <View className="min-w-0 flex-1">
                  <Text
                    className="w-full text-[13px] font-semibold text-gray-800"
                    numberOfLines={1}>
                    {habit.name}
                  </Text>
                  <Text className="w-full text-[10px] text-gray-600" numberOfLines={1}>
                    {habit.completedDays}
                    {t('share:glassmorphism.monthly.times')} {habit.streak > 0 && '🔥'}
                  </Text>
                </View>
                <View className="rounded-full bg-white/30 px-2.5 py-1">
                  <Text className="text-[11px] font-bold text-gray-800" numberOfLines={1}>
                    {Math.round(habit.completionRate)}%
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text className="mt-auto text-center text-[10px] text-gray-600">
          #{t('common:appName')} #{stats.year}Wrapped
        </Text>
      </LinearGradient>
    </View>
  );
}
