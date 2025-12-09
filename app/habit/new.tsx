import React, { useLayoutEffect, useRef, useState } from 'react';
import { Pressable } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { cn } from '@/lib/utils';
import { useHabits } from '@/features/habits/hooks';
import { HabitForm, type HabitFormRef } from '@/features/habits/components/HabitForm';
import type { HabitIconName, FrequencyType } from '@/features/habits/types';

export default function NewHabitScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { create } = useHabits();
  const formRef = useRef<HabitFormRef>(null);
  const [isValid, setIsValid] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => formRef.current?.submit()} disabled={!isValid}>
          <ThemedText className={cn('text-lg', isValid ? 'text-blue-500' : 'text-gray-400')}>
            추가
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
  }) => {
    if (!isValid) return;

    create({
      ...data,
      reminderEnabled: false,
    });
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <HabitForm
      ref={formRef}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      onNameChange={handleNameChange}
      submitLabel="추가"
    />
  );
}
