import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useTheme, useI18n } from '@/hooks';
import type { HabitInsight } from '../types/stats.types';
import type { HabitIconName } from '../types';

interface Props {
  topThree: HabitInsight[];
}

export function HabitRankingCard({ topThree }: Props) {
  const colorScheme = useTheme();
  const { t } = useI18n();

  if (topThree.length === 0) {
    return null;
  }

  const getMedalIcon = (index: number): 'medal-outline' | 'medal' => {
    return index === 0 ? 'medal' : 'medal-outline';
  };

  const getMedalColor = (index: number): string => {
    if (index === 0) return '#fbbf24'; // 금메달
    if (index === 1) return '#9ca3af'; // 은메달
    return '#d97706'; // 동메달
  };

  return (
    <View className="mx-4 my-2 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
      <ThemedText className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        {t('components:habitRanking.title')}
      </ThemedText>
      {topThree.map((habit, index) => (
        <View
          key={habit.habitId}
          className="flex-row items-center justify-between border-b border-gray-200 py-3 last:border-b-0 dark:border-gray-700">
          <View className="flex-1 flex-row items-center">
            <MaterialCommunityIcons
              name={getMedalIcon(index)}
              size={24}
              color={getMedalColor(index)}
            />
            <View className="ml-3 h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <MaterialCommunityIcons
                name={habit.habitIcon as HabitIconName}
                size={24}
                color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
              />
            </View>
            <View className="ml-3 flex-1">
              <ThemedText className="text-base font-medium text-gray-900 dark:text-white">
                {habit.habitName}
              </ThemedText>
              <ThemedText className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {t('components:habitRanking.completed', { count: habit.completedCount })}
              </ThemedText>
            </View>
          </View>
          <View className="rounded-full bg-blue-100 px-3 py-1 dark:bg-blue-900/40">
            <ThemedText className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {habit.completionRate.toFixed(0)}%
            </ThemedText>
          </View>
        </View>
      ))}
    </View>
  );
}
