import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme, useI18n } from '@/hooks';
import { useHabits, useHabitStreaks } from '@/features/habits/hooks';
import { Habit } from '@/features/habits/types';
import { getFrequencyLabel, getHabitsForWeekday } from '@/features/habits/utils';
import { HabitFilterTabs, type FilterType } from '../components/HabitFilterTabs';

interface HabitItemProps {
  habit: Habit;
  streak?: number;
  onPress: () => void;
  onLongPress: () => void;
}

function HabitItem({ habit, streak, onPress, onLongPress }: HabitItemProps) {
  const { language } = useI18n();

  const frequencyLabel = useMemo(() => {
    if (habit.customDays) {
      return getFrequencyLabel(habit.customDays, language);
    }
    return '';
  }, [habit.customDays, language]);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="mb-3 rounded-xl bg-white p-4 dark:bg-gray-800"
      style={styles.card}>
      <View className="flex-row items-center">
        <View
          className="mr-3 h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: habit.color + '20' }}>
          <MaterialCommunityIcons name={habit.icon} size={28} color={habit.color} />
        </View>

        <View className="flex-1">
          <ThemedText className="text-base font-semibold">{habit.name}</ThemedText>
          {frequencyLabel && (
            <ThemedText className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {frequencyLabel}
            </ThemedText>
          )}
        </View>

        {streak !== undefined && streak > 0 && (
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="fire" size={20} color="#F97316" />
            <ThemedText className="ml-1 text-sm font-semibold text-orange-500">{streak}</ThemedText>
          </View>
        )}
      </View>
    </Pressable>
  );
}

/**
 * Empty state component for filtered results
 */
function EmptyState({ filter }: { filter: FilterType }) {
  const { t } = useI18n();
  const colorScheme = useTheme();

  const message = t('screens:habits.filter.noHabitsForDay');

  return (
    <View className="flex-1 items-center justify-center px-8">
      <MaterialCommunityIcons
        name="calendar-blank"
        size={64}
        color={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
      />
      <ThemedText className="mt-4 text-center text-gray-500 dark:text-gray-400">
        {message}
      </ThemedText>
    </View>
  );
}

/**
 * Habits list screen - manage all habits
 */
export function HabitsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useTheme();
  const { t } = useI18n();
  const { habits, remove } = useHabits();
  const streaks = useHabitStreaks(habits);

  // Filter state (default: today's weekday)
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(() => {
    const todayIndex = new Date().getDay();
    return todayIndex;
  });

  // Filtered habits based on selected filter
  const filteredData = useMemo(() => {
    if (selectedFilter === 'all') {
      // 전체: 섹션 없이 모든 습관을 flat list로 표시
      return { type: 'flat' as const, data: habits };
    } else {
      // 특정 요일: 해당 요일의 습관만 표시
      return { type: 'flat' as const, data: getHabitsForWeekday(habits, selectedFilter) };
    }
  }, [habits, selectedFilter]);

  const handlePress = (habitId: string) => {
    router.push(`/habit/${habitId}`);
  };

  const handleLongPress = (habitId: string, habitName: string) => {
    Alert.alert(
      t('screens:habits.deleteTitle'),
      t('screens:habits.deleteMessage', { name: habitName }),
      [
        {
          text: t('screens:habits.deleteCancel'),
          style: 'cancel',
        },
        {
          text: t('screens:habits.deleteConfirm'),
          style: 'destructive',
          onPress: () => remove(habitId),
        },
      ]
    );
  };

  const handleAddHabit = () => {
    router.push('/habit/new');
  };

  const renderItem = ({ item }: { item: Habit }) => (
    <View className="px-4">
      <HabitItem
        habit={item}
        streak={streaks[item.id]}
        onPress={() => handlePress(item.id)}
        onLongPress={() => handleLongPress(item.id, item.name)}
      />
    </View>
  );

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View
        className="border-b border-gray-200 bg-white px-4 pb-4 dark:border-gray-800 dark:bg-gray-900"
        style={[{ paddingTop: insets.top }, styles.headerShadow]}>
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <ThemedText className="text-3xl font-bold">{t('screens:habits.title')}</ThemedText>
            <ThemedText className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {t('screens:habits.totalCount', { count: habits.length })}
            </ThemedText>
          </View>
          <Pressable onPress={handleAddHabit} className="p-2">
            <MaterialCommunityIcons
              name="plus"
              size={28}
              color={colorScheme === 'dark' ? '#60A5FA' : '#3B82F6'}
            />
          </Pressable>
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="bg-white px-4 pb-3 pt-4 dark:bg-gray-900">
        <HabitFilterTabs value={selectedFilter} onChange={setSelectedFilter} />
      </View>

      {/* Habits List */}
      {habits.length === 0 ? (
        <View className="flex-1 items-center justify-center border-t border-gray-200 px-8 dark:border-gray-800">
          <MaterialCommunityIcons
            name="clipboard-text-outline"
            size={64}
            color={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
          />
          <ThemedText className="mt-4 text-center text-base text-gray-500 dark:text-gray-400">
            {t('screens:habits.empty')}
            {'\n'}
            {t('screens:habits.addFirst')}
          </ThemedText>
        </View>
      ) : filteredData.data.length === 0 ? (
        <EmptyState filter={selectedFilter} />
      ) : (
        <FlatList
          data={filteredData.data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerClassName="pb-4 pt-4"
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
});
