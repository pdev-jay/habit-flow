import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { format } from 'date-fns';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme, useI18n } from '@/hooks';
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
  const { t } = useI18n();
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
      <View
        className="border-b border-gray-200 bg-white px-4 pb-4 dark:border-gray-800 dark:bg-gray-900"
        style={[{ paddingTop: insets.top }, styles.headerShadow]}>
        <ThemedText className="text-3xl font-bold">{t('screens:today.title')}</ThemedText>
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
      <View className="px-4 pb-4 pt-4">
        <WeeklyStatsCard selectedDate={selectedDate} />
      </View>

      {/* Habits List */}
      <View className="flex-1">
        {activeHabits.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8">
            <MaterialCommunityIcons
              name="calendar-check"
              size={64}
              color={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
            />
            <ThemedText className="mt-4 text-center text-base text-gray-500 dark:text-gray-400">
              {t('screens:today.noHabits')}
              {'\n'}
              {t('screens:today.addHabit')}
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={activeHabits}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 80 }}
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

const styles = StyleSheet.create({
  headerShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
});
