import { useMemo } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isFuture, isBefore } from 'date-fns';
import { useHabitStore } from '../api/habitStore';
import { useHabitCheckStore } from '../api/habitCheckStore';
import { calculateStreak } from '../utils/streakUtils';
import { isHabitCreatedByDate } from '../utils/dateUtils';
import type { MonthlyStats, DayCompletionData, HabitInsight } from '../types/stats.types';
import type { Habit } from '../types';

/**
 * 월별 통계 계산 훅
 * @param date - 기준 날짜 (해당 월의 통계 계산)
 * @returns 월별 통계 데이터
 */
export function useMonthlyStats(date: Date): MonthlyStats {
  const habits = useHabitStore((state) => state.habits);
  const checks = useHabitCheckStore((state) => state.checks);

  const stats = useMemo(() => {
    const totalHabits = habits.length;
    if (totalHabits === 0) {
      return {
        totalHabits: 0,
        averageCompletionRate: 0,
        perfectDays: 0,
        totalPossibleCount: 0,
        completedCount: 0,
        longestStreak: 0,
      };
    }

    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const today = new Date();

    // 해당 월의 모든 날짜 생성 (오늘 이전만)
    const allDaysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const pastDays = allDaysInMonth.filter((day) => !isFuture(day) && isBefore(day, today));

    let totalCompletedCount = 0;
    let totalPossibleCount = 0;
    let perfectDays = 0;

    // 각 날짜별로 통계 계산
    pastDays.forEach((day) => {
      const dateString = format(day, 'yyyy-MM-dd');

      let dayCompletedCount = 0;
      let dayPossibleCount = 0;

      habits.forEach((habit) => {
        const isActive = isHabitActiveOnDate(habit, day);
        if (isActive) {
          dayPossibleCount++;
          const key = `${habit.id}_${dateString}`;
          const check = checks[key];
          if (check?.completed) {
            dayCompletedCount++;
          }
        }
      });

      totalPossibleCount += dayPossibleCount;
      totalCompletedCount += dayCompletedCount;

      // Perfect day: 모든 활성 습관 완료
      if (dayPossibleCount > 0 && dayCompletedCount === dayPossibleCount) {
        perfectDays++;
      }
    });

    const averageCompletionRate =
      totalPossibleCount > 0
        ? parseFloat(((totalCompletedCount / totalPossibleCount) * 100).toFixed(1))
        : 0;

    // 최장 연속 달성 일수 계산
    const longestStreak = calculateLongestStreak(pastDays, habits, checks);

    return {
      totalHabits,
      averageCompletionRate,
      perfectDays,
      totalPossibleCount,
      completedCount: totalCompletedCount,
      longestStreak,
    };
  }, [date, habits, checks]);

  return stats;
}

/**
 * 월별 히트맵 데이터 훅
 * @param date - 기준 날짜
 * @returns 일별 완료율 배열
 */
export function useMonthlyHeatmapData(date: Date): DayCompletionData[] {
  const habits = useHabitStore((state) => state.habits);
  const checks = useHabitCheckStore((state) => state.checks);

  const heatmapData = useMemo(() => {
    if (habits.length === 0) {
      return [];
    }

    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const allDaysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const data: DayCompletionData[] = allDaysInMonth.map((day) => {
      const dateString = format(day, 'yyyy-MM-dd');

      let completedCount = 0;
      let totalHabits = 0;

      habits.forEach((habit) => {
        const isActive = isHabitActiveOnDate(habit, day);
        if (isActive) {
          totalHabits++;
          const key = `${habit.id}_${dateString}`;
          const check = checks[key];
          if (check?.completed) {
            completedCount++;
          }
        }
      });

      const completionRate =
        totalHabits > 0 ? parseFloat(((completedCount / totalHabits) * 100).toFixed(1)) : 0;

      const isPerfect = totalHabits > 0 && completedCount === totalHabits;

      return {
        date: day,
        completionRate,
        completedCount,
        totalHabits,
        isPerfect,
      };
    });

    return data;
  }, [date, habits, checks]);

  return heatmapData;
}

/**
 * 습관별 인사이트 계산 훅
 * @param date - 기준 날짜 (해당 월의 통계 계산)
 * @returns 습관별 인사이트 배열 (완료율 내림차순 정렬)
 */
export function useHabitInsights(date: Date): HabitInsight[] {
  const habits = useHabitStore((state) => state.habits);
  const checks = useHabitCheckStore((state) => state.checks);
  const getChecksByHabitId = useHabitCheckStore((state) => state.getChecksByHabitId);

  const insights = useMemo(() => {
    if (habits.length === 0) {
      return [];
    }

    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const today = new Date();

    // 해당 월의 모든 날짜 생성 (오늘 이전만)
    const allDaysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const pastDays = allDaysInMonth.filter((day) => !isFuture(day) && isBefore(day, today));

    const habitInsights: HabitInsight[] = habits.map((habit) => {
      let completedCount = 0;
      let totalCount = 0;

      // 해당 월의 각 날짜에 대해 습관의 활성 여부 및 완료 여부 체크
      pastDays.forEach((day) => {
        const dateString = format(day, 'yyyy-MM-dd');

        const isActive = isHabitActiveOnDate(habit, day);
        if (isActive) {
          totalCount++;
          const key = `${habit.id}_${dateString}`;
          const check = checks[key];
          if (check?.completed) {
            completedCount++;
          }
        }
      });

      const completionRate =
        totalCount > 0 ? parseFloat(((completedCount / totalCount) * 100).toFixed(1)) : 0;

      // 현재 스트릭 계산 (전체 기간 기준)
      const habitChecks = getChecksByHabitId(habit.id);
      const currentStreak = calculateStreak(habit, habitChecks);

      // 최장 스트릭 계산 (해당 월 기준)
      const longestStreak = calculateHabitLongestStreak(pastDays, habit, checks);

      return {
        habitId: habit.id,
        habitName: habit.name,
        habitColor: habit.color,
        habitIcon: habit.icon,
        completionRate,
        completedCount,
        totalCount,
        currentStreak,
        longestStreak,
      };
    });

    // 완료율 기준 내림차순 정렬
    return habitInsights.sort((a, b) => b.completionRate - a.completionRate);
  }, [date, habits, checks, getChecksByHabitId]);

  return insights;
}

/**
 * 습관이 특정 날짜에 활성화되는지 확인 (생성일 + 요일)
 */
function isHabitActiveOnDate(habit: Habit, date: Date): boolean {
  // 1. 생성일 체크
  if (!isHabitCreatedByDate(habit, date)) {
    return false;
  }

  // 2. 요일 체크
  const dayOfWeek = date.getDay();

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
 * 최장 연속 달성 일수 계산
 * - 모든 활성 습관을 완료한 날의 최장 연속 기록
 */
function calculateLongestStreak(
  days: Date[],
  habits: Habit[],
  checks: Record<string, { completed: boolean }>
): number {
  let maxStreak = 0;
  let currentStreak = 0;

  for (const day of days) {
    const dateString = format(day, 'yyyy-MM-dd');

    let allCompleted = true;
    let hasActiveHabits = false;

    for (const habit of habits) {
      const isActive = isHabitActiveOnDate(habit, day);
      if (isActive) {
        hasActiveHabits = true;
        const key = `${habit.id}_${dateString}`;
        const check = checks[key];
        if (!check?.completed) {
          allCompleted = false;
          break;
        }
      }
    }

    if (hasActiveHabits && allCompleted) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else if (hasActiveHabits) {
      currentStreak = 0;
    }
  }

  return maxStreak;
}

/**
 * 특정 습관의 최장 연속 달성 일수 계산 (해당 월 기준)
 * @param days - 계산 대상 날짜 배열
 * @param habit - 습관 객체
 * @param checks - 체크 데이터
 * @returns 최장 연속 달성 일수
 */
function calculateHabitLongestStreak(
  days: Date[],
  habit: Habit,
  checks: Record<string, { completed: boolean }>
): number {
  let maxStreak = 0;
  let currentStreak = 0;

  for (const day of days) {
    const dateString = format(day, 'yyyy-MM-dd');

    const isActive = isHabitActiveOnDate(habit, day);
    if (isActive) {
      const key = `${habit.id}_${dateString}`;
      const check = checks[key];

      if (check?.completed) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
  }

  return maxStreak;
}
