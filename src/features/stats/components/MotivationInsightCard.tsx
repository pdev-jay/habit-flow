import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme, useI18n } from '@/hooks';
import { useMotivationInsight } from '../hooks/useMotivationInsight';

/**
 * Motivation insight card component
 * Shows AI-generated insights and encouragement based on habit statistics
 */
export function MotivationInsightCard() {
  const colorScheme = useTheme();
  const { t } = useI18n();
  const insight = useMotivationInsight();

  return (
    <View className="mx-4 mb-4 rounded-xl bg-blue-50 px-6 pb-6 pt-6 mt-6 dark:bg-gray-800">
      {/* Header */}
      <View className="mb-4 flex-row items-center gap-2">
        <MaterialCommunityIcons
          name="lightbulb-on"
          size={24}
          color={colorScheme === 'dark' ? '#60A5FA' : '#3B82F6'}
        />
        <ThemedText className="text-lg font-bold text-gray-900 dark:text-white">
          {t('screens:stats.aiInsights')}
        </ThemedText>
      </View>

      {/* Weekly Progress Badge */}
      {insight.achievementBadge && (
        <View className="mb-4 items-center rounded-2xl bg-blue-100 py-6 dark:bg-blue-900/30">
          <MaterialCommunityIcons
            name={insight.achievementBadge as any}
            size={64}
            color="#FCD34D"
          />
          <ThemedText className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
            {insight.weeklyProgress}%
          </ThemedText>
          <ThemedText className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t('screens:stats.thisWeekProgress')}
          </ThemedText>
        </View>
      )}

      {/* Motivation Message */}
      <View className="mb-4 rounded-xl bg-blue-100 p-4 dark:bg-blue-900/30">
        <ThemedText className="text-center text-base font-semibold text-gray-900 dark:text-white">
          {t(`screens:stats.motivationMessages.${insight.motivationMessage}`)}
        </ThemedText>
      </View>

      {/* Insights Grid */}
      <View className="gap-3">
        {/* Top 3 Habits */}
        {insight.topThree.length > 0 && (
          <View className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <View className="mb-2 flex-row items-center gap-2">
              <MaterialCommunityIcons name="trophy" size={20} color="#FCD34D" />
              <ThemedText className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">
                {t('screens:stats.topPerformer')}
              </ThemedText>
            </View>
            {insight.topThree.map((stat, index) => {
              return (
                <View
                  key={stat.habit.id}
                  className={`flex-row items-center gap-2 ${index > 0 ? 'mt-3' : ''}`}>
                  <View
                    className="h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: stat.habit.color }}>
                    <MaterialCommunityIcons
                      name={stat.habit.icon as any}
                      size={16}
                      color="#FFFFFF"
                    />
                  </View>
                  <ThemedText className="flex-1 text-base font-bold text-gray-900 dark:text-white">
                    {stat.habit.name}
                  </ThemedText>
                  <ThemedText className="text-lg font-black text-yellow-600 dark:text-yellow-400">
                    {stat.completionRate}%
                  </ThemedText>
                </View>
              );
            })}
          </View>
        )}

        {/* Improvement Habit */}
        {insight.improvementHabit && insight.improvementHabit.completionRate < 70 && (
          <View className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <View className="mb-2 flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="chart-line-variant"
                size={20}
                color={colorScheme === 'dark' ? '#A78BFA' : '#8B5CF6'}
              />
              <ThemedText className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">
                {t('screens:stats.needsAttention')}
              </ThemedText>
            </View>
            <View className="flex-row items-center gap-2">
              <View
                className="h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: insight.improvementHabit.habit.color }}>
                <MaterialCommunityIcons
                  name={insight.improvementHabit.habit.icon as any}
                  size={16}
                  color="#FFFFFF"
                />
              </View>
              <ThemedText className="flex-1 text-base font-bold text-gray-900 dark:text-white">
                {insight.improvementHabit.habit.name}
              </ThemedText>
              <ThemedText className="text-xl font-black text-purple-600 dark:text-purple-400">
                {insight.improvementHabit.completionRate}%
              </ThemedText>
            </View>
          </View>
        )}
      </View>

      {/* Tip */}
      <View className="mt-4 rounded-xl bg-blue-100 p-3 dark:bg-blue-900/30">
        <View className="flex-row items-start gap-2">
          <MaterialCommunityIcons
            name="information-outline"
            size={18}
            color={colorScheme === 'dark' ? '#60A5FA' : '#3B82F6'}
          />
          <ThemedText className="flex-1 text-xs text-gray-700 dark:text-gray-300">
            {t('screens:stats.insightTip')}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}
