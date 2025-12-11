import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { startOfWeek, endOfWeek, format, isSameDay, addDays, addWeeks, subWeeks } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { cn } from '@/lib/utils';

interface WeekCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onExpand: () => void;
}

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/**
 * WeekCalendar component
 * Displays 7 days with week navigation
 */
export function WeekCalendar({ selectedDate, onSelectDate, onExpand }: WeekCalendarProps) {
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
    <View className="rounded-xl bg-white p-4 dark:bg-gray-800">
      {/* Header with week range and navigation */}
      <View className="mb-4 flex-row items-center justify-between">
        <ThemedText className="text-base font-semibold">{weekRange}</ThemedText>

        <View className="flex-row items-center gap-2">
          {/* Previous week */}
          <Pressable
            onPress={handlePrevWeek}
            className="h-8 w-8 items-center justify-center rounded-lg active:bg-gray-100 dark:active:bg-gray-700">
            <MaterialCommunityIcons name="chevron-left" size={20} color="#6B7280" />
          </Pressable>

          {/* Next week */}
          <Pressable
            onPress={handleNextWeek}
            className="h-8 w-8 items-center justify-center rounded-lg active:bg-gray-100 dark:active:bg-gray-700">
            <MaterialCommunityIcons name="chevron-right" size={20} color="#6B7280" />
          </Pressable>

          {/* Toggle to Month view */}
          <Pressable
            onPress={onExpand}
            className="flex-row items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 active:bg-gray-200 dark:bg-gray-700 dark:active:bg-gray-600">
            <MaterialCommunityIcons name="view-week" size={16} color="#6B7280" />
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

          return (
            <Pressable
              key={format(date, 'yyyy-MM-dd')}
              onPress={() => onSelectDate(date)}
              className="items-center">
              {/* Day label */}
              <ThemedText className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                {WEEKDAY_LABELS[index]}
              </ThemedText>

              {/* Date */}
              <View
                className={cn(
                  'h-10 w-10 items-center justify-center rounded-full',
                  isToday && 'bg-emerald-500',
                  isSelected && !isToday && 'bg-blue-100 dark:bg-blue-900'
                )}>
                <ThemedText
                  className={cn(
                    'text-sm font-semibold',
                    isToday && 'text-white',
                    isSelected && !isToday && 'text-blue-700 dark:text-blue-300',
                    !isSelected && !isToday && 'text-gray-900 dark:text-white'
                  )}>
                  {format(date, 'd')}
                </ThemedText>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
