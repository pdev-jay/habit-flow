import React, { useMemo } from 'react';
import { Alert, Pressable, SectionList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useHabits, useHabitStreaks } from '@/features/habits/hooks';
import { Habit } from '@/features/habits/types';
import { getFrequencyLabel, groupHabitsByWeekday } from '@/features/habits/utils';

interface HabitItemProps {
  habit: Habit;
  streak?: number;
  onPress: () => void;
  onLongPress: () => void;
}

function HabitItem({ habit, streak, onPress, onLongPress }: HabitItemProps) {
  const frequencyLabel = useMemo(() => {
    if (habit.customDays) {
      return getFrequencyLabel(habit.customDays);
    }
    return '';
  }, [habit.customDays]);

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
 * Habits list screen - manage all habits
 */
export function HabitsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { habits, remove } = useHabits();
  const streaks = useHabitStreaks(habits);

  // Group habits by weekday
  const weekdayGroups = useMemo(() => groupHabitsByWeekday(habits), [habits]);

  const handlePress = (habitId: string) => {
    router.push(`/habit/${habitId}`);
  };

  const handleLongPress = (habitId: string, habitName: string) => {
    Alert.alert(
      '습관 삭제',
      `"${habitName}" 습관을 삭제하시겠습니까?\n모든 기록도 함께 삭제됩니다.`,
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => remove(habitId),
        },
      ]
    );
  };

  const handleAddHabit = () => {
    router.push('/habit/new');
  };

  const renderSectionHeader = ({ section }: { section: { weekday: string; habits: Habit[] } }) => (
    <View className="ml-4 mt-6 border-l-4 border-gray-300 px-4 py-3 dark:border-gray-600">
      <ThemedText className="text-base font-semibold text-gray-900 dark:text-gray-100">
        {section.weekday} ({section.habits.length})
      </ThemedText>
    </View>
  );

  const renderItem = ({ item, index }: { item: Habit; index: number }) => (
    <View className={`px-4 ${index === 0 ? 'mt-3' : ''}`}>
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
        className="border-b border-gray-200 bg-white px-4 pb-4 dark:border-gray-700 dark:bg-gray-900"
        style={{ paddingTop: insets.top + 24 }}>
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <ThemedText className="text-2xl font-bold">내 습관</ThemedText>
            <ThemedText className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              총 {habits.length}개의 습관
            </ThemedText>
          </View>
          <Pressable onPress={handleAddHabit} className="p-2">
            <MaterialCommunityIcons name="plus" size={28} color="#3B82F6" />
          </Pressable>
        </View>
      </View>

      {/* Habits List */}
      {habits.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <MaterialCommunityIcons name="clipboard-text-outline" size={64} color="#9CA3AF" />
          <ThemedText className="mt-4 text-center text-base text-gray-500 dark:text-gray-400">
            아직 습관이 없습니다.{'\n'}
            새로운 습관을 추가해보세요!
          </ThemedText>
        </View>
      ) : (
        <SectionList
          sections={weekdayGroups.map((group) => ({
            weekday: group.weekday,
            habits: group.habits,
            data: group.habits,
          }))}
          keyExtractor={(item) => item.id}
          renderSectionHeader={renderSectionHeader}
          renderItem={renderItem}
          contentContainerClassName="pb-4"
          stickySectionHeadersEnabled={false}
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
});
