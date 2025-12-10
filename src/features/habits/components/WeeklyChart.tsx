import React from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { cn } from '@/lib/utils';

interface DayData {
  day: string;
  completed: number;
  total: number;
}

interface WeeklyChartProps {
  data: DayData[];
}

/**
 * Weekly chart component
 */
export function WeeklyChart({ data }: WeeklyChartProps) {
  return (
    <View className="rounded-xl bg-white p-4 dark:bg-gray-800">
      <ThemedText className="mb-4 text-lg font-bold">주간 완료 현황</ThemedText>

      <View className="flex-row items-end justify-between">
        {data.map((dayData, index) => {
          const completionRate = dayData.total > 0 ? dayData.completed / dayData.total : 0;
          const height = 100; // 모든 막대를 동일한 높이로

          return (
            <View key={index} className="flex-1 items-center">
              <View className="mb-2 w-full items-center" style={{ height: 120 }}>
                <View
                  className="w-8 justify-end rounded-t-lg bg-gray-200 dark:bg-gray-700"
                  style={{ height: `${height}%` }}>
                  <View
                    className={cn(
                      'w-full',
                      completionRate === 1
                        ? 'rounded-t-lg bg-green-500'
                        : completionRate > 0.5
                          ? 'bg-blue-500'
                          : 'bg-gray-400'
                    )}
                    style={{ height: `${completionRate * 100}%` }}
                  />
                </View>
              </View>

              <ThemedText className="text-xs text-gray-600 dark:text-gray-400">
                {dayData.day}
              </ThemedText>

              <ThemedText className="mt-1 text-xs font-semibold">
                {dayData.completed}/{dayData.total}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </View>
  );
}
