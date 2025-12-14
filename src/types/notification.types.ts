/**
 * Notification types and constants
 */

export enum NotificationType {
  HABIT_REMINDER = 'HABIT_REMINDER',
  END_OF_DAY = 'END_OF_DAY',
  ACHIEVEMENT = 'ACHIEVEMENT',
}

export interface NotificationMetadata {
  lastScheduledDate: string | null;
  achievementMilestones: Record<string, number>;
}

export const ACHIEVEMENT_MILESTONES = [7, 14, 30, 50, 100, 200, 365] as const;
export type AchievementMilestone = (typeof ACHIEVEMENT_MILESTONES)[number];

export const END_OF_DAY_REMINDER_TIME = {
  hour: 21, // 9 PM
  minute: 0,
} as const;
