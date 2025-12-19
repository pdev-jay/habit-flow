import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useTheme, useI18n } from '@/hooks';
import type { MonthlyInsight } from '../types/stats.types';
import type { HabitIconName } from '../types';

interface Props {
  insight: MonthlyInsight;
}

export function InsightCard({ insight }: Props) {
  const colorScheme = useTheme();
  const { t } = useI18n();

  if (insight.topThree.length === 0 && !insight.needsAttention) {
    return null;
  }


  return (
    <View className="mx-4 my-2 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
      <ThemedText className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        {t('components:insight.title')}
      </ThemedText>

      {/* TOP 3 습관 */}
      {insight.topThree.length > 0 && (
        <View className="mb-3 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
          <View className="mb-2 flex-row items-center">
            <MaterialCommunityIcons
              name="trophy"
              size={20}
              color={colorScheme === 'dark' ? '#34D399' : '#10B981'}
            />
            <ThemedText className="ml-2 text-sm font-medium text-green-600 dark:text-green-400">
              {t('components:insight.topHabits')}
            </ThemedText>
          </View>
          {insight.topThree.map((habit, index) => (
            <View
              key={habit.habitId}
              className={`flex-row items-center justify-between ${index > 0 ? 'mt-2' : ''}`}
            >
              <View className="flex-1 flex-row items-center">
                <View
                  className="h-8 w-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: habit.habitColor }}
                >
                  <MaterialCommunityIcons
                    name={habit.habitIcon as HabitIconName}
                    size={18}
                    color="#FFFFFF"
                  />
                </View>
                <ThemedText className="ml-3 flex-1 text-base font-medium text-gray-900 dark:text-white">
                  {habit.habitName}
                </ThemedText>
              </View>
              <ThemedText className="text-sm font-semibold text-green-600 dark:text-green-400">
                {habit.completionRate.toFixed(0)}%
              </ThemedText>
            </View>
          ))}
        </View>
      )}

      {/* 주의 필요 */}
      {insight.needsAttention && (
        <View className="rounded-lg bg-orange-50 p-3 dark:bg-orange-900/20">
          <View className="mb-2 flex-row items-center">
            <MaterialCommunityIcons
              name="alert-circle"
              size={20}
              color={colorScheme === 'dark' ? '#FB923C' : '#F97316'}
            />
            <ThemedText className="ml-2 text-sm font-medium text-orange-600 dark:text-orange-400">
              {t('components:insight.needsAttention')}
            </ThemedText>
          </View>
          <View className="mt-2 flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center">
              <View
                className="h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: insight.needsAttention.habitColor }}
              >
                <MaterialCommunityIcons
                  name={insight.needsAttention.habitIcon as HabitIconName}
                  size={18}
                  color="#FFFFFF"
                />
              </View>
              <ThemedText className="ml-3 text-base font-medium text-gray-900 dark:text-white">
                {insight.needsAttention.habitName}
              </ThemedText>
            </View>
            <ThemedText className="text-sm font-semibold text-orange-600 dark:text-orange-400">
              {insight.needsAttention.completionRate.toFixed(0)}%
            </ThemedText>
          </View>
        </View>
      )}
    </View>
  );
}
