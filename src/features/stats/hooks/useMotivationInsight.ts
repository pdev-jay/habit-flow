import { useMemo } from 'react';
import { useHabitDetail, type HabitDetailStats } from './useHabitDetail';
import { useWeeklyStats } from '@/features/habits/hooks/useWeeklyStats';

export interface MotivationInsight {
  topHabit: HabitDetailStats | null;
  topThree: Array<HabitDetailStats & { rank: 1 | 2 | 3 }>;
  improvementHabit: HabitDetailStats | null;
  weeklyProgress: number; // Percentage (0-100)
  motivationMessage: string;
  achievementBadge: string | null;
}

/**
 * Generate motivation insights and encouragement messages
 * based on user's habit statistics
 */
export function useMotivationInsight(): MotivationInsight {
  const habitStats = useHabitDetail();
  const weeklyStats = useWeeklyStats();

  return useMemo(() => {
    // Sort habits by completion rate
    const sortedByCompletion = [...habitStats].sort(
      (a, b) => b.completionRate - a.completionRate
    );

    // Find top performing habit (highest completion rate)
    const topHabit = sortedByCompletion[0] || null;

    // Get top 3 habits with rank
    const topThree = sortedByCompletion
      .filter((stat) => stat.totalCompletions > 0)
      .slice(0, 3)
      .map((stat, index) => ({
        ...stat,
        rank: (index + 1) as 1 | 2 | 3,
      }));

    // Find habit that needs improvement (lowest completion rate, but has some completions)
    const improvementHabit =
      sortedByCompletion.reverse().find((stat) => stat.totalCompletions > 0) || null;

    // Calculate weekly progress
    const weeklyProgress = weeklyStats.completionRate;

    // Determine motivation message based on performance
    let motivationMessage = 'keepGoing'; // Default
    let achievementBadge: string | null = null;

    if (weeklyProgress >= 90) {
      motivationMessage = 'excellent';
      achievementBadge = 'trophy';
    } else if (weeklyProgress >= 70) {
      motivationMessage = 'great';
      achievementBadge = 'star';
    } else if (weeklyProgress >= 50) {
      motivationMessage = 'good';
      achievementBadge = 'arm-flex';
    } else if (weeklyProgress >= 30) {
      motivationMessage = 'keepTrying';
      achievementBadge = null;
    } else {
      motivationMessage = 'dontGiveUp';
      achievementBadge = null;
    }

    // Special case: Long streak deserves recognition
    if (topHabit && topHabit.currentStreak >= 7) {
      achievementBadge = 'fire';
    }

    return {
      topHabit,
      topThree,
      improvementHabit,
      weeklyProgress,
      motivationMessage,
      achievementBadge,
    };
  }, [habitStats, weeklyStats]);
}
