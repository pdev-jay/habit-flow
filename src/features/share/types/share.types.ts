/**
 * Share feature type definitions
 */

/**
 * Props for WeeklyShareCard component
 * Displays weekly habit completion statistics
 */
export interface WeeklyShareCardProps {
  /** Completion rate percentage (0-100) */
  completionRate: number;
  /** Number of completed habits */
  completedCount: number;
  /** Total number of habits */
  totalCount: number;
  /** Current streak in days */
  streakDays: number;
  /** Date range string (e.g., "12월 8일 ~ 12월 14일") */
  dateRange: string;
}

/**
 * Heatmap day data
 */
export interface HeatmapDay {
  /** Date string (YYYY-MM-DD) */
  date: string;
  /** Completion rate for this day (0-100) */
  completionRate: number;
}

/**
 * Props for MonthlyHeatmapShare component
 * Displays monthly habit completion heatmap
 */
export interface MonthlyHeatmapShareProps {
  /** Month string (e.g., "2024년 12월") */
  month: string;
  /** Array of heatmap day data (35 days for 5 weeks) */
  days: HeatmapDay[];
  /** Total number of habits tracked */
  totalHabits: number;
  /** Number of perfect days (100% completion) */
  perfectDays: number;
}

/**
 * Props for MilestoneShareCard component
 * Displays achievement milestone badge
 */
export interface MilestoneShareCardProps {
  /** Habit name */
  habitName: string;
  /** Material Community Icon name */
  icon: string;
  /** Milestone days (7, 14, 30, 50, 100, 200, 365) */
  milestone: number;
  /** Start date string (e.g., "2024.09.06") */
  startDate: string;
  /** End date string (e.g., "2024.12.14") */
  endDate: string;
}

/**
 * Badge style configuration
 */
export interface BadgeStyle {
  /** Gradient colors */
  colors: [string, string];
  /** Badge emoji */
  emoji: string;
  /** Badge title */
  title: string;
}

/**
 * Share action type
 */
export type ShareAction = 'save' | 'share' | 'both';

/**
 * Image capture options
 */
export interface CaptureOptions {
  /** Image format (png or jpg) */
  format?: 'png' | 'jpg';
  /** Image quality (0-1) */
  quality?: number;
  /** Result type (data URI or temp file) */
  result?: 'tmpfile' | 'base64' | 'zip-base64' | 'data-uri';
}

/**
 * Share image result
 */
export interface ShareImageResult {
  /** Whether the action was successful */
  success: boolean;
  /** URI of the saved/shared image */
  uri?: string;
  /** Error message if failed */
  error?: string;
}

/**
 * Template style types
 */
export type TemplateStyle = 'wrapped' | 'minimal' | 'glassmorphism' | 'brutalist' | 'ticket';

/**
 * Template period types
 */
export type TemplatePeriod = 'weekly' | 'monthly';

/**
 * Habit progress data for template
 */
export interface HabitProgress {
  /** Habit ID */
  id: string;
  /** Habit name */
  name: string;
  /** Material Community Icon name */
  icon: string;
  /** Habit color */
  color: string;
  /** Completion rate percentage (0-100) */
  completionRate: number;
  /** Number of completed days */
  completedDays: number;
  /** Total applicable days */
  totalDays: number;
  /** Current streak */
  streak: number;
}

/**
 * Weekly statistics for template
 */
export interface WeeklyStats {
  /** Overall completion rate percentage (0-100) */
  completionRate: number;
  /** Total completed count */
  completedCount: number;
  /** Total count */
  totalCount: number;
  /** Current streak in days */
  streakDays: number;
  /** Date range string (e.g., "12월 8일 ~ 12월 14일") */
  dateRange: string;
  /** Week number */
  weekNumber: number;
  /** Habit progress data sorted by completion rate */
  habits: HabitProgress[];
}

/**
 * Monthly statistics for template
 */
export interface MonthlyStats {
  /** Month string (e.g., "2024년 12월") */
  month: string;
  /** Year */
  year: number;
  /** Average completion rate percentage (0-100) */
  averageCompletionRate: number;
  /** Number of perfect days (all habits completed) */
  perfectDays: number;
  /** Maximum streak in the month */
  maxStreak: number;
  /** Total number of habits */
  totalHabits: number;
  /** Habit progress data sorted by completion rate */
  habits: HabitProgress[];
}
