import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { cn } from '@/lib/utils';
import { useHabits } from '@/features/habits/hooks';
import { HabitForm, type HabitFormRef } from '@/features/habits/components/HabitForm';
import type { HabitIconName, FrequencyType } from '@/features/habits/types';

export default function EditHabitScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { habits, update } = useHabits();
  const formRef = useRef<HabitFormRef>(null);
  const [isValid, setIsValid] = useState(true); // Default true for edit since name exists

  const habit = useMemo(() => {
    return habits.find((h: { id: string }) => h.id === id);
  }, [habits, id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => formRef.current?.submit()} disabled={!isValid}>
          <ThemedText className={cn('text-lg', isValid ? 'text-blue-500' : 'text-gray-400')}>
            저장
          </ThemedText>
        </Pressable>
      ),
    });
  }, [isValid, navigation]);

  const handleNameChange = (name: string) => {
    setIsValid(name.trim().length > 0);
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
      onNameChange={handleNameChange}
      submitLabel="저장"
    />
  );
}
