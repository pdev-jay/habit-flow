import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { cn } from '@/lib/utils';
import type { FrequencyType, HabitIconName } from '@/features/habits/types';

import { ColorPicker, COLORS } from './ColorPicker';
import { IconPicker } from './IconPicker';

interface HabitFormData {
  name: string;
  icon: HabitIconName;
  color: string;
  frequency: FrequencyType;
}

interface HabitFormProps {
  initialData?: Partial<HabitFormData>;
  onSubmit: (data: HabitFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const FREQUENCIES: { value: FrequencyType; label: string }[] = [
  { value: 'daily', label: '매일' },
  { value: 'weekdays', label: '평일만' },
  { value: 'weekends', label: '주말만' },
];

/**
 * Habit form component
 */
export function HabitForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = '저장',
}: HabitFormProps) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(initialData?.name || '');
  const [icon, setIcon] = useState<HabitIconName>(initialData?.icon || 'water');
  const [color, setColor] = useState(initialData?.color || COLORS[0]);
  const [frequency, setFrequency] = useState<FrequencyType>(initialData?.frequency || 'daily');

  const handleSubmit = () => {
    if (!name.trim()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      icon,
      color,
      frequency,
    });
  };

  const isValid = name.trim().length > 0;

  return (
    <ThemedView className="flex-1" style={{ paddingTop: insets.top }}>
      <ScrollView className="flex-1 p-4">
        {/* Name Input */}
        <View className="mb-6">
          <ThemedText className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            습관 이름
          </ThemedText>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="예: 물 마시기"
            placeholderTextColor="#9CA3AF"
            className="h-12 rounded-lg border border-gray-300 bg-white px-4 text-base text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            maxLength={50}
          />
        </View>

        {/* Icon Picker */}
        <View className="mb-6">
          <IconPicker selectedIcon={icon} onSelect={setIcon} />
        </View>

        {/* Color Picker */}
        <View className="mb-6">
          <ColorPicker selectedColor={color} onSelect={setColor} />
        </View>

        {/* Frequency */}
        <View className="mb-6">
          <ThemedText className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
            반복 주기
          </ThemedText>
          <View className="flex-row">
            {FREQUENCIES.map((freq) => {
              const isSelected = frequency === freq.value;
              return (
                <Pressable
                  key={freq.value}
                  onPress={() => setFrequency(freq.value)}
                  className={cn(
                    'mr-2 flex-1 items-center justify-center rounded-lg py-3',
                    isSelected ? 'bg-blue-500' : 'bg-gray-100 dark:bg-gray-700'
                  )}
                  style={styles.frequencyButton}>
                  <ThemedText
                    className={cn(
                      'text-sm font-semibold',
                      isSelected ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                    )}>
                    {freq.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Actions */}
      <View className="border-t border-gray-200 p-4 dark:border-gray-700">
        <View className="flex-row space-x-3">
          <Pressable
            onPress={onCancel}
            className="flex-1 items-center justify-center rounded-lg bg-gray-100 py-3 dark:bg-gray-700"
            style={styles.button}>
            <ThemedText className="text-base font-semibold">취소</ThemedText>
          </Pressable>

          <Pressable
            onPress={handleSubmit}
            disabled={!isValid}
            className={cn(
              'flex-1 items-center justify-center rounded-lg py-3',
              isValid ? 'bg-blue-500 active:bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
            )}
            style={styles.button}>
            <ThemedText
              className={cn('text-base font-semibold', isValid ? 'text-white' : 'text-gray-500')}>
              {submitLabel}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  frequencyButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});
