import React, { useLayoutEffect, useRef, useState } from 'react';
import { Pressable, Text } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';

import { useTheme } from '@/hooks';
import { useHabits } from '@/features/habits/hooks';
import { HabitForm, type HabitFormRef } from '@/features/habits/components/HabitForm';
import type { HabitIconName, FrequencyType } from '@/features/habits/types';

export default function NewHabitScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { create } = useHabits();
  const formRef = useRef<HabitFormRef>(null);
  const [isValid, setIsValid] = useState(false);
  const colorScheme = useTheme();

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
            추가
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
      onValidationChange={handleValidationChange}
      submitLabel="추가"
    />
  );
}
