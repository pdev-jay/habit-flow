import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import {
  startOfMonth,
  startOfWeek,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks';
import { cn } from '@/lib/utils';

interface MonthCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onCollapse: () => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * MonthCalendar component
 * Displays full month calendar grid with navigation
 */
export function MonthCalendar({ selectedDate, onSelectDate, onCollapse }: MonthCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);
  const colorScheme = useTheme();

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);

    // Generate 42 days (6 weeks) for consistent grid
    const allDays: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(calendarStart);
      date.setDate(calendarStart.getDate() + i);
      allDays.push(date);
    }

    return allDays;
  }, [currentMonth]);

  const today = useMemo(() => new Date(), []);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const monthYearText = format(currentMonth, 'MMMM yyyy');

  return (
    <View className="rounded-xl bg-white p-4 dark:bg-gray-800">
      {/* Header with month/year and navigation */}
      <View className="mb-4 flex-row items-center justify-between">
        <ThemedText className="text-base font-semibold">{monthYearText}</ThemedText>

        <View className="flex-row items-center gap-2">
          {/* Previous month */}
          <Pressable
            onPress={handlePrevMonth}
            className="h-8 w-8 items-center justify-center rounded-lg active:bg-gray-100 dark:active:bg-gray-700">
            <MaterialCommunityIcons
              name="chevron-left"
              size={20}
              color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
          </Pressable>

          {/* Next month */}
          <Pressable
            onPress={handleNextMonth}
            className="h-8 w-8 items-center justify-center rounded-lg active:bg-gray-100 dark:active:bg-gray-700">
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
          </Pressable>

          {/* Toggle to Week view */}
          <Pressable
            onPress={onCollapse}
            className="flex-row items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 active:bg-gray-200 dark:bg-gray-700 dark:active:bg-gray-600">
            <MaterialCommunityIcons
              name="view-module"
              size={16}
              color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
            <ThemedText className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Month
            </ThemedText>
          </Pressable>
        </View>
      </View>

      {/* Weekday header */}
      <View className="mb-2 flex-row justify-around">
        {WEEKDAYS.map((day) => (
          <View key={day} className="w-10 items-center">
            <ThemedText className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {day.slice(0, 3)}
            </ThemedText>
          </View>
        ))}
      </View>

      {/* Date grid */}
      <View className="flex-row flex-wrap">
        {days.map((date) => {
          const dateString = format(date, 'yyyy-MM-dd');
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const isCurrentMonth = isSameMonth(date, currentMonth);

          return (
            <Pressable
              key={dateString}
              onPress={() => onSelectDate(date)}
              className={cn(
                'mb-2 h-10 w-[14.28%] items-center justify-center rounded-lg',
                isToday && 'bg-emerald-500',
                isSelected && !isToday && 'bg-blue-100 dark:bg-blue-900',
                !isSelected && !isToday && !isCurrentMonth && 'bg-gray-50 dark:bg-gray-800'
              )}>
              <ThemedText
                className={cn(
                  'text-sm font-medium',
                  isToday && 'text-white',
                  isSelected && !isToday && 'text-blue-700 dark:text-blue-300',
                  !isSelected && !isToday && isCurrentMonth && 'text-gray-900 dark:text-white',
                  !isSelected && !isToday && !isCurrentMonth && 'text-gray-300 dark:text-gray-500'
                )}>
                {format(date, 'd')}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
