import { useMemo } from 'react';
import { format, isBefore, subDays } from 'date-fns';
import { useHabits } from '@/features/habits/hooks';
import { useHabitCheckStore } from '@/features/habits/api';
import type { Habit } from '@/features/habits/types';

export interface HabitDetailStats {
  habit: Habit;
  completionRate: number; // Percentage (0-100)
  currentStreak: number; // Days
  bestStreak: number; // Days
  totalCompletions: number; // Total times completed
  activeDays: number; // Total days the habit has been active
}

/**
 * Calculate detailed statistics for each habit
 * Returns completion rate, streaks, and total completions
 */
export function useHabitDetail(): HabitDetailStats[] {
  const { habits } = useHabits();
  const checks = useHabitCheckStore((state) => state.checks);

  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return habits.map((habit) => {
      const createdAt = new Date(habit.createdAt);
      createdAt.setHours(0, 0, 0, 0);

      // Calculate how many days the habit has been active
      const daysSinceCreated = Math.floor(
        (today.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      let totalCompletions = 0;
      let activeDays = 0;
      let currentStreak = 0;
      let bestStreak = 0;
      let tempStreak = 0;

      // Analyze each day from creation to today
      for (let i = 0; i <= daysSinceCreated; i++) {
        const date = new Date(createdAt);
        date.setDate(date.getDate() + i);

        // Check if habit should be active on this day
        const dayOfWeek = date.getDay();
        let isActiveDay = false;

        switch (habit.frequency) {
          case 'daily':
            isActiveDay = true;
            break;
          case 'weekdays':
            isActiveDay = dayOfWeek >= 1 && dayOfWeek <= 5;
            break;
          case 'weekends':
            isActiveDay = dayOfWeek === 0 || dayOfWeek === 6;
            break;
          case 'custom':
            isActiveDay = habit.customDays?.includes(dayOfWeek) ?? false;
            break;
        }

        if (!isActiveDay) continue;
        activeDays++;

        // Check if completed
        const dateString = format(date, 'yyyy-MM-dd');
        const key = `${habit.id}_${dateString}`;
        const isCompleted = checks[key]?.completed === true;

        if (isCompleted) {
          totalCompletions++;
          tempStreak++;
          bestStreak = Math.max(bestStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      }

      // Calculate current streak (from today backwards)
      for (let i = 0; i <= daysSinceCreated; i++) {
        const date = subDays(today, i);

        if (isBefore(date, createdAt)) break;

        const dayOfWeek = date.getDay();
        let isActiveDay = false;

        switch (habit.frequency) {
          case 'daily':
            isActiveDay = true;
            break;
          case 'weekdays':
            isActiveDay = dayOfWeek >= 1 && dayOfWeek <= 5;
            break;
          case 'weekends':
            isActiveDay = dayOfWeek === 0 || dayOfWeek === 6;
            break;
          case 'custom':
            isActiveDay = habit.customDays?.includes(dayOfWeek) ?? false;
            break;
        }

        if (!isActiveDay) continue;

        const dateString = format(date, 'yyyy-MM-dd');
        const key = `${habit.id}_${dateString}`;
        const isCompleted = checks[key]?.completed === true;

        if (isCompleted) {
          currentStreak++;
        } else {
          break;
        }
      }

      // Calculate completion rate
      const completionRate = activeDays > 0 ? Math.round((totalCompletions / activeDays) * 100) : 0;

      return {
        habit,
        completionRate,
        currentStreak,
        bestStreak,
        totalCompletions,
        activeDays,
      };
    });
  }, [habits, checks]);
}
