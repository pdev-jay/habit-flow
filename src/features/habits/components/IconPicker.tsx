import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { useTheme, useI18n } from '@/hooks';
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
  'guitar-acoustic',
  'palette',
  'brain',
  'heart-outline',
  'translate',
  'leaf',
];

interface IconPickerProps {
  selectedIcon: HabitIconName;
  selectedColor: string;
  onSelect: (icon: HabitIconName) => void;
}

/**
 * Icon picker component
 */
export function IconPicker({ selectedIcon, selectedColor, onSelect }: IconPickerProps) {
  const colorScheme = useTheme();
  const { t } = useI18n();

  return (
    <View>
      <ThemedText className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
        {t('components:iconPicker.title')}
      </ThemedText>
      <View className="flex-row flex-wrap justify-between">
        {ICONS.map((icon, index) => {
          const isSelected = selectedIcon === icon;
          return (
            <Pressable
              key={icon}
              onPress={() => onSelect(icon)}
              className={cn(
                'mb-3 h-16 items-center justify-center rounded-2xl',
                !isSelected && 'bg-gray-100 dark:bg-gray-700'
              )}
              style={[
                styles.iconButton,
                {
                  width: '18%',
                  marginRight: index % 5 === 4 ? 0 : '2.5%',
                  backgroundColor: isSelected ? selectedColor + '20' : undefined,
                },
              ]}>
              <MaterialCommunityIcons
                name={icon}
                size={32}
                color={isSelected ? selectedColor : colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
              />
            </Pressable>
          );
        })}
      </View>
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
