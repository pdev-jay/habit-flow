import { useMemo, useCallback } from 'react';
import { View, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { format, isFuture, startOfDay } from 'date-fns';
import { useI18n } from '@/hooks';
import { cn } from '@/lib/utils';
import type { DayCompletionData } from '../types/stats.types';

interface Props {
  currentDate: Date;
  heatmapData: DayCompletionData[];
  onDayPress: (date: Date) => void;
}

export function MonthlyHeatmap({ currentDate, heatmapData, onDayPress }: Props) {
  const { t } = useI18n();

  const heatmapCells = useMemo(() => {
    return heatmapData.map((dayData) => {
      const completionRate =
        dayData.totalHabits > 0 ? (dayData.completedCount / dayData.totalHabits) * 100 : 0;

      let colorClass = '';
      if (completionRate >= 90) {
        colorClass = 'bg-green-600 dark:bg-green-500';
      } else if (completionRate >= 70) {
        colorClass = 'bg-green-500 dark:bg-green-400';
      } else if (completionRate >= 50) {
        colorClass = 'bg-green-400 dark:bg-green-300';
      } else if (completionRate >= 30) {
        colorClass = 'bg-gray-400 dark:bg-gray-500';
      } else {
        colorClass = 'bg-gray-300 dark:bg-gray-600';
      }

      return {
        date: dayData.date,
        colorClass,
        completionRate,
        isFuture: isFuture(startOfDay(dayData.date)),
      };
    });
  }, [heatmapData]);

  const handleDayPress = useCallback(
    (date: Date, disabled: boolean) => {
      if (disabled) return;
      onDayPress(date);
    },
    [onDayPress]
  );

  return (
    <View className="mx-4 my-2 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
      <ThemedText className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        {t('components:monthlyHeatmap.title')}
      </ThemedText>

      {/* Legend */}
      <View className="mb-4 flex-row items-center justify-center gap-2">
        <ThemedText className="text-xs text-gray-500 dark:text-gray-400">
          {t('components:monthlyHeatmap.less')}
        </ThemedText>
        <View className="h-4 w-4 rounded-sm bg-gray-300 dark:bg-gray-600" />
        <View className="h-4 w-4 rounded-sm bg-gray-400 dark:bg-gray-500" />
        <View className="h-4 w-4 rounded-sm bg-green-400 dark:bg-green-300" />
        <View className="h-4 w-4 rounded-sm bg-green-500 dark:bg-green-400" />
        <View className="h-4 w-4 rounded-sm bg-green-600 dark:bg-green-500" />
        <ThemedText className="text-xs text-gray-500 dark:text-gray-400">
          {t('components:monthlyHeatmap.more')}
        </ThemedText>
      </View>

      {/* Heatmap Grid */}
      <View className="flex-row flex-wrap gap-1">
        {heatmapCells.map((cell, index) => (
          <Pressable
            key={index}
            className={cn(
              'h-8 w-8 items-center justify-center rounded-md',
              cell.colorClass,
              cell.isFuture && 'opacity-30'
            )}
            onPress={() => handleDayPress(cell.date, cell.isFuture)}
            disabled={cell.isFuture}>
            <ThemedText className="text-xs font-medium text-white">
              {format(cell.date, 'd')}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
