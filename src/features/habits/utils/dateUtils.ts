/**
 * Date utility functions for habit filtering
 * - Validates habit creation date against target dates
 * - Normalizes dates to midnight (00:00:00) for consistent comparison
 */

/**
 * Check if a habit was created by a specific date
 * @param habit - Habit object with createdAt field
 * @param date - Target date to check
 * @returns true if the target date is on or after the habit's creation date
 */
export function isHabitCreatedByDate(habit: { createdAt: string }, date: Date): boolean {
  const createdAt = new Date(habit.createdAt);
  createdAt.setHours(0, 0, 0, 0);

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  return targetDate >= createdAt;
}

/**
 * Check if a habit was created by a specific date (string version)
 * @param habit - Habit object with createdAt field
 * @param dateString - Target date in YYYY-MM-DD format
 * @returns true if the target date is on or after the habit's creation date
 */
export function isHabitCreatedByDateString(
  habit: { createdAt: string },
  dateString: string
): boolean {
  const createdAt = new Date(habit.createdAt);
  createdAt.setHours(0, 0, 0, 0);

  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0);

  return targetDate >= createdAt;
}
