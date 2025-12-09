import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Habit 엔티티 타입
 */
export type FrequencyType = 'daily' | 'weekdays' | 'weekends' | 'custom';

/**
 * MaterialCommunityIcons에서 사용 가능한 아이콘 이름
 * Extract를 사용하여 타입 안전성 보장
 */
type MaterialIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

export type HabitIconName = Extract<
  MaterialIconName,
  | 'water'
  | 'run'
  | 'book-open-variant'
  | 'dumbbell'
  | 'meditation'
  | 'bed'
  | 'pill'
  | 'food-apple'
  | 'yoga'
  | 'guitar-acoustic'
  | 'palette'
  | 'brain'
  | 'heart-outline'
  | 'translate'
  | 'leaf'
>;

export interface Habit {
  id: string;
  name: string;
  icon: HabitIconName;
  color: string;
  frequency: FrequencyType;
  customDays?: number[];
  reminderTime?: string;
  reminderEnabled: boolean;
  createdAt: string;
  order: number;
}

export type CreateHabitInput = Omit<Habit, 'id' | 'createdAt' | 'order'>;

/**
 * HabitCheck 엔티티 타입
 */
export interface HabitCheck {
  habitId: string;
  date: string;
  completed: boolean;
}

/**
 * UserSettings 엔티티 타입
 */
export type ThemeType = 'light' | 'dark' | 'system';
export type LanguageType = 'ko' | 'en';

export interface UserSettings {
  theme: ThemeType;
  language: LanguageType;
  isPro: boolean;
}

/**
 * 통계 관련 타입
 */
export interface WeeklyStats {
  totalHabits: number;
  completedCount: number;
  completionRate: number;
  streakDays: number;
}

export interface DailyStats {
  date: string;
  totalHabits: number;
  completedCount: number;
}
