/**
 * Habit utility functions for common habit-related operations
 */

import type { Habit } from '../types/habit.types';

/**
 * Get active days for a habit based on frequency
 * @param habit - Habit object
 * @returns Array of active day indices (0=Sun, 1=Mon, ..., 6=Sat)
 */
export function getActiveDays(habit: Habit): number[] {
  switch (habit.frequency) {
    case 'daily':
      return [0, 1, 2, 3, 4, 5, 6];
    case 'weekdays':
      return [1, 2, 3, 4, 5];
    case 'weekends':
      return [0, 6];
    case 'custom':
      return habit.customDays || [];
    default:
      return [];
  }
}

/**
 * Check if a specific date is an active day for a habit
 * @param habit - Habit object
 * @param date - Date to check
 * @returns True if the date is an active day
 */
export function isActiveDayForHabit(habit: Habit, date: Date): boolean {
  const weekdayIndex = date.getDay();
  const activeDays = getActiveDays(habit);
  return activeDays.includes(weekdayIndex);
}

/**
 * Get habit frequency label for display
 * @param habit - Habit object
 * @returns Human-readable frequency label
 */
export function getFrequencyLabel(habit: Habit): string {
  switch (habit.frequency) {
    case 'daily':
      return 'Every day';
    case 'weekdays':
      return 'Weekdays';
    case 'weekends':
      return 'Weekends';
    case 'custom':
      return habit.customDays && habit.customDays.length > 0
        ? `${habit.customDays.length} days/week`
        : 'Custom';
    default:
      return 'Unknown';
  }
}
