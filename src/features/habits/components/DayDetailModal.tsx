import { Modal, View, Pressable, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { format, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useHabits } from '../hooks/useHabits';
import { useHabitCheckStore } from '../stores';
import type { Habit } from '../types';

interface Props {
  visible: boolean;
  date: Date | null;
  onClose: () => void;
}

export function DayDetailModal({ visible, date, onClose }: Props) {
  const { habits } = useHabits();
  const getChecksByDate = useHabitCheckStore((state) => state.getChecksByDate);

  if (!date) return null;

  const dateString = format(date, 'yyyy-MM-dd');
  const checks = getChecksByDate(dateString);
  const checksMap = new Map(checks.map((check) => [check.habitId, check.completed]));

  const completedCount = habits.filter((habit: Habit) => {
    const activeDays = habit.frequency === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : habit.customDays || [];
    const dayOfWeek = date.getDay();
    const isActiveDay = activeDays.includes(dayOfWeek);
    return isActiveDay && checksMap.get(habit.id) === true;
  }).length;

  const totalActiveHabits = habits.filter((habit: Habit) => {
    const activeDays = habit.frequency === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : habit.customDays || [];
    const dayOfWeek = date.getDay();
    return activeDays.includes(dayOfWeek);
  }).length;

  const completionRate = totalActiveHabits > 0 ? (completedCount / totalActiveHabits) * 100 : 0;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/50" onPress={onClose}>
        <Pressable
          className="max-h-[80%] w-[90%] rounded-xl bg-white p-6 dark:bg-gray-800"
          onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View className="mb-4 flex-row items-center justify-between">
            <View>
              <ThemedText className="text-xl font-bold text-gray-900 dark:text-white">
                {format(date, 'M월 d일', { locale: ko })}
              </ThemedText>
              <ThemedText className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                {format(date, 'EEEE', { locale: ko })}
                {isToday(date) && ' (오늘)'}
              </ThemedText>
            </View>
            <Pressable
              className="h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700"
              onPress={onClose}>
              <MaterialCommunityIcons name="close" size={20} color="#6b7280" />
            </Pressable>
          </View>

          {/* Completion Summary */}
          <ThemedView className="mb-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <View className="flex-row items-center justify-between">
              <ThemedText className="text-base text-gray-900 dark:text-white">
                {completedCount}/{totalActiveHabits} 완료
              </ThemedText>
              <ThemedText className="text-base font-semibold text-blue-600 dark:text-blue-400">
                {completionRate.toFixed(0)}%
              </ThemedText>
            </View>
          </ThemedView>

          {/* Habit List */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {habits
              .filter((habit: Habit) => {
                const activeDays =
                  habit.frequency === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : habit.customDays || [];
                const dayOfWeek = date.getDay();
                return activeDays.includes(dayOfWeek);
              })
              .map((habit: Habit) => {
                const isCompleted = checksMap.get(habit.id) === true;
                return (
                  <View
                    key={habit.id}
                    className="flex-row items-center justify-between border-b border-gray-200 py-3 last:border-b-0 dark:border-gray-700">
                    <View className="flex-1 flex-row items-center">
                      <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                        <ThemedText className="text-xl">{habit.icon}</ThemedText>
                      </View>
                      <ThemedText className="ml-3 text-base font-medium text-gray-900 dark:text-white">
                        {habit.name}
                      </ThemedText>
                    </View>
                    <View>
                      {isCompleted ? (
                        <View className="h-6 w-6 items-center justify-center rounded-full bg-green-500">
                          <MaterialCommunityIcons name="check" size={16} color="#ffffff" />
                        </View>
                      ) : (
                        <View className="h-6 w-6 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                      )}
                    </View>
                  </View>
                );
              })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
