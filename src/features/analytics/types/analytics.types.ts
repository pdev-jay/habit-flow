/**
 * Analytics Event Names
 * 추적할 이벤트 타입들
 */
export type AnalyticsEventName =
  | 'habit_created'
  | 'habit_completed'
  | 'habit_deleted'
  | 'habit_updated'
  | 'habit_reordered'
  | 'wrapped_shared'
  | 'screen_view'
  | 'settings_changed'
  | 'reminder_set'
  | 'reminder_triggered';

/**
 * Analytics Event Parameters
 * 각 이벤트별 파라미터 타입 정의
 */
export type AnalyticsParams = {
  habit_created: {
    habit_id: string;
    frequency: string;
    has_reminder: boolean;
  };
  habit_completed: {
    habit_id: string;
    streak: number;
  };
  habit_deleted: {
    habit_id: string;
    streak_lost: number;
  };
  habit_updated: {
    habit_id: string;
    changed_fields: string[];
  };
  habit_reordered: {
    habit_count: number;
  };
  wrapped_shared: {
    template: 'weekly' | 'monthly';
    completion_rate: number;
  };
  screen_view: {
    screen_name: string;
    screen_class?: string;
  };
  settings_changed: {
    setting_name: string;
    new_value: string;
  };
  reminder_set: {
    habit_id: string;
    time: string;
  };
  reminder_triggered: {
    habit_id: string;
  };
};

/**
 * User Properties
 * Firebase Analytics에서 추적할 사용자 속성 (익명 추적만 사용)
 */
export interface UserProperties {
  total_habits?: number;
  is_pro?: boolean;
  preferred_language?: string;
  theme_mode?: string;
}

/**
 * Crashlytics Error Severity
 */
export type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info';

/**
 * Custom Error Context (익명 추적만 사용)
 */
export interface ErrorContext {
  screen?: string;
  action?: string;
  [key: string]: string | number | boolean | undefined;
}
