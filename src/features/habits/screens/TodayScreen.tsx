import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { format } from 'date-fns';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { isHabitActiveOnDate } from '@/lib/utils';
import { useHabits, useHabitCheck, useHabitStreaks } from '@/features/habits/hooks';

import { HabitCard } from '../components/HabitCard';
import { WeeklyStatsCard } from '../components/WeeklyStatsCard';
import { CalendarModal } from '../components/CalendarModal';

/**
 * Today screen - shows today's active habits
 */
export function TodayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { habits } = useHabits();
  const { getCheckStatus, toggle } = useHabitCheck();

  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const selectedDateString = useMemo(() => format(selectedDate, 'yyyy-MM-dd'), [selectedDate]);

  // Filter habits active on selected date
  const activeHabits = useMemo(() => {
    return habits
      .filter(
        (habit: {
          frequency: 'daily' | 'weekdays' | 'weekends' | 'custom';
          customDays?: number[];
        }) => isHabitActiveOnDate(habit.frequency, habit.customDays, selectedDate)
      )
      .sort((a: { order: number }, b: { order: number }) => a.order - b.order);
  }, [habits, selectedDate]);

  const streaks = useHabitStreaks(activeHabits);

  const handleCheck = (habitId: string) => {
    toggle(habitId, selectedDateString);
  };

  const handleCardPress = (habitId: string) => {
    router.push(`/habit/${habitId}`);
  };

  const handleOpenCalendar = () => {
    setIsCalendarVisible(true);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <ThemedView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="px-4 pb-4" style={{ paddingTop: insets.top + 24 }}>
        <View className="mb-4 flex-row items-center justify-between">
          <ThemedText className="text-3xl font-bold">HabitFlow</ThemedText>
          <Pressable onPress={handleOpenCalendar} className="h-10 w-10 items-center justify-center">
            <MaterialCommunityIcons name="calendar" size={24} color="#3B82F6" />
          </Pressable>
        </View>

        {/* Weekly Stats Card */}
        <WeeklyStatsCard selectedDate={selectedDate} />
      </View>

      {/* Habits List */}
      <View className="flex-1 pt-4">
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

      {/* Calendar Modal */}
      <CalendarModal
        visible={isCalendarVisible}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        onClose={() => setIsCalendarVisible(false)}
      />
    </ThemedView>
  );
}
