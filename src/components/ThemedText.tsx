import React, { useMemo } from 'react';
import { Text, TextProps, useWindowDimensions } from 'react-native';

import { cn } from '@/lib/utils';

interface ThemedTextProps extends TextProps {
  className?: string;
}

/**
 * Themed Text component with dark mode support
 * Slightly larger text on tablets (width >= 768)
 */
export function ThemedText({ className, style, ...props }: ThemedTextProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  // Scale text sizes on tablet - increase only very small text
  const scaledClassName = useMemo(() => {
    if (!isTablet || !className) return className;

    // Only increase very small text for better readability
    // Medium and larger sizes remain unchanged
    const textSizeMap: Record<string, string> = {
      'text-xs': 'text-sm',
      'text-sm': 'text-base',
      // text-base and larger stay the same
    };

    return Object.entries(textSizeMap).reduce((acc, [phone, tablet]) => {
      const regex = new RegExp(`\\b${phone}\\b`, 'g');
      return acc.replace(regex, tablet);
    }, className);
  }, [isTablet, className]);

  return (
    <Text
      className={cn('text-gray-900 dark:text-white', scaledClassName)}
      style={style}
      {...props}
    />
  );
}
