import React from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
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
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <Pressable
      onPress={onCheck}
      onLongPress={onLongPress}
      className={cn(
        'relative mb-3 rounded-xl bg-white p-4 dark:bg-gray-800',
        isTablet && 'min-h-[120px] flex justify-center',
        checked && 'opacity-50'
      )}
      style={styles.card}>
      <View className="flex-row items-center">
        {/* Icon - Left */}
        <View
          className={cn(
            'items-center justify-center rounded-full',
            isTablet ? 'h-14 w-14' : 'h-12 w-12'
          )}
          style={{ backgroundColor: color + '20' }}>
          <MaterialCommunityIcons name={icon} size={isTablet ? 32 : 28} color={color} />
        </View>

        {/* Name & Frequency - Center */}
        <View className="mx-3 flex-1">
          <View className="flex-row items-center">
            <ThemedText
              className={cn(
                'flex-1 text-base font-semibold',
                checked && 'text-gray-400 line-through dark:text-gray-500'
              )}
              numberOfLines={2}>
              {name}
            </ThemedText>
            {/* Streak - Right of Name */}
            {streak !== undefined && streak > 0 && (
              <View className="ml-2 flex-row items-center">
                <MaterialCommunityIcons
                  name="fire"
                  size={16}
                  color={colorScheme === 'dark' ? '#FB923C' : '#F97316'}
                />
                <ThemedText className="ml-0.5 text-sm font-semibold text-orange-500 dark:text-orange-400">
                  {streak}
                </ThemedText>
              </View>
            )}
          </View>
          {frequencyLabel && (
            <ThemedText className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {frequencyLabel}
            </ThemedText>
          )}
        </View>

        {/* Check Button - Right */}
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
