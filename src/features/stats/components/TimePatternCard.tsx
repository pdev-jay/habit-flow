import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

import { useTheme, useI18n } from '@/hooks';
import { useTimePattern, type TimeSlotKey } from '../hooks/useTimePattern';

/**
 * Time pattern analysis card component with donut chart
 * Shows completion rate distribution across 8 time slots (3-hour intervals)
 */
export function TimePatternCard() {
  const colorScheme = useTheme();
  const { t } = useI18n();
  const timeSlots = useTimePattern();

  // Find most active time slot
  const mostActive = timeSlots.reduce(
    (max, slot) => (slot.totalCompletions > max.totalCompletions ? slot : max),
    timeSlots[0]
  );

  // Check if there's any data
  const hasData = timeSlots.some((slot) => slot.totalCompletions > 0);
  const totalCompletions = timeSlots.reduce((sum, slot) => sum + slot.totalCompletions, 0);

  // Time slot colors (vibrant colors for each time slot)
  const timeSlotColors: Record<TimeSlotKey, string> = {
    lateNight: '#6366F1', // Indigo
    dawn: '#8B5CF6', // Purple
    earlyMorning: '#EC4899', // Pink
    morning: '#F59E0B', // Amber
    earlyAfternoon: '#EAB308', // Yellow
    afternoon: '#22C55E', // Green
    evening: '#10B981', // Emerald
    night: '#3B82F6', // Blue
  };

  // Time slot icons
  const timeSlotIcons: Record<TimeSlotKey, string> = {
    lateNight: 'sleep',
    dawn: 'weather-night',
    earlyMorning: 'weather-sunset-up',
    morning: 'weather-sunny',
    earlyAfternoon: 'white-balance-sunny',
    afternoon: 'weather-partly-cloudy',
    evening: 'weather-sunset-down',
    night: 'moon-waning-crescent',
  };

  // Donut chart dimensions (commented out)
  // const size = 240;
  // const strokeWidth = 40;
  // const radius = (size - strokeWidth) / 2;
  // const cx = size / 2;
  // const cy = size / 2;
  // const circumference = 2 * Math.PI * radius;

  return (
    <View className="mx-4 mb-4 rounded-2xl bg-white p-6 dark:bg-gray-800">
      {/* Header */}
      <View className="mb-4 flex-row items-center gap-2">
        <MaterialCommunityIcons
          name="clock-outline"
          size={24}
          color={colorScheme === 'dark' ? '#60A5FA' : '#3B82F6'}
        />
        <Text className="text-lg font-bold text-gray-900 dark:text-white">
          {t('screens:stats.timePattern')}
        </Text>
      </View>

      {hasData ? (
        <>
          {/* Donut Chart (commented out) */}
          {/* <View className="items-center py-4">
            <Svg width={size} height={size}>
              <G rotation={-90} origin={`${cx}, ${cy}`}>
                <Circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  stroke={colorScheme === 'dark' ? '#374151' : '#E5E7EB'}
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                {(() => {
                  let currentOffset = 0;
                  return timeSlots.map((slot, index) => {
                    if (slot.percentage === 0) return null;
                    const dashLength = (slot.percentage / 100) * circumference;
                    const dashOffset = -currentOffset;
                    currentOffset += dashLength;
                    return (
                      <Circle
                        key={index}
                        cx={cx}
                        cy={cy}
                        r={radius}
                        stroke={timeSlotColors[slot.timeSlot]}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={`${dashLength} ${circumference}`}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="butt"
                      />
                    );
                  });
                })()}
              </G>
              <SvgText
                x={cx}
                y={cy - 8}
                fontSize="32"
                fontWeight="bold"
                fill={colorScheme === 'dark' ? '#FFFFFF' : '#111827'}
                textAnchor="middle">
                {totalCompletions}
              </SvgText>
              <SvgText
                x={cx}
                y={cy + 16}
                fontSize="12"
                fill={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                textAnchor="middle">
                {t('screens:stats.times')}
              </SvgText>
            </Svg>
          </View>
          <View className="mt-4 flex-row flex-wrap justify-center gap-3">
            {timeSlots
              .filter((slot) => slot.totalCompletions > 0)
              .map((slot) => (
                <View key={slot.timeSlot} className="flex-row items-center gap-1.5">
                  <View
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: timeSlotColors[slot.timeSlot] }}
                  />
                  <Text className="text-xs text-gray-700 dark:text-gray-300">
                    {t(`screens:stats.timeSlots.${slot.timeSlot}`).split(' ')[0]} (
                    {slot.completionRate}%)
                  </Text>
                </View>
              ))}
          </View> */}

          {/* Bar Chart */}
          <View className="space-y-3">
            {timeSlots.map((slot) => {
              const isMostActive = slot.timeSlot === mostActive.timeSlot;
              const barColor = timeSlotColors[slot.timeSlot];

              return (
                <View key={slot.timeSlot}>
                  <View className="mb-2 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <MaterialCommunityIcons
                        name={timeSlotIcons[slot.timeSlot] as any}
                        size={20}
                        color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                      />
                      <Text className="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t(`screens:stats.timeSlots.${slot.timeSlot}`)}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Text className="text-sm font-bold text-gray-900 dark:text-white">
                        {slot.completionRate}%
                      </Text>
                      {isMostActive && slot.totalCompletions > 0 && (
                        <MaterialCommunityIcons
                          name="star"
                          size={16}
                          color="#FCD34D"
                        />
                      )}
                    </View>
                  </View>
                  <View className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${slot.completionRate}%`,
                        backgroundColor: barColor,
                      }}
                    />
                  </View>
                  <Text className="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">
                    {slot.totalCompletions} {t('screens:stats.times')}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Most active time insight */}
          {mostActive.totalCompletions > 0 && (
            <View className="mt-4 rounded-xl bg-blue-50 p-3 dark:bg-blue-900/20">
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons
                  name="star"
                  size={20}
                  color={colorScheme === 'dark' ? '#60A5FA' : '#3B82F6'}
                />
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                    {t('screens:stats.mostActiveTime')}:{' '}
                    {t(`screens:stats.timeSlots.${mostActive.timeSlot}`)}
                  </Text>
                  <Text className="text-xs text-gray-600 dark:text-gray-400">
                    {t('screens:stats.completionsCount', {
                      count: mostActive.totalCompletions,
                    })}{' '}
                    · {mostActive.completionRate}%
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Tip */}
          {mostActive.totalCompletions > 0 && (
            <View className="mt-3 rounded-xl bg-amber-50 p-3 dark:bg-amber-900/20">
              <View className="flex-row items-start gap-2">
                <MaterialCommunityIcons
                  name="lightbulb-outline"
                  size={20}
                  color={colorScheme === 'dark' ? '#FCD34D' : '#F59E0B'}
                />
                <Text className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                  {t('screens:stats.timePatternTip', {
                    time: t(`screens:stats.timeSlots.${mostActive.timeSlot}`),
                  })}
                </Text>
              </View>
            </View>
          )}
        </>
      ) : (
        /* No data */
        <View className="items-center py-8">
          <MaterialCommunityIcons
            name="clock-outline"
            size={48}
            color={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
          />
          <Text className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t('screens:stats.noData')}
          </Text>
        </View>
      )}
    </View>
  );
}
