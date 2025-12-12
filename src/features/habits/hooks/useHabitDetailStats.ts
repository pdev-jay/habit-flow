import { useMemo } from 'react';
import { useHabitCheckStore } from '../stores';
import { useHabits } from './useHabits';
import { calculateStreak } from '../utils/streakUtils';
import type { Habit, HabitCheck } from '../types/habit.types';

/**
 * 습관 상세 통계 타입
 */
export interface HabitDetailStats {
  currentStreak: number;
  totalCompletions: number;
  longestStreakEver: number;
  overallCompletionRate: number;
}

/**
 * 날짜 문자열을 YYYY-MM-DD 형식으로 변환
 */
function formatDateToKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 습관의 활성 요일 목록 가져오기
 */
function getActiveDays(habit: Habit): number[] {
  switch (habit.frequency) {
    case 'daily':
      return [0, 1, 2, 3, 4, 5, 6];
    case 'weekdays':
      return [1, 2, 3, 4, 5];
    case 'weekends':
      return [0, 6];
    case 'custom':
      return habit.customDays || [];
    default:
      return [];
  }
}

/**
 * 특정 날짜가 습관의 활성 요일인지 확인
 */
function isActiveDayForHabit(habit: Habit, date: Date): boolean {
  const weekdayIndex = date.getDay();
  const activeDays = getActiveDays(habit);
  return activeDays.includes(weekdayIndex);
}

/**
 * 최장 연속 기록 계산
 *
 * @description
 * - 전체 체크 기록에서 가장 긴 연속 구간 찾기
 * - 습관의 활성 요일만 고려
 * - 습관 생성일 이전은 카운트 안 함
 *
 * @example
 * 완료 날짜: [2024-01-01, 2024-01-02, 2024-01-03, 2024-01-05, 2024-01-06]
 * 최장 연속: 3일 (2024-01-01 ~ 2024-01-03)
 *
 * @param habit - 습관 객체
 * @param checks - 해당 습관의 전체 체크 기록
 * @returns 최장 연속 달성 일수
 */
function calculateLongestStreak(habit: Habit, checks: HabitCheck[]): number {
  const activeDays = getActiveDays(habit);
  if (activeDays.length === 0) {
    return 0;
  }

  const createdAt = new Date(habit.createdAt);
  createdAt.setHours(0, 0, 0, 0);

  // 완료된 체크만 추출하고 날짜순 정렬
  const completedDates = checks
    .filter((check) => check.completed)
    .map((check) => new Date(check.date))
    .filter((date) => {
      date.setHours(0, 0, 0, 0);
      return date >= createdAt;
    })
    .sort((a, b) => a.getTime() - b.getTime());

  if (completedDates.length === 0) {
    return 0;
  }

  // 완료된 날짜를 Set으로 변환 (빠른 조회)
  const completedDateSet = new Set<string>(completedDates.map((date) => formatDateToKey(date)));

  let maxStreak = 0;
  let currentStreak = 0;
  let currentDate = new Date(createdAt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 생성일부터 오늘까지 순회
  while (currentDate <= today) {
    // 활성 요일인 경우에만 체크
    if (isActiveDayForHabit(habit, currentDate)) {
      const dateKey = formatDateToKey(currentDate);

      if (completedDateSet.has(dateKey)) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return maxStreak;
}

/**
 * 전체 달성률 계산
 *
 * @description
 * - habit.createdAt부터 오늘까지 활성 날짜 수 계산
 * - 활성 날짜 = frequency에 따라 습관이 활성화된 날짜
 * - 달성률 = completedCount / totalActiveDays * 100
 *
 * @example
 * 습관: 평일만 (weekdays)
 * 생성일: 2024-01-01 (월요일)
 * 오늘: 2024-01-05 (금요일)
 * 활성 날짜: 5일 (월~금)
 * 완료: 3일
 * 달성률: 60%
 *
 * @param habit - 습관 객체
 * @param completedCount - 완료된 날짜 수
 * @returns 전체 달성률 (0-100)
 */
function calculateOverallCompletionRate(habit: Habit, completedCount: number): number {
  const activeDays = getActiveDays(habit);
  if (activeDays.length === 0) {
    return 0;
  }

  const createdAt = new Date(habit.createdAt);
  createdAt.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 생성일부터 오늘까지 활성 날짜 수 계산
  let totalActiveDays = 0;
  let currentDate = new Date(createdAt);

  while (currentDate <= today) {
    if (isActiveDayForHabit(habit, currentDate)) {
      totalActiveDays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  if (totalActiveDays === 0) {
    return 0;
  }

  return Math.round((completedCount / totalActiveDays) * 100);
}

/**
 * 습관 상세 통계 계산 훅
 *
 * @description
 * - 현재 연속 기록 (currentStreak)
 * - 전체 완료 횟수 (totalCompletions)
 * - 최장 연속 기록 (longestStreakEver)
 * - 전체 달성률 (overallCompletionRate)
 *
 * @param habitId - 습관 ID
 * @returns 습관 상세 통계
 *
 * @example
 * ```tsx
 * function HabitDetailScreen({ habitId }: { habitId: string }) {
 *   const stats = useHabitDetailStats(habitId);
 *
 *   return (
 *     <View>
 *       <Text>현재 연속: {stats.currentStreak}일</Text>
 *       <Text>전체 완료: {stats.totalCompletions}회</Text>
 *       <Text>최장 연속: {stats.longestStreakEver}일</Text>
 *       <Text>전체 달성률: {stats.overallCompletionRate}%</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useHabitDetailStats(habitId: string): HabitDetailStats {
  const { getHabitById } = useHabits();
  const getChecksByHabitId = useHabitCheckStore((state) => state.getChecksByHabitId);

  const stats = useMemo(() => {
    const habit = getHabitById(habitId);

    // 습관을 찾을 수 없는 경우 기본값 반환
    if (!habit) {
      return {
        currentStreak: 0,
        totalCompletions: 0,
        longestStreakEver: 0,
        overallCompletionRate: 0,
      };
    }

    const checks = getChecksByHabitId(habitId);
    const completedChecks = checks.filter((check) => check.completed);

    // 현재 연속 기록
    const currentStreak = calculateStreak(habit, checks);

    // 전체 완료 횟수
    const totalCompletions = completedChecks.length;

    // 최장 연속 기록
    const longestStreakEver = calculateLongestStreak(habit, checks);

    // 전체 달성률
    const overallCompletionRate = calculateOverallCompletionRate(habit, totalCompletions);

    return {
      currentStreak,
      totalCompletions,
      longestStreakEver,
      overallCompletionRate,
    };
  }, [habitId, getHabitById, getChecksByHabitId]);

  return stats;
}
