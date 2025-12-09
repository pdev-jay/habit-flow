import React from 'react';
import { Text, TextProps } from 'react-native';

import { cn } from '@/lib/utils';

interface ThemedTextProps extends TextProps {
  className?: string;
}

/**
 * Themed Text component with dark mode support
 */
export function ThemedText({ className, style, ...props }: ThemedTextProps) {
  return (
    <Text className={cn('text-gray-900 dark:text-white', className)} style={style} {...props} />
  );
}
