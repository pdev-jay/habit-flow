import React from 'react';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useI18n } from '@/hooks';
import { cn } from '@/lib/utils';
import { getCurrentWeekdayIndex } from '@/features/habits/utils';

export type FilterType = 'all' | number;

interface HabitFilterTabsProps {
  value: FilterType;
  onChange: (filter: FilterType) => void;
}

export const HabitFilterTabs = React.memo(({ value, onChange }: HabitFilterTabsProps) => {
  const { t } = useI18n();
  const todayIndex = getCurrentWeekdayIndex();

  // 8개 필터 탭 데이터 (전체 + 7개 요일)
  const filterTabs: { key: FilterType; label: string; isToday: boolean }[] = [
    { key: 'all', label: t('screens:habits.filter.all'), isToday: false },
    { key: 0, label: t('common:weekdays.short.sun'), isToday: todayIndex === 0 },
    { key: 1, label: t('common:weekdays.short.mon'), isToday: todayIndex === 1 },
    { key: 2, label: t('common:weekdays.short.tue'), isToday: todayIndex === 2 },
    { key: 3, label: t('common:weekdays.short.wed'), isToday: todayIndex === 3 },
    { key: 4, label: t('common:weekdays.short.thu'), isToday: todayIndex === 4 },
    { key: 5, label: t('common:weekdays.short.fri'), isToday: todayIndex === 5 },
    { key: 6, label: t('common:weekdays.short.sat'), isToday: todayIndex === 6 },
  ];

  // shadow for active tab
  const activeShadowStyle = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Android
  };

  return (
    <View className="flex-row gap-2 rounded-lg bg-gray-200 p-1 dark:bg-gray-800">
      {filterTabs.map((tab) => {
        const isActive = value === tab.key;

        return (
          <Pressable
            key={String(tab.key)}
            onPress={() => onChange(tab.key)}
            className={cn(
              'flex-1 items-center justify-center rounded-md py-1.5',
              isActive ? 'bg-white dark:bg-gray-700' : ''
            )}
            style={isActive ? activeShadowStyle : undefined}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}>
            <ThemedText
              className={cn(
                'text-sm font-medium',
                isActive
                  ? 'text-blue-500 dark:text-blue-400'
                  : tab.isToday
                    ? 'text-blue-400 dark:text-blue-300'
                    : 'text-gray-500 dark:text-gray-400'
              )}>
              {tab.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
});

HabitFilterTabs.displayName = 'HabitFilterTabs';
