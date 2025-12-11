import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { useI18n } from '@/hooks';
import { cn } from '@/lib/utils';

export const COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#14B8A6', // teal
  '#6366F1', // indigo
  '#84CC16', // lime
  '#F97316', // orange
  '#F43F5E', // rose
  '#0EA5E9', // sky
];

interface ColorPickerProps {
  selectedColor: string;
  onSelect: (color: string) => void;
}

/**
 * Color picker component
 */
export function ColorPicker({ selectedColor, onSelect }: ColorPickerProps) {
  const { t } = useI18n();

  return (
    <View>
      <ThemedText className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
        {t('components:colorPicker.title')}
      </ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {COLORS.map((color) => {
          const isSelected = selectedColor === color;
          return (
            <Pressable
              key={color}
              onPress={() => onSelect(color)}
              className={cn(
                'mr-3 h-14 w-14 items-center justify-center rounded-full',
                isSelected && 'border-4 border-gray-300 dark:border-gray-600'
              )}
              style={[styles.colorButton, { backgroundColor: color }]}>
              {isSelected && <MaterialCommunityIcons name="check" size={24} color="white" />}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  colorButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
