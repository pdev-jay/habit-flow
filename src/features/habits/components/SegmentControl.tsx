import { View, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useTheme, useI18n } from '@/hooks';
import { cn } from '@/lib/utils';

interface SegmentControlProps {
  value: 'weekly' | 'monthly';
  onChange: (value: 'weekly' | 'monthly') => void;
}

export function SegmentControl({ value, onChange }: SegmentControlProps) {
  const colorScheme = useTheme();
  const { t } = useI18n();
  const isDark = colorScheme === 'dark';

  // shadow-sm을 inline style로 구현 (NativeWind navigation context 버그 우회)
  const activeShadowStyle = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1, // Android
  };

  return (
    <View className="flex-row rounded-lg bg-gray-200 p-1 dark:bg-gray-700">
      <Pressable
        className={cn(
          'h-8 flex-1 items-center justify-center rounded-md',
          value === 'weekly' && (isDark ? 'bg-gray-800' : 'bg-white')
        )}
        style={value === 'weekly' ? activeShadowStyle : undefined}
        onPress={() => onChange('weekly')}>
        <ThemedText
          className={cn(
            'text-sm font-medium',
            value === 'weekly' ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'
          )}>
          {t('screens:stats.weekly')}
        </ThemedText>
      </Pressable>
      <Pressable
        className={cn(
          'h-8 flex-1 items-center justify-center rounded-md',
          value === 'monthly' && (isDark ? 'bg-gray-800' : 'bg-white')
        )}
        style={value === 'monthly' ? activeShadowStyle : undefined}
        onPress={() => onChange('monthly')}>
        <ThemedText
          className={cn(
            'text-sm font-medium',
            value === 'monthly' ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'
          )}>
          {t('screens:stats.monthly')}
        </ThemedText>
      </Pressable>
    </View>
  );
}
