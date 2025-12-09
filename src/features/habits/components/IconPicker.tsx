import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { cn } from '@/lib/utils';
import { HabitIconName } from '@/features/habits/types';

const ICONS: HabitIconName[] = [
  'water',
  'run',
  'book-open-variant',
  'dumbbell',
  'meditation',
  'bed',
  'pill',
  'food-apple',
  'yoga',
  'guitar',
  'palette',
  'brain',
];

interface IconPickerProps {
  selectedIcon: HabitIconName;
  onSelect: (icon: HabitIconName) => void;
}

/**
 * Icon picker component
 */
export function IconPicker({ selectedIcon, onSelect }: IconPickerProps) {
  return (
    <View>
      <ThemedText className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
        아이콘 선택
      </ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {ICONS.map((icon) => {
          const isSelected = selectedIcon === icon;
          return (
            <Pressable
              key={icon}
              onPress={() => onSelect(icon)}
              className={cn(
                'mr-3 h-16 w-16 items-center justify-center rounded-2xl',
                isSelected ? 'bg-blue-500' : 'bg-gray-100 dark:bg-gray-700'
              )}
              style={styles.iconButton}>
              <MaterialCommunityIcons
                name={icon as any}
                size={32}
                color={isSelected ? '#fff' : '#6B7280'}
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});
