import { useMemo } from 'react';
import { startOfWeek, addDays, subWeeks, format, isAfter, isBefore } from 'date-fns';
import { useHabits } from '@/features/habits/hooks';
import { useHabitCheckStore } from '@/features/habits/api';
import type { Habit } from '@/features/habits/types';

export interface WeekStreakData {
  weekNumber: number; // Week index (0 = current week, 1 = last week, ...)
  weekLabel: string; // e.g., "W1", "W2"
  maxStreak: number; // Maximum consecutive days achieved this week
  weekStart: Date;
}

export interface StreakTrendSummary {
  weeklyData: WeekStreakData[];
  bestStreak: number;
  averageStreak: number;
  currentStreak: number;
}

/**
 * Calculate streak trend over the last 8 weeks
 * Returns weekly maximum streak data and summary statistics
 */
export function useStreakTrend(): StreakTrendSummary {
  const { habits } = useHabits();
  const checks = useHabitCheckStore((state) => state.checks);

  return useMemo(() => {
    const weeksToAnalyze = 8;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Initialize weekly data (from oldest to newest)
    const weeklyData: WeekStreakData[] = [];

    for (let weekIndex = weeksToAnalyze - 1; weekIndex >= 0; weekIndex--) {
      const weekStartDate = startOfWeek(subWeeks(today, weekIndex), { weekStartsOn: 0 });
      weeklyData.push({
        weekNumber: weekIndex,
        weekLabel: `W${weeksToAnalyze - weekIndex}`,
        maxStreak: 0,
        weekStart: weekStartDate,
      });
    }

    // Calculate max streak for each week
    weeklyData.forEach((week) => {
      const weekStart = week.weekStart;
      const weekEnd = addDays(weekStart, 6);

      // For each day in the week, check if all active habits are completed
      let currentStreak = 0;
      let maxStreakInWeek = 0;

      for (let i = 0; i < 7; i++) {
        const date = addDays(weekStart, i);
        if (isAfter(date, today)) break; // Don't count future days

        // Get all habits that should be active on this date
        const activeHabits = habits.filter((habit: Habit) => {
          const createdAt = new Date(habit.createdAt);
          createdAt.setHours(0, 0, 0, 0);

          if (isBefore(date, createdAt)) return false; // Habit not created yet

          const dayOfWeek = date.getDay();
          switch (habit.frequency) {
            case 'daily':
              return true;
            case 'weekdays':
              return dayOfWeek >= 1 && dayOfWeek <= 5;
            case 'weekends':
              return dayOfWeek === 0 || dayOfWeek === 6;
            case 'custom':
              return habit.customDays?.includes(dayOfWeek) ?? false;
            default:
              return false;
          }
        });

        if (activeHabits.length === 0) {
          // No active habits, don't break streak
          continue;
        }

        // Check if all active habits are completed
        const dateString = format(date, 'yyyy-MM-dd');
        const allCompleted = activeHabits.every((habit: Habit) => {
          const key = `${habit.id}_${dateString}`;
          return checks[key]?.completed === true;
        });

        if (allCompleted) {
          currentStreak++;
          maxStreakInWeek = Math.max(maxStreakInWeek, currentStreak);
        } else {
          currentStreak = 0;
        }
      }

      week.maxStreak = maxStreakInWeek;
    });

    // Calculate current streak (from today backwards)
    let currentStreak = 0;
    for (let i = 0; i <= 30; i++) {
      const date = subWeeks(today, 0);
      const checkDate = new Date(date);
      checkDate.setDate(checkDate.getDate() - i);

      const activeHabits = habits.filter((habit: Habit) => {
        const createdAt = new Date(habit.createdAt);
        createdAt.setHours(0, 0, 0, 0);

        if (isBefore(checkDate, createdAt)) return false;

        const dayOfWeek = checkDate.getDay();
        switch (habit.frequency) {
          case 'daily':
            return true;
          case 'weekdays':
            return dayOfWeek >= 1 && dayOfWeek <= 5;
          case 'weekends':
            return dayOfWeek === 0 || dayOfWeek === 6;
          case 'custom':
            return habit.customDays?.includes(dayOfWeek) ?? false;
          default:
            return false;
        }
      });

      if (activeHabits.length === 0) continue;

      const dateString = format(checkDate, 'yyyy-MM-dd');
      const allCompleted = activeHabits.every((habit: Habit) => {
        const key = `${habit.id}_${dateString}`;
        return checks[key]?.completed === true;
      });

      if (allCompleted) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate summary statistics
    const validWeeks = weeklyData.filter((w) => w.maxStreak > 0);
    const bestStreak = Math.max(...weeklyData.map((w) => w.maxStreak), 0);
    const averageStreak =
      validWeeks.length > 0
        ? Math.round(validWeeks.reduce((sum, w) => sum + w.maxStreak, 0) / validWeeks.length)
        : 0;

    return {
      weeklyData,
      bestStreak,
      averageStreak,
      currentStreak,
    };
  }, [habits, checks]);
}
