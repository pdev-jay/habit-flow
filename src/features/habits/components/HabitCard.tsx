import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks';
import { cn } from '@/lib/utils';
import { HabitIconName } from '@/features/habits/types';

import { CheckButton } from './CheckButton';

interface HabitCardProps {
  name: string;
  icon: HabitIconName;
  color: string;
  checked: boolean;
  frequencyLabel?: string;
  streak?: number;
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
  frequencyLabel,
  streak,
  onCheck,
  onPress,
  onLongPress,
}: HabitCardProps) {
  const colorScheme = useTheme();

  return (
    <Pressable
      onPress={onCheck}
      onLongPress={onLongPress}
      className={cn('mb-3 rounded-xl bg-white p-4 dark:bg-gray-800', checked && 'opacity-50')}
      style={styles.card}>
      <View className="flex-row items-center">
        <View
          className="mr-3 h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: color + '20' }}>
          <MaterialCommunityIcons name={icon} size={28} color={color} />
        </View>

        <View className="flex-1">
          <ThemedText
            className={cn(
              'text-base font-semibold',
              checked && 'text-gray-400 line-through dark:text-gray-500'
            )}>
            {name}
          </ThemedText>
          {frequencyLabel && (
            <ThemedText className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {frequencyLabel}
            </ThemedText>
          )}
        </View>

        {streak !== undefined && streak > 0 && (
          <View className="mr-3 flex-row items-center">
            <MaterialCommunityIcons
              name="fire"
              size={20}
              color={colorScheme === 'dark' ? '#FB923C' : '#F97316'}
            />
            <ThemedText className="ml-1 text-sm font-semibold text-orange-500 dark:text-orange-400">
              {streak}
            </ThemedText>
          </View>
        )}

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
