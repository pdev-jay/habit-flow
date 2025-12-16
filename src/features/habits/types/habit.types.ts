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
  // Health & Fitness (건강 & 운동)
  | 'water'
  | 'run'
  | 'dumbbell'
  | 'yoga'
  | 'meditation'
  | 'walk'
  | 'bike'
  | 'swim'
  | 'basketball'
  | 'tennis'
  | 'soccer'
  | 'weight-lifter'
  // Food & Nutrition (음식 & 영양)
  | 'food-apple'
  | 'food-variant'
  | 'coffee'
  | 'fruit-cherries'
  | 'carrot'
  | 'leaf'
  // Sleep & Rest (수면 & 휴식)
  | 'bed'
  | 'sleep'
  | 'power-sleep'
  // Health Care (건강 관리)
  | 'pill'
  | 'medical-bag'
  | 'heart-outline'
  | 'heart-pulse'
  | 'thermometer'
  // Learning & Reading (학습 & 독서)
  | 'book-open-variant'
  | 'book-open-page-variant'
  | 'brain'
  | 'school'
  | 'pencil'
  | 'notebook'
  | 'translate'
  // Creative & Hobbies (창작 & 취미)
  | 'guitar-acoustic'
  | 'palette'
  | 'brush'
  | 'music'
  | 'camera'
  | 'draw'
  | 'microphone'
  // Productivity (생산성)
  | 'clipboard-check'
  | 'calendar-check'
  | 'clock-outline'
  | 'timer-outline'
  | 'alarm'
  | 'laptop'
  // Social & Communication (소셜 & 커뮤니케이션)
  | 'account-group'
  | 'phone'
  | 'email'
  | 'chat'
  | 'video'
  // Mindfulness & Spiritual (명상 & 정신)
  | 'candle'
  | 'flower'
  | 'weather-sunny'
  | 'moon-waning-crescent'
  | 'star'
  // Cleaning & Household (청소 & 가사)
  | 'broom'
  | 'vacuum'
  | 'washing-machine'
  | 'hanger'
  // Finance (재무)
  | 'cash'
  | 'piggy-bank'
  | 'chart-line'
  // Nature & Environment (자연 & 환경)
  | 'tree'
  | 'sprout'
  | 'flower-tulip'
  | 'recycle'
  // Miscellaneous (기타)
  | 'trophy'
  | 'flag'
  | 'fire'
  | 'diamond'
  | 'lightbulb'
  | 'check'
  | 'target'
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
  completedAt?: string; // ISO timestamp when completed
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
  notificationsEnabled: boolean;
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

/**
 * 통계 관련 타입 Export
 */
export * from './stats.types';
