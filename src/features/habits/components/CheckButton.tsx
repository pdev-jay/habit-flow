import React from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { cn } from '@/lib/utils';

interface CheckButtonProps {
  checked: boolean;
  onPress: () => void;
  color: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Check button with haptic feedback and animation
 */
export function CheckButton({ checked, onPress, color }: CheckButtonProps) {
  const scale = useSharedValue(1);

  const handlePress = () => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Animation
    scale.value = withSequence(withSpring(0.9, { damping: 10 }), withSpring(1, { damping: 10 }));

    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <AnimatedPressable
      onPress={handlePress}
      className={cn(
        'h-10 w-10 items-center justify-center rounded-full',
        checked ? 'bg-purple-400' : 'border-2 border-gray-300 bg-transparent dark:border-gray-600'
      )}
      style={animatedStyle}>
      {checked && <MaterialCommunityIcons name="check" size={24} color="white" />}
    </AnimatedPressable>
  );
}
