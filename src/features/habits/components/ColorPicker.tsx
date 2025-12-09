import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { cn } from '@/lib/utils';

export const COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // yellow
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
];

interface ColorPickerProps {
  selectedColor: string;
  onSelect: (color: string) => void;
}

/**
 * Color picker component
 */
export function ColorPicker({ selectedColor, onSelect }: ColorPickerProps) {
  return (
    <View>
      <ThemedText className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
        색상 선택
      </ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {COLORS.map((color) => {
          const isSelected = selectedColor === color;
          return (
            <Pressable
              key={color}
              onPress={() => onSelect(color)}
              className={cn(
                'mr-3 h-12 w-12 items-center justify-center rounded-full',
                isSelected && 'border-2 border-gray-900 dark:border-white'
              )}
              style={[{ backgroundColor: color }, styles.colorButton]}>
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
