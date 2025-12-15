/**
 * Global constants used across the app
 */

/**
 * Day of week indices
 */
export const WEEKDAYS = [1, 2, 3, 4, 5] as const;
export const WEEKENDS = [0, 6] as const;
export const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6] as const;

/**
 * Day names
 */
export const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export const DAY_NAMES_FULL = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

/**
 * Share template dimensions
 */
export const SHARE_TEMPLATE_WIDTH = 380;
export const SHARE_CARD_WIDTH = 350;

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  HABITS: 'habits',
  CHECKS: 'habit_checks',
  SETTINGS: 'settings',
} as const;
