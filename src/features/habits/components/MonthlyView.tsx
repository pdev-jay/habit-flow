import React from 'react';
import { View } from 'react-native';
import { MonthlySummaryCard } from './MonthlySummaryCard';
import { MonthlyHeatmap } from './MonthlyHeatmap';
import { InsightCard } from './InsightCard';
import { MonthComparisonCard } from './MonthComparisonCard';
import { HabitRankingCard } from './HabitRankingCard';
import type { MonthlyStats, DayCompletionData, MonthlyInsight, MonthComparison } from '../types/stats.types';

interface MonthlyViewProps {
  currentMonthDate: Date;
  monthlyStats: MonthlyStats;
  heatmapData: DayCompletionData[];
  monthlyInsight: MonthlyInsight;
  monthComparison: MonthComparison;
  onDayPress: (date: Date) => void;
}

export const MonthlyView = React.memo(function MonthlyView({
  currentMonthDate,
  monthlyStats,
  heatmapData,
  monthlyInsight,
  monthComparison,
  onDayPress,
}: MonthlyViewProps) {
  return (
    <View>
      <MonthlySummaryCard stats={monthlyStats} />
      <MonthlyHeatmap
        currentDate={currentMonthDate}
        heatmapData={heatmapData}
        onDayPress={onDayPress}
      />
      <InsightCard insight={monthlyInsight} />
      <MonthComparisonCard comparison={monthComparison} />
      <HabitRankingCard topThree={monthlyInsight.topThree} />
    </View>
  );
});
