import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useTheme, useI18n } from '@/hooks';
import type { MonthComparison } from '../types/stats.types';

interface Props {
  comparison: MonthComparison;
}

export function MonthComparisonCard({ comparison }: Props) {
  const colorScheme = useTheme();
  const { t } = useI18n();

  const renderDiff = (diff: number, labelKey: string, isPercentage: boolean = false) => {
    let icon: 'arrow-up' | 'arrow-down' | 'equal' = 'equal';
    let color = colorScheme === 'dark' ? '#9CA3AF' : '#6B7280';
    let changeText = t('components:monthComparison.noChange');

    if (diff > 0) {
      icon = 'arrow-up';
      color = colorScheme === 'dark' ? '#34D399' : '#10B981';
      changeText = t('components:monthComparison.increased');
    } else if (diff < 0) {
      icon = 'arrow-down';
      color = colorScheme === 'dark' ? '#F87171' : '#EF4444';
      changeText = t('components:monthComparison.decreased');
    }

    return (
      <View className="flex-1 items-center">
        <View className="mb-1 flex-row items-center">
          <MaterialCommunityIcons name={icon} size={20} color={color} />
          <ThemedText className="ml-1 text-lg font-bold" style={{ color }}>
            {Math.abs(diff).toFixed(0)}
            {isPercentage && '%'}
          </ThemedText>
        </View>
        <ThemedText className="text-xs text-gray-500 dark:text-gray-400">
          {t(`components:monthComparison.${labelKey}`)}
        </ThemedText>
        <ThemedText className="text-xs" style={{ color }}>
          {changeText}
        </ThemedText>
      </View>
    );
  };

  return (
    <View className="mx-4 my-2 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
      <ThemedText className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        {t('components:monthComparison.title')}
      </ThemedText>
      <View className="flex-row justify-between">
        {renderDiff(comparison.completionRateDiff, 'avgCompletionRate', true)}
        {renderDiff(comparison.perfectDaysDiff, 'perfectDays')}
        {renderDiff(comparison.streakDiff, 'longestStreak')}
      </View>
    </View>
  );
}
