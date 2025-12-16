import { useMemo } from 'react';
import { useHabitCheckStore } from '@/features/habits/api';

export type TimeSlotKey =
  | 'lateNight'
  | 'dawn'
  | 'earlyMorning'
  | 'morning'
  | 'earlyAfternoon'
  | 'afternoon'
  | 'evening'
  | 'night';

export interface TimeSlotAnalysis {
  timeSlot: TimeSlotKey;
  label: string;
  totalCompletions: number;
  completionRate: number;
  percentage: number; // For pie chart
}

/**
 * Analyze completion patterns by time of day
 * Groups completions into 8 time slots (3-hour intervals) based on completedAt timestamp
 */
export function useTimePattern(): TimeSlotAnalysis[] {
  const checks = useHabitCheckStore((state) => state.checks);

  return useMemo(() => {
    // Initialize 8 time slot counters (3-hour intervals)
    const timeSlots: Record<TimeSlotKey, { total: number; label: string }> = {
      lateNight: { total: 0, label: 'lateNight' }, // 0-3시
      dawn: { total: 0, label: 'dawn' }, // 3-6시
      earlyMorning: { total: 0, label: 'earlyMorning' }, // 6-9시
      morning: { total: 0, label: 'morning' }, // 9-12시
      earlyAfternoon: { total: 0, label: 'earlyAfternoon' }, // 12-15시
      afternoon: { total: 0, label: 'afternoon' }, // 15-18시
      evening: { total: 0, label: 'evening' }, // 18-21시
      night: { total: 0, label: 'night' }, // 21-24시
    };

    let totalWithTime = 0;

    // Analyze checks with completedAt timestamp
    Object.entries(checks).forEach(([_, check]) => {
      if (check.completed && check.completedAt) {
        const completedAt = new Date(check.completedAt);
        const hour = completedAt.getHours();

        // Categorize by time slot (3-hour intervals)
        let slot: TimeSlotKey;
        if (hour >= 0 && hour < 3) {
          slot = 'lateNight';
        } else if (hour >= 3 && hour < 6) {
          slot = 'dawn';
        } else if (hour >= 6 && hour < 9) {
          slot = 'earlyMorning';
        } else if (hour >= 9 && hour < 12) {
          slot = 'morning';
        } else if (hour >= 12 && hour < 15) {
          slot = 'earlyAfternoon';
        } else if (hour >= 15 && hour < 18) {
          slot = 'afternoon';
        } else if (hour >= 18 && hour < 21) {
          slot = 'evening';
        } else {
          slot = 'night';
        }

        timeSlots[slot].total++;
        totalWithTime++;
      }
    });

    // Calculate completion rates and percentages
    const result: TimeSlotAnalysis[] = Object.entries(timeSlots).map(([key, data]) => ({
      timeSlot: key as TimeSlotKey,
      label: data.label,
      totalCompletions: data.total,
      completionRate: totalWithTime > 0 ? Math.round((data.total / totalWithTime) * 100) : 0,
      percentage: totalWithTime > 0 ? (data.total / totalWithTime) * 100 : 0,
    }));

    return result;
  }, [checks]);
}
