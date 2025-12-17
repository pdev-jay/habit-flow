import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { getHeatmapHexColor } from '@/features/habits/utils/colorUtils';
import type { MonthlyHeatmapShareProps } from '../types/share.types';

/**
 * Monthly habit heatmap share card component
 * Displays GitHub-style heatmap with completion rates
 */
export function MonthlyHeatmapShare({
  month,
  days,
  totalHabits,
  perfectDays,
}: MonthlyHeatmapShareProps) {
  return (
    <View className="w-[350px] overflow-hidden rounded-3xl bg-white shadow-2xl">
      {/* Header */}
      <LinearGradient
        colors={['#10B981', '#059669']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 py-6">
        <Text className="text-center text-xl font-bold text-white">📅 {month} 습관 기록</Text>
      </LinearGradient>

      {/* Heatmap */}
      <View className="px-6 py-8">
        {/* Weekday labels */}
        <View className="mb-2 flex-row justify-around">
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
            <Text key={day} className="w-8 text-center text-xs text-gray-500">
              {day}
            </Text>
          ))}
        </View>

        {/* Heatmap grid (5 weeks) */}
        <View className="mb-6 space-y-1">
          {[0, 1, 2, 3, 4].map((week) => (
            <View key={week} className="flex-row justify-around">
              {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                const index = week * 7 + day;
                const dayData = days[index];
                return (
                  <View
                    key={day}
                    className="h-8 w-8 rounded"
                    style={{
                      backgroundColor: dayData
                        ? getHeatmapHexColor(dayData.completionRate)
                        : '#F3F4F6',
                    }}
                  />
                );
              })}
            </View>
          ))}
        </View>

        {/* Legend */}
        <View className="mb-6 flex-row items-center justify-center space-x-1">
          <Text className="mr-2 text-xs text-gray-500">적음</Text>
          {[0, 25, 50, 75, 100].map((rate) => (
            <View
              key={rate}
              className="h-4 w-4 rounded"
              style={{ backgroundColor: getHeatmapHexColor(rate) }}
            />
          ))}
          <Text className="ml-2 text-xs text-gray-500">많음</Text>
        </View>

        {/* Stats */}
        <View className="mb-4 flex-row justify-around border-t border-gray-200 pt-4">
          <View className="items-center">
            <Text className="text-2xl font-bold text-blue-600">{totalHabits}</Text>
            <Text className="text-xs text-gray-500">총 습관 수</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-green-600">{perfectDays}</Text>
            <Text className="text-xs text-gray-500">완벽한 날</Text>
          </View>
        </View>

        {/* Watermark */}
        <View className="flex-row items-center justify-center">
          <Text className="text-xs text-gray-400">Made with </Text>
          <Text className="text-xs font-bold text-green-500">Routimeter</Text>
        </View>
      </View>
    </View>
  );
}
