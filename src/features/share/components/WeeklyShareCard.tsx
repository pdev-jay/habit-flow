import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { WeeklyShareCardProps } from '../types/share.types';

/**
 * Weekly habit completion share card component
 * Displays weekly statistics with circular progress indicator
 */
export function WeeklyShareCard({
  completionRate,
  completedCount,
  totalCount,
  streakDays,
  dateRange,
}: WeeklyShareCardProps) {
  return (
    <View className="w-[350px] overflow-hidden rounded-3xl bg-white shadow-2xl">
      {/* Header with gradient */}
      <LinearGradient
        colors={['#3B82F6', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 py-8">
        <Text className="text-center text-xl font-bold text-white">🎯 이번 주 습관 달성률</Text>
      </LinearGradient>

      {/* Main content */}
      <View className="items-center px-6 py-8">
        {/* Circular progress */}
        <View className="relative mb-6 h-32 w-32 items-center justify-center">
          {/* Background circle */}
          <View className="absolute h-32 w-32 rounded-full border-8 border-gray-200" />
          {/* Progress circle - simplified version */}
          <View
            className="absolute h-32 w-32 rounded-full border-8"
            style={{
              borderTopColor: completionRate > 0 ? '#3B82F6' : 'transparent',
              borderRightColor: completionRate > 25 ? '#3B82F6' : 'transparent',
              borderBottomColor: completionRate > 50 ? '#3B82F6' : 'transparent',
              borderLeftColor: completionRate > 75 ? '#3B82F6' : 'transparent',
              transform: [{ rotate: '-90deg' }],
            }}
          />
          <Text className="text-4xl font-bold text-blue-600">{completionRate}%</Text>
        </View>

        {/* Stats */}
        <View className="mb-6 w-full space-y-3">
          <View className="flex-row items-center justify-center">
            <MaterialCommunityIcons name="checkbox-marked-circle" size={24} color="#10B981" />
            <Text className="ml-2 text-lg font-semibold text-gray-700">
              완료: {completedCount}/{totalCount}
            </Text>
          </View>

          <View className="flex-row items-center justify-center">
            <MaterialCommunityIcons name="fire" size={24} color="#EF4444" />
            <Text className="ml-2 text-lg font-semibold text-gray-700">
              연속 달성: {streakDays}일
            </Text>
          </View>
        </View>

        {/* Date range */}
        <Text className="mb-4 text-sm text-gray-500">{dateRange}</Text>

        {/* Watermark */}
        <View className="mt-2 flex-row items-center">
          <Text className="text-xs text-gray-400">Made with </Text>
          <Text className="text-xs font-bold text-blue-500">Routimeter</Text>
        </View>
      </View>
    </View>
  );
}
