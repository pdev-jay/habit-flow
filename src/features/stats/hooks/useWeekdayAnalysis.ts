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

    // Analyze check records from last 4 weeks only
    Object.entries(checks).forEach(([key, check]) => {
      // Parse key format: "habitId_YYYY-MM-DD"
      const parts = key.split('_');
      if (parts.length !== 2) return;

      const [habitId, dateString] = parts;
      const habit = habits.find((h: Habit) => h.id === habitId);
      if (!habit) return;

      // Parse date and filter by 4-week range
      const date = new Date(dateString);
      date.setHours(0, 0, 0, 0);

      // Skip dates outside of last 4 weeks
      if (isBefore(date, fourWeeksAgo) || isAfter(date, today)) return;

      const weekday = date.getDay();

      // Check if habit was created before this date
      const createdAt = new Date(habit.createdAt);
      createdAt.setHours(0, 0, 0, 0);
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);

      if (targetDate < createdAt) {
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
        if (check.completed) {
          weekdayStats[weekday].completedDays++;
        }
      }
    });

    // Calculate completion rates
    weekdayStats.forEach((stat) => {
      if (stat.totalActiveDays > 0) {
        stat.completionRate = Math.round((stat.completedDays / stat.totalActiveDays) * 100);
      }
    });

    return weekdayStats;
  }, [habits, checks]);
}
