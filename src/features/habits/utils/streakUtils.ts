import { formatDateToKey } from '@/lib/dateUtils';
import { isActiveDayForHabit, getActiveDays } from './habitUtils';
import type { Habit, HabitCheck } from '../types/habit.types';

/**
 * 연속 달성 일수(스트릭) 계산
 *
 * @description
 * - 오늘부터 역순으로 연속 완료된 날짜 수 계산
 * - 습관의 활성 요일(customDays)만 체크
 * - 하루라도 빠지면 0으로 리셋
 * - 습관 생성일 이전은 카운트 안 함
 *
 * @example
 * 습관: 월/수/금 (customDays: [1, 3, 5])
 * 오늘: 2024-01-12 (금요일)
 *
 * 2024-01-12 (금) ✓ → 카운트: 1
 * 2024-01-10 (수) ✓ → 카운트: 2
 * 2024-01-08 (월) ✓ → 카운트: 3
 * 2024-01-05 (금) ✗ → 중단! 스트릭 = 3
 *
 * @param habit - 습관 객체
 * @param checks - 해당 습관의 전체 체크 기록
 * @returns 연속 달성 일수
 */
export function calculateStreak(habit: Habit, checks: HabitCheck[]): number {
  // 활성 요일이 없으면 0 반환
  const activeDays = getActiveDays(habit);
  if (activeDays.length === 0) {
    return 0;
  }

  // 습관 생성일
  const createdAt = new Date(habit.createdAt);
  createdAt.setHours(0, 0, 0, 0);

  // 완료된 체크만 추출하고 Map으로 변환 (빠른 조회)
  const completedDates = new Set<string>(
    checks.filter((check) => check.completed).map((check) => check.date)
  );

  // 오늘부터 역순으로 체크
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentDate = new Date(today);

  // 오늘이 활성 요일이 아니면 가장 최근 활성 요일부터 시작
  while (currentDate >= createdAt && !isActiveDayForHabit(habit, currentDate)) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  // 역순으로 연속 체크
  while (currentDate >= createdAt) {
    // 활성 요일인 경우에만 체크
    if (isActiveDayForHabit(habit, currentDate)) {
      const dateKey = formatDateToKey(currentDate);

      if (completedDates.has(dateKey)) {
        streak++;
      } else {
        // 하루라도 빠지면 중단
        break;
      }
    }

    // 다음 날로 이동 (역순)
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}

/**
 * 여러 습관의 스트릭을 일괄 계산
 * @param habits - 습관 배열
 * @param allChecks - 전체 체크 기록 (habitId를 key로 하는 Map)
 * @returns habitId를 key로 하는 스트릭 Map
 */
export function calculateStreaksForHabits(
  habits: Habit[],
  allChecks: Record<string, HabitCheck[]>
): Record<string, number> {
  const streaks: Record<string, number> = {};

  habits.forEach((habit) => {
    const checks = allChecks[habit.id] || [];
    streaks[habit.id] = calculateStreak(habit, checks);
  });

  return streaks;
}
