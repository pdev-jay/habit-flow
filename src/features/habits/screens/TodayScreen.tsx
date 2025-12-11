import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { format } from 'date-fns';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks';
import { useHabits, useHabitCheck, useHabitStreaks } from '@/features/habits/hooks';

import { HabitCard } from '../components/HabitCard';
import { WeeklyStatsCard } from '../components/WeeklyStatsCard';
import { ExpandableCalendar } from '../components/ExpandableCalendar';

/**
 * Today screen - shows today's active habits
 */
export function TodayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useTheme();
  const { getActiveHabitsForDate } = useHabits();
  const { getCheckStatus, toggle } = useHabitCheck();

  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const selectedDateString = useMemo(() => format(selectedDate, 'yyyy-MM-dd'), [selectedDate]);

  // Filter habits active on selected date (includes createdAt validation)
  const activeHabits = useMemo(() => {
    return getActiveHabitsForDate(selectedDate);
  }, [getActiveHabitsForDate, selectedDate]);

  const streaks = useHabitStreaks(activeHabits);

  // Check if a date has any active habits
  const hasHabitsForDate = useCallback(
    (date: Date) => {
      return getActiveHabitsForDate(date).length > 0;
    },
    [getActiveHabitsForDate]
  );

  const handleCheck = (habitId: string) => {
    toggle(habitId, selectedDateString);
  };

  const handleCardPress = (habitId: string) => {
    router.push(`/habit/${habitId}`);
  };

  return (
    <ThemedView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="bg-white px-4 pb-4 dark:bg-gray-900" style={{ paddingTop: insets.top }}>
        <ThemedText className="text-3xl font-bold">HabitFlow</ThemedText>
      </View>

      {/* Expandable Calendar */}
      <View className="px-4 pt-4">
        <ExpandableCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          hasHabits={hasHabitsForDate}
        />
      </View>

      {/* Weekly Stats Card */}
      <View className="px-4 pt-4">
        <WeeklyStatsCard selectedDate={selectedDate} />
      </View>

      {/* Habits List */}
      <View className="flex-1 pt-4">
        {activeHabits.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8">
            <MaterialCommunityIcons
              name="calendar-check"
              size={64}
              color={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
            />
            <ThemedText className="mt-4 text-center text-base text-gray-500 dark:text-gray-400">
              오늘 활성화된 습관이 없습니다.{'\n'}
              새로운 습관을 추가해보세요!
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={activeHabits}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
            renderItem={({ item }) => (
              <HabitCard
                name={item.name}
                icon={item.icon}
                color={item.color}
                checked={getCheckStatus(item.id, selectedDateString)}
                streak={streaks[item.id]}
                onCheck={() => handleCheck(item.id)}
                onPress={() => handleCardPress(item.id)}
              />
            )}
          />
        )}
      </View>
    </ThemedView>
  );
}
