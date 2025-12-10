import { useMemo } from 'react';
import type { MonthlyInsight } from '../types/stats.types';
import { useHabitInsights } from './useMonthlyStats';

/**
 * 월간 인사이트 계산 훅
 * @param date - 기준 날짜
 * @returns MVP 습관, 주의 필요 습관, TOP 3 습관
 */
export function useMonthlyInsight(date: Date): MonthlyInsight {
  const habitInsights = useHabitInsights(date);

  const insight = useMemo(() => {
    if (habitInsights.length === 0) {
      return {
        mvpHabit: null,
        needsAttention: null,
        topThree: [],
      };
    }

    // MVP 습관: completionRate 최고 + totalCount >= 5
    const mvpCandidates = habitInsights.filter((habit) => habit.totalCount >= 5);
    const mvpHabit = mvpCandidates.length > 0 ? mvpCandidates[0] : null;

    // 주의 필요 습관: completionRate < 50 + totalCount >= 10
    const needsAttentionCandidates = habitInsights.filter(
      (habit) => habit.completionRate < 50 && habit.totalCount >= 10
    );
    const needsAttention = needsAttentionCandidates.length > 0 ? needsAttentionCandidates[0] : null;

    // TOP 3: 상위 3개 (rank 1, 2, 3 부여) - totalCount > 0인 습관만
    const topThree = habitInsights
      .filter((habit) => habit.totalCount > 0)
      .slice(0, 3)
      .map((habit, index) => ({
        ...habit,
        rank: (index + 1) as 1 | 2 | 3,
      }));

    return {
      mvpHabit,
      needsAttention,
      topThree,
    };
  }, [habitInsights]);

  return insight;
}
