import { useMemo } from 'react';
import { subWeeks, isAfter, isBefore } from 'date-fns';
import { useHabits } from '@/features/habits/hooks';
import { useHabitCheckStore } from '@/features/habits/api';
import type { Habit } from '@/features/habits/types';

export interface WeekdayAnalysis {
  weekday: number; // 0 = Sunday, 6 = Saturday
  totalActiveDays: number;
  completedDays: number;
  completionRate: number;
}

/**
 * Analyze completion rates by weekday over the last 4 weeks
 * Returns completion rate for each day of the week
 */
export function useWeekdayAnalysis(): WeekdayAnalysis[] {
  const { habits } = useHabits();
  const checks = useHabitCheckStore((state) => state.checks);

  return useMemo(() => {
    // Only analyze last 4 weeks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fourWeeksAgo = subWeeks(today, 4);
    fourWeeksAgo.setHours(0, 0, 0, 0);

    // Initialize counters for each weekday (0 = Sun, 6 = Sat)
    const weekdayStats = Array.from({ length: 7 }, (_, i) => ({
      weekday: i,
      totalActiveDays: 0,
      completedDays: 0,
      completionRate: 0,
    }));

    // If no habits, return empty stats
    if (habits.length === 0) {
      return weekdayStats;
    }

    // Iterate through each day in the last 4 weeks
    for (let d = new Date(fourWeeksAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const currentDate = new Date(d);
      currentDate.setHours(0, 0, 0, 0);
      const dateString = currentDate.toISOString().split('T')[0];
      const weekday = currentDate.getDay();

      // For each habit, check if it's active on this day
      habits.forEach((habit: Habit) => {
        // Check if habit was created before this date
        const createdAt = new Date(habit.createdAt);
        createdAt.setHours(0, 0, 0, 0);

        if (currentDate < createdAt) {
          return; // Skip dates before habit creation
        }

        // Check if this weekday is active for this habit
        let isActiveDay = false;
        switch (habit.frequency) {
          case 'daily':
            isActiveDay = true;
            break;
          case 'weekdays':
            isActiveDay = weekday >= 1 && weekday <= 5;
            break;
          case 'weekends':
            isActiveDay = weekday === 0 || weekday === 6;
            break;
          case 'custom':
            isActiveDay = habit.customDays?.includes(weekday) ?? false;
            break;
        }

        if (isActiveDay) {
          weekdayStats[weekday].totalActiveDays++;

          // Check if this habit was completed on this day
          const checkKey = `${habit.id}_${dateString}`;
          const check = checks[checkKey];
          if (check?.completed) {
            weekdayStats[weekday].completedDays++;
          }
        }
      });
    }

    // Calculate completion rates
    weekdayStats.forEach((stat) => {
      if (stat.totalActiveDays > 0) {
        stat.completionRate = Math.round((stat.completedDays / stat.totalActiveDays) * 100);
      }
    });

    return weekdayStats;
  }, [habits, checks]);
}
