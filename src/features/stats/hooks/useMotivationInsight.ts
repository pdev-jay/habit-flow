import { useMemo } from 'react';
import { useHabitDetail, type HabitDetailStats } from './useHabitDetail';
import { useWeeklyStats } from '@/features/habits/hooks/useWeeklyStats';

export interface MotivationInsight {
  topHabit: HabitDetailStats | null;
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
      improvementHabit,
      weeklyProgress,
      motivationMessage,
      achievementBadge,
    };
  }, [habitStats, weeklyStats]);
}
