/**
 * 월별 통계 타입
 */
export interface MonthlyStats {
  totalHabits: number;
  averageCompletionRate: number;
  perfectDays: number;
  totalPossibleCount: number;
  completedCount: number;
  longestStreak: number;
}

/**
 * 일별 완료율 데이터 (히트맵용)
 */
export interface DayCompletionData {
  date: Date;
  completionRate: number;
  completedCount: number;
  totalHabits: number;
  isPerfect: boolean;
}

/**
 * 습관별 인사이트
 */
export interface HabitInsight {
  habitId: string;
  habitName: string;
  habitColor: string;
  habitIcon: string;
  completionRate: number;
  completedCount: number;
  totalCount: number;
  currentStreak: number;
  longestStreak: number;
  rank?: 1 | 2 | 3;
}

/**
 * 월간 인사이트 (MVP, 주의 필요, TOP 3)
 */
export interface MonthlyInsight {
  mvpHabit: HabitInsight | null;
  needsAttention: HabitInsight | null;
  topThree: HabitInsight[];
}

/**
 * 월별 비교 데이터
 */
export interface MonthComparison {
  currentMonth: MonthlyStats;
  previousMonth: MonthlyStats;
  completionRateDiff: number;
  perfectDaysDiff: number;
  streakDiff: number;
}

/**
 * 히트맵 셀 타입
 */
export type ColorIntensity = 'none' | 'low' | 'medium' | 'high' | 'perfect';

export interface HeatmapCell {
  date: Date;
  dateString: string;
  completionRate: number;
  colorIntensity: ColorIntensity;
  isCurrentMonth: boolean;
  isFuture: boolean;
}

/**
 * 통계 뷰 모드
 */
export type StatsViewMode = 'weekly' | 'monthly';
