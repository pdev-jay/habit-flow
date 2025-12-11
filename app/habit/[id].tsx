import React, { useLayoutEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Pressable, Text, Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks';
import { useHabits } from '@/features/habits/hooks';
import { useHabitCheckStore } from '@/features/habits/stores';
import { HabitForm, type HabitFormRef } from '@/features/habits/components/HabitForm';
import type { HabitIconName, FrequencyType } from '@/features/habits/types';

export default function EditHabitScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { habits, update, remove } = useHabits();
  const { deleteChecksByHabitId } = useHabitCheckStore();
  const formRef = useRef<HabitFormRef>(null);
  const [isValid, setIsValid] = useState(true); // Default true for edit since name exists
  const colorScheme = useTheme();

  const habit = useMemo(() => {
    return habits.find((h: { id: string }) => h.id === id);
  }, [habits, id]);

  const handleDelete = useCallback(() => {
    if (!id) return;

    Alert.alert('습관 삭제', '정말 이 습관을 삭제하시겠습니까? 모든 기록이 함께 삭제됩니다.', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          remove(id);
          deleteChecksByHabitId(id);
          router.back();
        },
      },
    ]);
  }, [id, remove, deleteChecksByHabitId, router]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => formRef.current?.submit()} disabled={!isValid}>
          <Text
            style={{
              fontSize: 17,
              color: isValid
                ? colorScheme === 'dark'
                  ? '#60A5FA'
                  : '#3B82F6'
                : colorScheme === 'dark'
                  ? '#6B7280'
                  : '#9CA3AF',
            }}>
            저장
          </Text>
        </Pressable>
      ),
    });
  }, [isValid, navigation, colorScheme]);

  const handleValidationChange = (valid: boolean) => {
    setIsValid(valid);
  };

  const handleSubmit = (data: {
    name: string;
    icon: HabitIconName;
    color: string;
    frequency: FrequencyType;
    customDays?: number[];
    reminderTime?: string;
    reminderEnabled: boolean;
  }) => {
    if (!id || !isValid) return;

    update(id, data);
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  if (!habit) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <ThemedText className="text-gray-500">습관을 찾을 수 없습니다.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1">
      <HabitForm
        ref={formRef}
        initialData={{
          name: habit.name,
          icon: habit.icon,
          color: habit.color,
          frequency: habit.frequency,
          customDays: habit.customDays,
          reminderTime: habit.reminderTime,
          reminderEnabled: habit.reminderEnabled,
        }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onValidationChange={handleValidationChange}
        submitLabel="저장"
      />
      <SafeAreaView
        edges={['bottom', 'right']}
        className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <View className="pt-3">
          <Pressable onPress={handleDelete} className="self-center active:opacity-70">
            <Text
              style={{
                fontSize: 17,
                color: colorScheme === 'dark' ? '#F87171' : '#EF4444',
              }}>
              삭제
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
