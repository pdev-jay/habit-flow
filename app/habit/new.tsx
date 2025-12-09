import React from 'react';
import { useRouter } from 'expo-router';

import { useHabits } from '@/features/habits/hooks';
import { HabitForm } from '@/features/habits/components/HabitForm';
import type { HabitIconName, FrequencyType } from '@/features/habits/types';

export default function NewHabitScreen() {
  const router = useRouter();
  const { create } = useHabits();

  const handleSubmit = (data: {
    name: string;
    icon: HabitIconName;
    color: string;
    frequency: FrequencyType;
  }) => {
    create({
      ...data,
      reminderEnabled: false,
    });
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return <HabitForm onSubmit={handleSubmit} onCancel={handleCancel} submitLabel="추가" />;
}
