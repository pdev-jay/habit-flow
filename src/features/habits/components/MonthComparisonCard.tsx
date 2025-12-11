import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks';
import type { MonthComparison } from '../types/stats.types';

interface Props {
  comparison: MonthComparison;
}

export function MonthComparisonCard({ comparison }: Props) {
  const colorScheme = useTheme();

  const renderDiff = (diff: number, label: string) => {
    let icon: 'arrow-up' | 'arrow-down' | 'equal' = 'equal';
    let color = colorScheme === 'dark' ? '#9CA3AF' : '#6B7280';
    let text = '변화 없음';

    if (diff > 0) {
      icon = 'arrow-up';
      color = colorScheme === 'dark' ? '#34D399' : '#10B981';
      text = '증가';
    } else if (diff < 0) {
      icon = 'arrow-down';
      color = colorScheme === 'dark' ? '#F87171' : '#EF4444';
      text = '감소';
    }

    return (
      <View className="flex-1 items-center">
        <View className="mb-1 flex-row items-center">
          <MaterialCommunityIcons name={icon} size={20} color={color} />
          <ThemedText className="ml-1 text-lg font-bold" style={{ color }}>
            {Math.abs(diff).toFixed(0)}
            {label === '평균 완료율' && '%'}
          </ThemedText>
        </View>
        <ThemedText className="text-xs text-gray-500 dark:text-gray-400">{label}</ThemedText>
        <ThemedText className="text-xs" style={{ color }}>
          {text}
        </ThemedText>
      </View>
    );
  };

  return (
    <View className="mx-4 my-2 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
      <ThemedText className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        지난 달 대비
      </ThemedText>
      <View className="flex-row justify-between">
        {renderDiff(comparison.completionRateDiff, '평균 완료율')}
        {renderDiff(comparison.perfectDaysDiff, '완벽한 날')}
        {renderDiff(comparison.streakDiff, '최장 스트릭')}
      </View>
    </View>
  );
}
