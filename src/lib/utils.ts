/**
 * Utility functions
 */

/**
 * Combines className strings conditionally
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Formats date to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Gets today's date string (YYYY-MM-DD)
 */
export function getTodayString(): string {
  return formatDate(new Date());
}

/**
 * Gets day of week (0 = Sunday, 6 = Saturday)
 */
export function getDayOfWeek(date: Date): number {
  return date.getDay();
}

/**
 * Checks if habit is active on given date based on frequency
 */
export function isHabitActiveOnDate(
  frequency: 'daily' | 'weekdays' | 'weekends' | 'custom',
  customDays: number[] | undefined,
  date: Date
): boolean {
  const dayOfWeek = getDayOfWeek(date);

  switch (frequency) {
    case 'daily':
      return true;
    case 'weekdays':
      return dayOfWeek >= 1 && dayOfWeek <= 5;
    case 'weekends':
      return dayOfWeek === 0 || dayOfWeek === 6;
    case 'custom':
      return customDays?.includes(dayOfWeek) ?? false;
    default:
      return false;
  }
}
