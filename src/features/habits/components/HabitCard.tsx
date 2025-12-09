import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { cn } from '@/lib/utils';
import { HabitIconName } from '@/features/habits/types';

import { CheckButton } from './CheckButton';

interface HabitCardProps {
  name: string;
  icon: HabitIconName;
  color: string;
  checked: boolean;
  onCheck: () => void;
  onPress?: () => void;
  onLongPress?: () => void;
}

/**
 * Habit card component
 */
export function HabitCard({
  name,
  icon,
  color,
  checked,
  onCheck,
  onPress,
  onLongPress,
}: HabitCardProps) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="mb-3 rounded-xl bg-white p-4 dark:bg-gray-800"
      style={styles.card}>
      <View className="flex-row items-center">
        <View
          className="mr-3 h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: color + '20' }}>
          <MaterialCommunityIcons name={icon as any} size={28} color={color} />
        </View>

        <ThemedText
          className={cn(
            'flex-1 text-base font-semibold',
            checked && 'text-gray-400 line-through dark:text-gray-500'
          )}>
          {name}
        </ThemedText>

        <CheckButton checked={checked} onPress={onCheck} color={color} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
