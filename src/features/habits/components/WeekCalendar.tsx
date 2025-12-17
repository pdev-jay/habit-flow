import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { startOfWeek, endOfWeek, format, isSameDay, addDays, addWeeks, subWeeks } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks';
import { cn } from '@/lib/utils';

interface WeekCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onExpand: () => void;
  getCompletionRate?: (date: Date) => number;
}

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/**
 * WeekCalendar component
 * Displays 7 days with week navigation
 */
export function WeekCalendar({
  selectedDate,
  onSelectDate,
  onExpand,
  getCompletionRate,
}: WeekCalendarProps) {
  const colorScheme = useTheme();

  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [selectedDate]);

  const weekRange = useMemo(() => {
    const weekStart = startOfWeek(selectedDate);
    const weekEnd = endOfWeek(selectedDate);
    return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`;
  }, [selectedDate]);

  const today = useMemo(() => new Date(), []);

  const handlePrevWeek = () => {
    const newDate = subWeeks(selectedDate, 1);
    onSelectDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = addWeeks(selectedDate, 1);
    onSelectDate(newDate);
  };

  return (
    <View className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
      {/* Header with week range and navigation */}
      <View className="mb-4 flex-row items-center justify-between">
        <ThemedText className="text-base font-semibold">{weekRange}</ThemedText>

        <View className="flex-row items-center gap-2">
          {/* Previous week */}
          <Pressable
            onPress={handlePrevWeek}
            className="h-8 w-8 items-center justify-center rounded-lg active:bg-gray-100 dark:active:bg-gray-700">
            <MaterialCommunityIcons
              name="chevron-left"
              size={20}
              color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
          </Pressable>

          {/* Next week */}
          <Pressable
            onPress={handleNextWeek}
            className="h-8 w-8 items-center justify-center rounded-lg active:bg-gray-100 dark:active:bg-gray-700">
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
          </Pressable>

          {/* Toggle to Month view */}
          <Pressable
            onPress={onExpand}
            className="flex-row items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 active:bg-gray-200 dark:bg-gray-700 dark:active:bg-gray-600">
            <MaterialCommunityIcons
              name="view-week"
              size={16}
              color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
            <ThemedText className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Week
            </ThemedText>
          </Pressable>
        </View>
      </View>

      {/* Week days */}
      <View className="flex-row justify-between">
        {weekDays.map((date, index) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const completionRate = getCompletionRate?.(date) ?? 0;

          // 완료율에 따른 색상 결정
          const getDotColor = () => {
            if (completionRate < 0.5) return 'bg-red-400 dark:bg-red-400'; // 50% 미만
            if (completionRate < 1.0) return 'bg-yellow-400 dark:bg-yellow-400'; // 50~99%
            return 'bg-green-400 dark:bg-green-400'; // 100%
          };

          const dotColor = getDotColor();
          const showDot = completionRate > 0;

          return (
            <View key={format(date, 'yyyy-MM-dd')} className="items-center">
              {/* Day label */}
              <ThemedText className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                {WEEKDAY_LABELS[index]}
              </ThemedText>

              {/* Date */}
              <Pressable
                onPress={() => onSelectDate(date)}
                className={cn(
                  'h-10 w-10 items-center justify-center rounded-full',
                  isToday && isSelected && 'bg-emerald-500',
                  isToday && !isSelected && 'border-2 border-emerald-500',
                  isSelected && !isToday && 'bg-blue-500 dark:bg-blue-600'
                )}>
                <ThemedText
                  className={cn(
                    'text-sm font-semibold',
                    isToday && isSelected && 'text-white',
                    isToday && !isSelected && 'text-emerald-500',
                    isSelected && !isToday && 'text-white',
                    !isSelected && !isToday && 'text-gray-900 dark:text-white'
                  )}>
                  {format(date, 'd')}
                </ThemedText>
              </Pressable>

              {/* Completion indicator */}
              <View
                className={cn('mt-1 h-1.5 w-1.5 rounded-full', dotColor, !showDot && 'opacity-0')}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}
