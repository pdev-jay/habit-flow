import React from 'react';
import { View } from 'react-native';

import { WeeklySummaryCard } from './WeeklySummaryCard';
import { WeeklyChartCard } from './WeeklyChartCard';
import { HabitCompletionCard } from './HabitCompletionCard';
import type { WeeklyStats } from '../types';

interface HabitStat {
  id: string;
  name: string;
  color: string;
  rate: number;
  completedDays: number;
  totalDays: number;
}

interface WeeklyViewProps {
  weeklyStats: WeeklyStats;
  chartData: {
    day: string;
    completed: number;
    total: number;
  }[];
  habitStats: HabitStat[];
  isCurrentWeek: boolean;
}

/**
 * Weekly view component
 * Displays all weekly statistics components
 */
export const WeeklyView = React.memo(function WeeklyView({
  weeklyStats,
  chartData,
  habitStats,
  isCurrentWeek,
}: WeeklyViewProps) {
  return (
    <View>
      <WeeklySummaryCard stats={weeklyStats} isCurrentWeek={isCurrentWeek} />
      <WeeklyChartCard chartData={chartData} />
      <HabitCompletionCard habitStats={habitStats} />
    </View>
  );
});
