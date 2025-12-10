import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { startOfMonth, startOfWeek, format, isSameMonth, isSameDay } from 'date-fns';

import { ThemedText } from '@/components/ThemedText';
import { cn } from '@/lib/utils';
import { useHabits } from '@/features/habits/hooks';
import { useHabitCheckStore } from '@/features/habits/stores';

interface HabitDotData {
  id: string;
  color: string;
  isCompleted: boolean;
}

interface DateGridProps {
  currentDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * DateGrid component
 * Renders 7x6 calendar grid with habit color dots
 */
export function DateGrid({ currentDate, selectedDate, onSelectDate }: DateGridProps) {
  const { getActiveHabitsForDate } = useHabits();
  const checks = useHabitCheckStore((state) => state.checks);

  // Get all days to display in grid (always 6 weeks = 42 days for consistent height)
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);

    // Always generate 42 days (6 weeks) for consistent grid height
    const allDays: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(calendarStart);
      date.setDate(calendarStart.getDate() + i);
      allDays.push(date);
    }

    return allDays;
  }, [currentDate]);

  // Build habit data map for all dates (performance optimization)
  const habitDataByDate = useMemo(() => {
    const dataMap = new Map<string, HabitDotData[]>();

    days.forEach((date) => {
      const dateString = format(date, 'yyyy-MM-dd');
      const activeHabits = getActiveHabitsForDate(date);

      const habitDots: HabitDotData[] = activeHabits.map((habit) => {
        const key = `${habit.id}_${dateString}`;
        const isCompleted = checks[key]?.completed ?? false;

        return {
          id: habit.id,
          color: habit.color,
          isCompleted,
        };
      });

      dataMap.set(dateString, habitDots);
    });

    return dataMap;
  }, [days, getActiveHabitsForDate, checks]);

  const today = useMemo(() => new Date(), []);

  return (
    <View>
      {/* Weekday header */}
      <View className="mb-2 flex-row justify-around">
        {WEEKDAYS.map((day) => (
          <View key={day} className="w-10 items-center">
            <ThemedText className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {day}
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
          const isCurrentMonth = isSameMonth(date, currentDate);
          const habitDots = habitDataByDate.get(dateString) || [];

          return (
            <Pressable
              key={dateString}
              onPress={() => onSelectDate(date)}
              className={cn(
                'mb-2 h-14 w-[14.28%] items-center justify-center rounded-lg',
                isSelected && 'bg-blue-100 dark:bg-blue-900',
                isToday && !isSelected && 'border-2 border-blue-300 dark:border-blue-700',
                !isSelected && !isCurrentMonth && 'bg-gray-50 dark:bg-gray-800'
              )}>
              <ThemedText
                className={cn(
                  'mb-1 text-sm font-medium',
                  isSelected && 'text-blue-700 dark:text-blue-300',
                  !isSelected && isCurrentMonth && 'text-gray-900 dark:text-white',
                  !isSelected && !isCurrentMonth && 'text-gray-300 dark:text-gray-500'
                )}>
                {format(date, 'd')}
              </ThemedText>

              {/* Habit dots */}
              {habitDots.length > 0 && (
                <View className="flex-row flex-wrap items-center justify-center gap-0.5">
                  {habitDots.slice(0, 3).map((dot) => (
                    <View
                      key={dot.id}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        backgroundColor: dot.color,
                        opacity: dot.isCompleted ? 1.0 : 0.3,
                      }}
                    />
                  ))}
                  {habitDots.length > 3 && (
                    <ThemedText
                      className={cn(
                        'text-[8px] font-bold',
                        isSelected && 'text-blue-700 dark:text-blue-300',
                        !isSelected && 'text-gray-500 dark:text-gray-400'
                      )}>
                      +{habitDots.length - 3}
                    </ThemedText>
                  )}
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
