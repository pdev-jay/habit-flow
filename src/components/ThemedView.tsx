import React from 'react';
import { View, ViewProps } from 'react-native';

import { cn } from '@/lib/utils';

interface ThemedViewProps extends ViewProps {
  className?: string;
}

/**
 * Themed View component with dark mode support
 */
export function ThemedView({ className, style, ...props }: ThemedViewProps) {
  return <View className={cn('bg-white dark:bg-gray-900', className)} style={style} {...props} />;
}
