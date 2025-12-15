import { useMemo } from 'react';
import { startOfWeek, endOfWeek } from 'date-fns';

import { formatDateToKey } from '@/lib/dateUtils';
import { useHabitStore, useHabitCheckStore } from '../api';
import { isHabitCreatedByDateString } from '../utils/dateUtils';
import type { WeeklyStats, DailyStats, Habit } from '../types';

/**
 * 주간 통계 계산 훅
 * - 파라미터 없이 호출 시 현재 주의 통계 반환
 * - startDate, endDate 제공 시 해당 기간의 통계 반환
 */
export function useWeeklyStats(startDate?: Date, endDate?: Date): WeeklyStats {
  const habits = useHabitStore((state) => state.habits);
  const checks = useHabitCheckStore((state) => state.checks);

  // 기본값: 현재 주의 시작일과 종료일 (월요일 시작)
  const defaultStartDate = startDate || startOfWeek(new Date(), { weekStartsOn: 1 });
  const defaultEndDate = endDate || endOfWeek(new Date(), { weekStartsOn: 1 });

  const stats = useMemo(() => {
    const totalHabits = habits.length;
    if (totalHabits === 0) {
      return {
        totalHabits: 0,
        completedCount: 0,
        completionRate: 0,
        streakDays: 0,
      };
    }

    // 날짜 범위 내 모든 날짜 생성
    const dates: string[] = [];
    const current = new Date(defaultStartDate);
    while (current <= defaultEndDate) {
      dates.push(formatDateToKey(current));
      current.setDate(current.getDate() + 1);
    }

    // 각 날짜별로 활성화된 습관의 완료 여부 체크
    let totalCompletedCount = 0;
    let totalPossibleCount = 0;

    dates.forEach((date) => {
      habits.forEach((habit) => {
        const isActiveForDate = isHabitActiveOnDate(habit, date);
        if (isActiveForDate) {
          totalPossibleCount++;
          const key = `${habit.id}_${date}`;
          const check = checks[key];
          if (check?.completed) {
            totalCompletedCount++;
          }
        }
      });
    });

    const completionRate =
      totalPossibleCount > 0
        ? parseFloat(((totalCompletedCount / totalPossibleCount) * 100).toFixed(1))
        : 0;

    // Streak 계산 (연속으로 모든 습관을 완료한 날)
    const streakDays = calculateWeeklyStreak(dates, habits, checks);

    return {
      totalHabits,
      completedCount: totalCompletedCount,
      completionRate,
      streakDays,
    };
  }, [habits, checks, defaultStartDate, defaultEndDate]);

  return stats;
}

/**
 * 일별 통계 배열 반환 훅
 * - Date 또는 string (YYYY-MM-DD) 형식 모두 허용
 * - 파라미터 없이 호출 시 현재 주의 통계 반환
 */
export function useDailyStatsRange(
  startDate?: Date | string,
  endDate?: Date | string
): DailyStats[] {
  const habits = useHabitStore((state) => state.habits);
  const checks = useHabitCheckStore((state) => state.checks);

  // 날짜 변환 헬퍼
  const parseDate = (date: Date | string | undefined, defaultDate: Date): Date => {
    if (!date) return defaultDate;
    if (typeof date === 'string') return new Date(date);
    return date;
  };

  // 기본값: 현재 주의 시작일과 종료일 (월요일 시작)
  const defaultStartDate = parseDate(startDate, startOfWeek(new Date(), { weekStartsOn: 1 }));
  const defaultEndDate = parseDate(endDate, endOfWeek(new Date(), { weekStartsOn: 1 }));

  const dailyStats = useMemo(() => {
    const stats: DailyStats[] = [];
    const current = new Date(defaultStartDate);

    while (current <= defaultEndDate) {
      const date = formatDateToKey(current);

      let totalHabitsForDay = 0;
      let completedCountForDay = 0;

      habits.forEach((habit) => {
        const isActive = isHabitActiveOnDate(habit, date);
        if (isActive) {
          totalHabitsForDay++;
          const key = `${habit.id}_${date}`;
          const check = checks[key];
          if (check?.completed) {
            completedCountForDay++;
          }
        }
      });

      stats.push({
        date,
        totalHabits: totalHabitsForDay,
        completedCount: completedCountForDay,
      });

      current.setDate(current.getDate() + 1);
    }

    return stats;
  }, [habits, checks, defaultStartDate, defaultEndDate]);

  return dailyStats;
}

/**
 * 습관이 특정 날짜(문자열)에 활성화되는지 확인 (생성일 + 요일)
 */
function isHabitActiveOnDate(
  habit: { createdAt: string; frequency: string; customDays?: number[] },
  dateString: string
): boolean {
  // 1. 생성일 체크
  if (!isHabitCreatedByDateString(habit, dateString)) {
    return false;
  }

  // 2. 요일 체크
  const dayOfWeek = new Date(dateString).getDay();

  switch (habit.frequency) {
    case 'daily':
      return true;
    case 'weekdays':
      return dayOfWeek >= 1 && dayOfWeek <= 5;
    case 'weekends':
      return dayOfWeek === 0 || dayOfWeek === 6;
    case 'custom':
      return habit.customDays?.includes(dayOfWeek) ?? false;
    default:
      return false;
  }
}

/**
 * 연속 streak 계산 (모든 습관을 완료한 날)
 * - 오늘은 제외하고 어제까지의 연속 달성일만 카운트
 * - 오늘은 아직 하루가 끝나지 않았으므로 streak에 포함하지 않음
 */
function calculateWeeklyStreak(
  dates: string[],
  habits: Habit[],
  checks: Record<string, { completed: boolean }>
): number {
  let streak = 0;
  const today = formatDateToKey(new Date());

  // 오늘 제외하고 어제까지의 날짜만 필터링 (오늘은 아직 진행 중)
  const pastDates = dates.filter((date) => date < today);
  const reversedDates = [...pastDates].reverse();

  for (const date of reversedDates) {
    let allCompleted = true;
    let hasActiveHabits = false;

    for (const habit of habits) {
      const isActive = isHabitActiveOnDate(habit, date);
      if (isActive) {
        hasActiveHabits = true;
        const key = `${habit.id}_${date}`;
        const check = checks[key];
        if (!check?.completed) {
          allCompleted = false;
          break;
        }
      }
    }

    if (hasActiveHabits && allCompleted) {
      streak++;
    } else if (hasActiveHabits) {
      break;
    }
  }

  return streak;
}
