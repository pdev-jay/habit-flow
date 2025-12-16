import { useCallback } from 'react';
import { useHabitCheckStore } from '../api';
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics';

/**
 * 습관 체크 상태 관리 훅 (범용)
 * - 인자 없이 호출 시 getCheckStatus, toggle 함수 제공
 * - habitId, date와 함께 호출 시 특정 습관의 상태 제공 (하위 호환성)
 */
export function useHabitCheck(): {
  getCheckStatus: (habitId: string, date: string) => boolean;
  toggle: (habitId: string, date: string) => void;
};
export function useHabitCheck(
  habitId: string,
  date: string
): {
  isCompleted: boolean;
  toggle: () => void;
};
export function useHabitCheck(habitId?: string, date?: string) {
  const checks = useHabitCheckStore((state) => state.checks);
  const toggleCheck = useHabitCheckStore((state) => state.toggleCheck);
  const { logEvent } = useAnalytics();

  // 범용 함수들 (항상 생성)
  const getCheckStatus = useCallback(
    (checkHabitId: string, checkDate: string): boolean => {
      const key = `${checkHabitId}_${checkDate}`;
      const check = checks[key];
      return check?.completed ?? false;
    },
    [checks]
  );

  const toggleWithParams = useCallback(
    (toggleHabitId: string, toggleDate: string) => {
      const key = `${toggleHabitId}_${toggleDate}`;
      const wasCompleted = checks[key]?.completed ?? false;

      toggleCheck(toggleHabitId, toggleDate);

      // Log analytics only when marking as complete
      if (!wasCompleted) {
        logEvent('habit_completed', {
          habit_id: toggleHabitId,
          streak: 0, // TODO: Calculate actual streak
        });
      }
    },
    [toggleCheck, checks, logEvent]
  );

  // 특정 습관용 함수들 (항상 생성)
  const key = habitId && date ? `${habitId}_${date}` : '';
  const check = key ? checks[key] : undefined;
  const isCompleted = check?.completed ?? false;

  const toggleSpecific = useCallback(() => {
    if (habitId && date) {
      const wasCompleted = isCompleted;
      toggleCheck(habitId, date);

      // Log analytics only when marking as complete
      if (!wasCompleted) {
        logEvent('habit_completed', {
          habit_id: habitId,
          streak: 0, // TODO: Calculate actual streak
        });
      }
    }
  }, [habitId, date, isCompleted, toggleCheck, logEvent]);

  // 인자 없이 호출된 경우 - 범용 함수 제공
  if (habitId === undefined || date === undefined) {
    return {
      getCheckStatus,
      toggle: toggleWithParams,
    };
  }

  // 인자와 함께 호출된 경우 - 특정 습관 상태 제공
  return {
    isCompleted,
    toggle: toggleSpecific,
  };
}

/**
 * 특정 습관의 전체 체크 기록 조회 훅
 */
export function useHabitChecks(habitId: string) {
  const getChecksByHabitId = useHabitCheckStore((state) => state.getChecksByHabitId);

  const checks = getChecksByHabitId(habitId);

  /**
   * 완료된 체크만 필터링
   */
  const completedChecks = useCallback(() => {
    return checks.filter((check) => check.completed);
  }, [checks]);

  /**
   * 연속 streak 계산
   */
  const calculateStreak = useCallback((): number => {
    const completed = completedChecks();
    if (completed.length === 0) return 0;

    // 날짜 정렬 (최신순)
    const sortedDates = completed
      .map((c) => new Date(c.date))
      .sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
      const checkDate = new Date(sortedDates[i]);
      checkDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - streak);

      if (checkDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [completedChecks]);

  return {
    checks,
    completedChecks: completedChecks(),
    streak: calculateStreak(),
  };
}

/**
 * 특정 날짜의 모든 체크 조회 훅
 */
export function useDailyChecks(date: string) {
  const getChecksByDate = useHabitCheckStore((state) => state.getChecksByDate);

  const checks = getChecksByDate(date);

  const completedCount = checks.filter((check) => check.completed).length;
  const totalCount = checks.length;

  return {
    checks,
    completedCount,
    totalCount,
    completionRate: totalCount > 0 ? completedCount / totalCount : 0,
  };
}
