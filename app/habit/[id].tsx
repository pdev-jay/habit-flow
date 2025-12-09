import React, { useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useHabits } from '@/features/habits/hooks';
import { HabitForm } from '@/features/habits/components/HabitForm';
import type { HabitIconName, FrequencyType } from '@/features/habits/types';

export default function EditHabitScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { habits, update } = useHabits();

  const habit = useMemo(() => {
    return habits.find((h: { id: string }) => h.id === id);
  }, [habits, id]);

  const handleSubmit = (data: {
    name: string;
    icon: HabitIconName;
    color: string;
    frequency: FrequencyType;
  }) => {
    if (!id) return;

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
      initialData={{
        name: habit.name,
        icon: habit.icon,
        color: habit.color,
        frequency: habit.frequency,
      }}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitLabel="저장"
    />
  );
}
