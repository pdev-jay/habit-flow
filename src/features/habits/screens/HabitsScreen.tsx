import React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useHabits } from '@/features/habits/hooks';
import { HabitIconName } from '@/features/habits/types';

interface HabitItemProps {
  id: string;
  name: string;
  icon: HabitIconName;
  color: string;
  frequency: string;
  onPress: () => void;
  onLongPress: () => void;
}

function HabitItem({ name, icon, color, frequency, onPress, onLongPress }: HabitItemProps) {
  const getFrequencyLabel = () => {
    switch (frequency) {
      case 'daily':
        return '매일';
      case 'weekdays':
        return '평일';
      case 'weekends':
        return '주말';
      case 'custom':
        return '맞춤';
      default:
        return '';
    }
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="mb-3 rounded-xl bg-white p-4 dark:bg-gray-800"
      style={styles.card}>
      <View className="flex-row items-center">
        <View
          className="mr-3 h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: color + '20' }}>
          <MaterialCommunityIcons name={icon as any} size={28} color={color} />
        </View>

        <View className="flex-1">
          <ThemedText className="text-base font-semibold">{name}</ThemedText>
          <ThemedText className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {getFrequencyLabel()}
          </ThemedText>
        </View>

        <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
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

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View
        className="border-b border-gray-200 bg-white px-4 pb-4 dark:border-gray-700 dark:bg-gray-900"
        style={{ paddingTop: insets.top + 24 }}>
        <ThemedText className="text-2xl font-bold">내 습관</ThemedText>
        <ThemedText className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          총 {habits.length}개의 습관
        </ThemedText>
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
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-4"
          renderItem={({ item }) => (
            <HabitItem
              id={item.id}
              name={item.name}
              icon={item.icon}
              color={item.color}
              frequency={item.frequency}
              onPress={() => handlePress(item.id)}
              onLongPress={() => handleLongPress(item.id, item.name)}
            />
          )}
        />
      )}

      {/* Add Button */}
      <View className="border-t border-gray-200 p-4 dark:border-gray-700">
        <Pressable
          onPress={handleAddHabit}
          className="h-14 flex-row items-center justify-center rounded-xl bg-blue-500 active:bg-blue-600"
          style={styles.addButton}>
          <MaterialCommunityIcons name="plus" size={24} color="white" />
          <ThemedText className="ml-2 text-base font-semibold text-white">습관 추가</ThemedText>
        </Pressable>
      </View>
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
  addButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
