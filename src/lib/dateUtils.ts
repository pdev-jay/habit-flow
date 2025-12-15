/**
 * Date utility functions for consistent date handling across the app
 */

/**
 * Format a Date object to YYYY-MM-DD string
 * @param date - Date to format
 * @returns Formatted date string (e.g., "2025-12-15")
 */
export function formatDateToKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Normalize a date by setting time to 00:00:00.000
 * @param date - Date to normalize (Date object or string)
 * @returns Normalized Date object
 */
export function normalizeDate(date: Date | string): Date {
  const normalized = typeof date === 'string' ? new Date(date) : new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

/**
 * Get today's date as YYYY-MM-DD string
 * @returns Today's date string
 */
export function getTodayString(): string {
  return formatDateToKey(new Date());
}

/**
 * Get normalized today's date
 * @returns Normalized Date object for today
 */
export function getTodayNormalized(): Date {
  return normalizeDate(new Date());
}

/**
 * Check if two dates are the same day (ignoring time)
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDateToKey(date1) === formatDateToKey(date2);
}

/**
 * Parse date string to Date object
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Parsed and normalized Date object
 */
export function parseDateString(dateString: string): Date {
  return normalizeDate(new Date(dateString));
}
