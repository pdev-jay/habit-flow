/**
 * Color utility functions for habit visualization
 */

/**
 * Get heatmap color class based on completion rate
 * @param completionRate - Completion rate percentage (0-100)
 * @returns Tailwind CSS color class string
 */
export function getHeatmapColorClass(completionRate: number): string {
  if (completionRate >= 90) {
    return 'bg-green-600 dark:bg-green-500';
  } else if (completionRate >= 70) {
    return 'bg-green-500 dark:bg-green-400';
  } else if (completionRate >= 50) {
    return 'bg-green-400 dark:bg-green-300';
  } else if (completionRate >= 30) {
    return 'bg-gray-400 dark:bg-gray-500';
  } else {
    return 'bg-gray-300 dark:bg-gray-600';
  }
}

/**
 * Get heatmap hex color based on completion rate (for share templates)
 * @param completionRate - Completion rate percentage (0-100)
 * @returns Hex color string
 */
export function getHeatmapHexColor(completionRate: number): string {
  if (completionRate === 0) return '#F3F4F6'; // gray-100
  if (completionRate < 25) return '#DBEAFE'; // blue-100
  if (completionRate < 50) return '#93C5FD'; // blue-300
  if (completionRate < 75) return '#60A5FA'; // blue-400
  return '#3B82F6'; // blue-500
}

/**
 * Completion rate thresholds
 */
export const COMPLETION_THRESHOLDS = {
  PERFECT: 90,
  HIGH: 70,
  MEDIUM: 50,
  LOW: 30,
} as const;

/**
 * Get completion level based on rate
 * @param completionRate - Completion rate percentage (0-100)
 * @returns Completion level string
 */
export function getCompletionLevel(
  completionRate: number
): 'perfect' | 'high' | 'medium' | 'low' | 'none' {
  if (completionRate >= COMPLETION_THRESHOLDS.PERFECT) return 'perfect';
  if (completionRate >= COMPLETION_THRESHOLDS.HIGH) return 'high';
  if (completionRate >= COMPLETION_THRESHOLDS.MEDIUM) return 'medium';
  if (completionRate >= COMPLETION_THRESHOLDS.LOW) return 'low';
  return 'none';
}
