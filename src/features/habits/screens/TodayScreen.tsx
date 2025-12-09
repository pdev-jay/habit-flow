import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getTodayString, isHabitActiveOnDate } from '@/lib/utils';
import { useHabits, useHabitCheck } from '@/features/habits/hooks';

import { HabitCard } from '../components/HabitCard';
import { WeeklyStatsCard } from '../components/WeeklyStatsCard';

/**
 * Today screen - shows today's active habits
 */
export function TodayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { habits } = useHabits();
  const { getCheckStatus, toggle } = useHabitCheck();

  const today = useMemo(() => new Date(), []);
  const todayString = getTodayString();

  // Filter habits active today
  const activeHabits = useMemo(() => {
    return habits
      .filter(
        (habit: {
          frequency: 'daily' | 'weekdays' | 'weekends' | 'custom';
          customDays?: number[];
        }) => isHabitActiveOnDate(habit.frequency, habit.customDays, today)
      )
      .sort((a: { order: number }, b: { order: number }) => a.order - b.order);
  }, [habits, today]);

  const handleCheck = (habitId: string) => {
    toggle(habitId, todayString);
  };

  const handleCardPress = (habitId: string) => {
    router.push(`/habit/${habitId}`);
  };

  const handleAddHabit = () => {
    router.push('/habit/new');
  };

  return (
    <ThemedView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="px-4 pb-4" style={{ paddingTop: insets.top + 24 }}>
        <ThemedText className="mb-4 text-3xl font-bold">HabitFlow</ThemedText>

        {/* Weekly Stats Card */}
        <WeeklyStatsCard />
      </View>

      {/* Habits List */}
      <View className="flex-1 px-4 pt-4">
        {/* Habits List */}
        {activeHabits.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8">
            <MaterialCommunityIcons name="calendar-check" size={64} color="#9CA3AF" />
            <ThemedText className="mt-4 text-center text-base text-gray-500 dark:text-gray-400">
              오늘 활성화된 습관이 없습니다.{'\n'}
              새로운 습관을 추가해보세요!
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={activeHabits}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 80 }}
            renderItem={({ item }) => (
              <HabitCard
                name={item.name}
                icon={item.icon}
                color={item.color}
                checked={getCheckStatus(item.id, todayString)}
                onCheck={() => handleCheck(item.id)}
                onPress={() => handleCardPress(item.id)}
              />
            )}
          />
        )}
      </View>

      {/* Floating Add Button */}
      <Pressable
        onPress={handleAddHabit}
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-500 active:bg-blue-600"
        style={styles.floatingButton}>
        <MaterialCommunityIcons name="plus" size={28} color="white" />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
