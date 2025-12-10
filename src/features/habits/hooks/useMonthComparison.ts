import { useMemo } from 'react';
import { subMonths } from 'date-fns';
import type { MonthComparison } from '../types/stats.types';
import { useMonthlyStats } from './useMonthlyStats';

/**
 * 월별 비교 계산 훅
 * @param currentDate - 현재 월 기준 날짜
 * @returns 현재 월과 이전 월 비교 데이터
 */
export function useMonthComparison(currentDate: Date): MonthComparison {
  const currentMonth = useMonthlyStats(currentDate);
  const previousMonth = useMonthlyStats(subMonths(currentDate, 1));

  const comparison = useMemo(() => {
    const completionRateDiff = parseFloat(
      (currentMonth.averageCompletionRate - previousMonth.averageCompletionRate).toFixed(1)
    );

    const perfectDaysDiff = currentMonth.perfectDays - previousMonth.perfectDays;

    const streakDiff = currentMonth.longestStreak - previousMonth.longestStreak;

    return {
      currentMonth,
      previousMonth,
      completionRateDiff,
      perfectDaysDiff,
      streakDiff,
    };
  }, [currentMonth, previousMonth]);

  return comparison;
}
