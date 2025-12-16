import { useMemo } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getWeek,
} from 'date-fns';

// Internal imports
import { useHabits } from '@/features/habits/hooks';
import { useHabitCheckStore } from '@/features/habits/api';
import { calculateStreak } from '@/features/habits/utils/streakUtils';
import { isHabitCreatedByDate } from '@/features/habits/utils/dateUtils';
import { isActiveDayForHabit } from '@/features/habits/utils/habitUtils';
import { getDateLocale, getDateFormat } from '@/lib/dateLocales';
import type { Habit, LanguageType } from '@/features/habits/types';

// Relative imports
import type { WeeklyStats, MonthlyStats, HabitProgress } from '../types/share.types';

/**
 * Calculate habit progress for a given date range
 */
function calculateHabitProgress(
  habit: Habit,
  days: Date[],
  checks: Record<string, { habitId: string; date: string; completed: boolean }>
): HabitProgress {
  // Filter days that are applicable for this habit (frequency + created date)
  const applicableDays = days.filter(
    (day) => isHabitCreatedByDate(habit, day) && isActiveDayForHabit(habit, day)
  );

  // Count completed days
  const completedDays = applicableDays.filter((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const key = `${habit.id}_${dateStr}`;
    return checks[key]?.completed ?? false;
  }).length;

  // Calculate completion rate
  const completionRate =
    applicableDays.length > 0
      ? parseFloat(((completedDays / applicableDays.length) * 100).toFixed(1))
      : 0;

  // Get habit checks for streak calculation
  const habitChecks = Object.values(checks)
    .filter((check) => check.habitId === habit.id)
    .map((check) => ({
      habitId: check.habitId,
      date: check.date,
      completed: check.completed,
    }));

  const streak = calculateStreak(habit, habitChecks);

  return {
    id: habit.id,
    name: habit.name,
    icon: habit.icon,
    color: habit.color,
    completionRate,
    completedDays,
    totalDays: applicableDays.length,
    streak,
  };
}

/**
 * Calculate maximum streak within a date range
 */
function calculateMaxStreak(
  habits: Habit[],
  days: Date[],
  checks: Record<string, { habitId: string; date: string; completed: boolean }>
): number {
  let maxStreak = 0;
  let currentStreak = 0;

  for (const day of days) {
    const dateStr = format(day, 'yyyy-MM-dd');
    const activeHabits = habits.filter(
      (habit) => isHabitCreatedByDate(habit, day) && isActiveDayForHabit(habit, day)
    );

    if (activeHabits.length === 0) {
      continue;
    }

    const allCompleted = activeHabits.every((habit) => {
      const key = `${habit.id}_${dateStr}`;
      return checks[key]?.completed ?? false;
    });

    if (allCompleted) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return maxStreak;
}

/**
 * Template data hook
 * Calculates weekly and monthly statistics from actual habit data
 *
 * @param language - Current language for date formatting (defaults to 'ko')
 * @param date - Reference date (defaults to today)
 * @returns Weekly and monthly statistics
 */
export function useTemplateData(language: LanguageType = 'ko', date: Date = new Date()) {
  const { habits } = useHabits();
  const checks = useHabitCheckStore((state) => state.checks);

  const locale = getDateLocale(language);
  const monthDayFormat = getDateFormat(language, 'monthDay');
  const yearMonthFormat = getDateFormat(language, 'yearMonth');

  // Weekly statistics calculation
  const weeklyStats = useMemo((): WeeklyStats => {
    const startDate = startOfWeek(date, { weekStartsOn: 0 });
    const endDate = endOfWeek(date, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    // Calculate progress for each habit
    const habitProgress: HabitProgress[] = habits.map((habit) =>
      calculateHabitProgress(habit, days, checks)
    );

    // Calculate totals
    const totalCount = habitProgress.reduce((sum, h) => sum + h.totalDays, 0);
    const completedCount = habitProgress.reduce((sum, h) => sum + h.completedDays, 0);
    const completionRate =
      totalCount > 0 ? parseFloat(((completedCount / totalCount) * 100).toFixed(1)) : 0;

    // Calculate current streak (max streak among all habits)
    const streakDays = Math.max(0, ...habitProgress.map((h) => h.streak));

    return {
      completionRate,
      completedCount,
      totalCount,
      streakDays,
      dateRange: `${format(startDate, monthDayFormat, { locale })} - ${format(endDate, monthDayFormat, { locale })}`,
      weekNumber: getWeek(date),
      habits: habitProgress.sort((a, b) => b.completionRate - a.completionRate),
    };
  }, [habits, checks, date, locale, monthDayFormat]);

  // Monthly statistics calculation
  const monthlyStats = useMemo((): MonthlyStats => {
    const startDate = startOfMonth(date);
    const endDate = endOfMonth(date);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    // Calculate progress for each habit
    const habitProgress: HabitProgress[] = habits.map((habit) =>
      calculateHabitProgress(habit, days, checks)
    );

    // Calculate totals
    const totalCount = habitProgress.reduce((sum, h) => sum + h.totalDays, 0);
    const completedCount = habitProgress.reduce((sum, h) => sum + h.completedDays, 0);
    const averageCompletionRate =
      totalCount > 0 ? parseFloat(((completedCount / totalCount) * 100).toFixed(1)) : 0;

    // Calculate perfect days (all habits completed)
    const perfectDays = days.filter((day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const activeHabits = habits.filter(
        (habit) => isHabitCreatedByDate(habit, day) && isActiveDayForHabit(habit, day)
      );

      if (activeHabits.length === 0) {
        return false;
      }

      return activeHabits.every((habit) => {
        const key = `${habit.id}_${dateStr}`;
        return checks[key]?.completed ?? false;
      });
    }).length;

    // Calculate maximum streak in the month
    const maxStreak = calculateMaxStreak(habits, days, checks);

    return {
      month: format(date, yearMonthFormat, { locale }),
      year: date.getFullYear(),
      averageCompletionRate,
      perfectDays,
      maxStreak,
      totalHabits: habits.length,
      habits: habitProgress.sort((a, b) => b.completionRate - a.completionRate),
    };
  }, [habits, checks, date, locale, yearMonthFormat]);

  return {
    weeklyStats,
    monthlyStats,
  };
}
