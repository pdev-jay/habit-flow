/**
 * Statistics utility functions for consistent calculation across the app
 */

/**
 * Calculate completion rate percentage
 * @param completed - Number of completed items
 * @param total - Total number of items
 * @returns Completion rate as a percentage (0-100) with 1 decimal place
 */
export function calculateCompletionRate(completed: number, total: number): number {
  if (total === 0) return 0;
  return parseFloat(((completed / total) * 100).toFixed(1));
}

/**
 * Round completion rate to nearest integer
 * @param rate - Completion rate to round
 * @returns Rounded completion rate
 */
export function roundCompletionRate(rate: number): number {
  return Math.round(rate);
}

/**
 * Calculate percentage with 1 decimal place
 * @param value - Numerator value
 * @param total - Denominator value
 * @returns Percentage with 1 decimal place
 */
export function calculatePercentage(value: number, total: number): number {
  return calculateCompletionRate(value, total);
}

/**
 * Format completion rate for display
 * @param rate - Completion rate (0-100)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted string with % symbol
 */
export function formatCompletionRate(rate: number, decimals: number = 0): string {
  return `${rate.toFixed(decimals)}%`;
}

/**
 * Calculate average from array of numbers
 * @param numbers - Array of numbers
 * @returns Average value with 1 decimal place
 */
export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return parseFloat((sum / numbers.length).toFixed(1));
}
