// React Native
import { Platform, Alert, Linking } from 'react-native';

// Expo
import * as Notifications from 'expo-notifications';

// Internal imports
import i18n from '@/i18n';
import type { Habit } from '@/features/habits/types';
import { storage } from '@/features/habits/stores/storage';
import { isHabitActiveOnDate, formatDate } from '@/lib/utils';
import {
  NotificationType,
  type NotificationMetadata,
  ACHIEVEMENT_MILESTONES,
  type AchievementMilestone,
  END_OF_DAY_REMINDER_TIME,
} from '@/types/notification.types';

const NOTIFICATION_METADATA_KEY = 'notification-metadata';
const DAYS_AHEAD = 7; // 7-day rolling window for iOS 64 notification limit

/**
 * Set notification handler for foreground notifications
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Parse time string to hour and minute
 * @param timeStr - Time string like "9:00 am" or "21:00"
 * @returns {hour, minute}
 */
function parseTimeString(timeStr: string): { hour: number; minute: number } {
  try {
    // Remove extra spaces and convert to lowercase
    const normalized = timeStr.trim().toLowerCase();

    // Match pattern like "9:00 am" or "9:00am"
    const match = normalized.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/);
    if (!match) {
      return { hour: 9, minute: 0 }; // Default to 9:00 AM
    }

    let hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    const period = match[3];

    // Convert to 24-hour format if period exists
    if (period === 'pm' && hour !== 12) {
      hour += 12;
    } else if (period === 'am' && hour === 12) {
      hour = 0;
    }

    return { hour, minute };
  } catch (error) {
    console.error('Failed to parse time string:', error);
    return { hour: 9, minute: 0 };
  }
}

/**
 * Get notification metadata from storage
 */
function getNotificationMetadata(): NotificationMetadata {
  try {
    const data = storage.getString(NOTIFICATION_METADATA_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to get notification metadata:', error);
  }

  return {
    lastScheduledDate: null,
    achievementMilestones: {},
  };
}

/**
 * Save notification metadata to storage
 */
function saveNotificationMetadata(metadata: NotificationMetadata): void {
  try {
    storage.set(NOTIFICATION_METADATA_KEY, JSON.stringify(metadata));
  } catch (error) {
    console.error('Failed to save notification metadata:', error);
  }
}

/**
 * Request notification permissions
 * @returns true if granted, false otherwise
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert(
        i18n.t('common:notifications.permissionDenied.title'),
        i18n.t('common:notifications.permissionDenied.message'),
        [
          { text: i18n.t('common:cancel'), style: 'cancel' },
          {
            text: i18n.t('common:settings'),
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            },
          },
        ]
      );
      return false;
    }

    // Set up Android notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return true;
  } catch (error) {
    console.error('Failed to request notification permissions:', error);
    return false;
  }
}

/**
 * Check if notification permissions are granted
 */
export async function hasNotificationPermissions(): Promise<boolean> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Failed to check notification permissions:', error);
    return false;
  }
}

/**
 * Schedule habit reminder notifications
 * @param habit - Habit object
 * @param daysAhead - Number of days to schedule ahead (default: 7)
 */
export async function scheduleHabitReminders(
  habit: Habit,
  daysAhead: number = DAYS_AHEAD
): Promise<void> {
  try {
    if (!habit.reminderEnabled || !habit.reminderTime) {
      return;
    }

    const { hour, minute } = parseTimeString(habit.reminderTime);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < daysAhead; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);

      // Check if habit is active on this date
      if (!isHabitActiveOnDate(habit.frequency, habit.customDays, targetDate)) {
        continue;
      }

      // Set notification time
      const notificationDate = new Date(targetDate);
      notificationDate.setHours(hour, minute, 0, 0);

      // Skip if time has already passed
      if (notificationDate <= new Date()) {
        continue;
      }

      const identifier = `habit-${habit.id}-${formatDate(targetDate)}`;

      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: i18n.t('common:notifications.habitReminder.title'),
          body: i18n.t('common:notifications.habitReminder.body', { habitName: habit.name }),
          data: {
            type: NotificationType.HABIT_REMINDER,
            habitId: habit.id,
            date: formatDate(targetDate),
          },
        },
        trigger: { date: notificationDate, type: Notifications.SchedulableTriggerInputTypes.DATE },
      });
    }
  } catch (error) {
    console.error('Failed to schedule habit reminders:', error);
    throw error;
  }
}

/**
 * Schedule end-of-day reminder notifications
 * @param daysAhead - Number of days to schedule ahead (default: 7)
 */
export async function scheduleEndOfDayReminders(daysAhead: number = DAYS_AHEAD): Promise<void> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < daysAhead; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);

      const notificationDate = new Date(targetDate);
      notificationDate.setHours(
        END_OF_DAY_REMINDER_TIME.hour,
        END_OF_DAY_REMINDER_TIME.minute,
        0,
        0
      );

      // Skip if time has already passed
      if (notificationDate <= new Date()) {
        continue;
      }

      const identifier = `end-of-day-${formatDate(targetDate)}`;

      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: i18n.t('common:notifications.endOfDay.title'),
          body: i18n.t('common:notifications.endOfDay.body'),
          data: {
            type: NotificationType.END_OF_DAY,
            date: formatDate(targetDate),
          },
        },
        trigger: { date: notificationDate, type: Notifications.SchedulableTriggerInputTypes.DATE },
      });
    }
  } catch (error) {
    console.error('Failed to schedule end-of-day reminders:', error);
    throw error;
  }
}

/**
 * Cancel all notifications for a specific habit
 * @param habitId - Habit ID
 */
export async function cancelHabitNotifications(habitId: string): Promise<void> {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const habitNotificationIds = scheduledNotifications
      .filter((notification: Notifications.NotificationRequest) =>
        notification.identifier.startsWith(`habit-${habitId}-`)
      )
      .map((notification: Notifications.NotificationRequest) => notification.identifier);

    for (const id of habitNotificationIds) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
  } catch (error) {
    console.error('Failed to cancel habit notifications:', error);
    throw error;
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Failed to cancel all notifications:', error);
    throw error;
  }
}

/**
 * Reschedule all habit notifications
 * @param habits - Array of all habits
 */
export async function rescheduleAllHabits(habits: Habit[]): Promise<void> {
  try {
    // Cancel all existing notifications
    await cancelAllNotifications();

    // Schedule habit reminders
    for (const habit of habits) {
      if (habit.reminderEnabled) {
        await scheduleHabitReminders(habit);
      }
    }

    // Schedule end-of-day reminders
    await scheduleEndOfDayReminders();

    // Update metadata
    const metadata = getNotificationMetadata();
    metadata.lastScheduledDate = formatDate(new Date());
    saveNotificationMetadata(metadata);
  } catch (error) {
    console.error('Failed to reschedule all habits:', error);
    throw error;
  }
}

/**
 * Trigger immediate achievement notification
 * @param habitName - Name of the habit
 * @param milestone - Achievement milestone (7, 14, 30, etc.)
 */
export async function triggerAchievementNotification(
  habitName: string,
  milestone: AchievementMilestone
): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t('common:notifications.achievement.title'),
        body: i18n.t('common:notifications.achievement.body', {
          habitName,
          days: milestone,
        }),
        data: {
          type: NotificationType.ACHIEVEMENT,
          habitName,
          milestone,
        },
      },
      trigger: null, // Immediate notification
    });
  } catch (error) {
    console.error('Failed to trigger achievement notification:', error);
    throw error;
  }
}

/**
 * Check and update milestone for a habit
 * @param habitId - Habit ID
 * @param currentStreak - Current streak count
 * @returns The milestone if reached, null otherwise
 */
export function checkAndUpdateMilestone(
  habitId: string,
  currentStreak: number
): AchievementMilestone | null {
  try {
    const metadata = getNotificationMetadata();
    const lastMilestone = metadata.achievementMilestones[habitId] || 0;

    // Find the next milestone
    const nextMilestone = ACHIEVEMENT_MILESTONES.find(
      (milestone) => milestone > lastMilestone && currentStreak >= milestone
    );

    if (nextMilestone) {
      // Update metadata
      metadata.achievementMilestones[habitId] = nextMilestone;
      saveNotificationMetadata(metadata);
      return nextMilestone;
    }

    return null;
  } catch (error) {
    console.error('Failed to check milestone:', error);
    return null;
  }
}

/**
 * Clear achievement milestone for a deleted habit
 * Prevents memory accumulation in MMKV storage
 * @param habitId - ID of the habit to clear milestone for
 */
export function clearHabitMilestone(habitId: string): void {
  try {
    const metadata = getNotificationMetadata();
    delete metadata.achievementMilestones[habitId];
    saveNotificationMetadata(metadata);
    console.log(`[NotificationService] Cleared milestone for habit: ${habitId}`);
  } catch (error) {
    console.error('Failed to clear habit milestone:', error);
  }
}

/**
 * Check if notifications need to be rescheduled
 * @returns true if rescheduling is needed
 */
export function shouldReschedule(): boolean {
  try {
    const metadata = getNotificationMetadata();
    if (!metadata.lastScheduledDate) {
      return true;
    }

    const lastScheduled = new Date(metadata.lastScheduledDate);
    const today = new Date();
    const daysSinceLastSchedule = Math.floor(
      (today.getTime() - lastScheduled.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Reschedule if it's been more than 3 days
    return daysSinceLastSchedule >= 3;
  } catch (error) {
    console.error('Failed to check if reschedule is needed:', error);
    return true;
  }
}
