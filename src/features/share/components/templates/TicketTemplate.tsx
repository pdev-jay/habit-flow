import React from 'react';
import { View, Text } from 'react-native';
import type { WeeklyStats, MonthlyStats } from '../../types/share.types';
import { useI18n } from '@/hooks';

interface TicketWeeklyProps {
  stats: WeeklyStats;
}

/**
 * Ticket-style weekly template component
 * Ticket-shaped design with perforated edges
 */
export function TicketWeekly({ stats }: TicketWeeklyProps) {
  const { t } = useI18n();

  // Generate barcode ID
  const year = new Date().getFullYear();
  const barcodeId = `HBT-${year}-W${stats.weekNumber}-001`;

  return (
    <View className="w-[380px] bg-[#F5F0E8] px-4 py-8">
      {/* Main ticket content */}
      <View>
        {/* Header */}
        <View className="mb-6 items-center">
          <Text className="mb-1 text-[42px] font-black uppercase tracking-[4px] text-gray-900">
            {t('common:appName').toUpperCase()}
          </Text>
          <Text className="text-[11px] font-medium uppercase tracking-[3px] text-gray-500">
            {t('share:ticket.weekly.subtitle')}
          </Text>
        </View>

        {/* Divider */}
        <View className="mb-6 h-[1px] bg-gray-300" />

        {/* Date / Week / Year */}
        <View className="mb-6 flex-row justify-between px-2">
          <View className="items-start">
            <Text className="mb-1 text-[10px] font-semibold uppercase tracking-[1px] text-gray-500">
              {t('share:ticket.weekly.date')}
            </Text>
            <Text className="text-[16px] font-bold text-gray-900">{stats.dateRange}</Text>
          </View>
          <View className="items-center">
            <Text className="mb-1 text-[10px] font-semibold uppercase tracking-[1px] text-gray-500">
              {t('share:ticket.weekly.week')}
            </Text>
            <Text className="text-[16px] font-bold text-gray-900">{stats.weekNumber}</Text>
          </View>
          <View className="items-end">
            <Text className="mb-1 text-[10px] font-semibold uppercase tracking-[1px] text-gray-500">
              {t('share:ticket.weekly.year')}
            </Text>
            <Text className="text-[16px] font-bold text-gray-900">{new Date().getFullYear()}</Text>
          </View>
        </View>

        {/* Main content box */}
        <View className="rounded-[24px] border-2 border-gray-200 bg-white/60 p-6">
          {/* Completion rate */}
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-[16px] font-medium text-gray-700">
              {t('share:ticket.weekly.completionRate')}
            </Text>
            <Text className="text-[64px] font-black leading-[64px] text-green-600">
              {Math.round(stats.completionRate)}%
            </Text>
          </View>

          {/* Dashed separator */}
          <View className="mb-6 border-b border-dashed border-gray-300" />

          {/* Habits list */}
          {stats.habits.slice(0, 3).map((habit, index) => (
            <View key={habit.id}>
              <View className="flex-row items-center justify-between py-3">
                <View className="min-w-0 flex-1 flex-row items-center gap-3">
                  <Text className="w-6 text-[16px] font-bold text-gray-400">{index + 1}.</Text>
                  <Text
                    className="flex-1 text-[15px] font-semibold text-gray-800"
                    numberOfLines={1}>
                    {habit.name}
                  </Text>
                </View>
                <Text className="ml-3 text-[16px] font-bold text-green-600">
                  {Math.round(habit.completionRate)}%
                </Text>
              </View>
              {index < Math.min(stats.habits.length, 3) - 1 && (
                <View className="h-[1px] bg-gray-200" />
              )}
            </View>
          ))}
        </View>

        {/* Barcode */}
        <View className="mt-8 items-center">
          <View className="flex-row justify-center gap-[2px]">
            {[...Array(20)].map((_, i) => (
              <View
                key={i}
                className="bg-gray-900"
                style={{
                  width: i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1,
                  height: 48,
                  opacity: 0.8 + Math.random() * 0.2,
                }}
              />
            ))}
          </View>
          <Text className="mt-2 text-[10px] font-medium uppercase tracking-[2px] text-gray-400">
            {barcodeId}
          </Text>
        </View>
      </View>
    </View>
  );
}

interface TicketMonthlyProps {
  stats: MonthlyStats;
}

/**
 * Ticket-style monthly template component
 * Ticket-shaped design with perforated edges
 */
export function TicketMonthly({ stats }: TicketMonthlyProps) {
  const { t, language } = useI18n();

  // Generate barcode ID - extract month number based on language
  let monthNum = 1;
  if (language === 'ko') {
    // Korean format: "2025년 12월"
    monthNum = parseInt(stats.month.match(/(\d+)월/)?.[1] || '1');
  } else {
    // English format: "Dec 2025" - map month name to number
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthName = stats.month.split(' ')[0];
    const foundIndex = monthNames.findIndex((m) => m === monthName);
    monthNum = foundIndex !== -1 ? foundIndex + 1 : 1;
  }
  const barcodeId = `HBT-${stats.year}-M${String(monthNum).padStart(2, '0')}-001`;

  return (
    <View className="w-[380px] bg-[#F5F0E8] px-4 py-8">
      {/* Main ticket content */}
      <View>
        {/* Header */}
        <View className="mb-6 items-center">
          <Text className="mb-1 text-[42px] font-black uppercase tracking-[4px] text-gray-900">
            {t('common:appName').toUpperCase()}
          </Text>
          <Text className="text-[11px] font-medium uppercase tracking-[3px] text-gray-500">
            {t('share:ticket.monthly.subtitle')}
          </Text>
        </View>

        {/* Divider */}
        <View className="mb-6 h-[1px] bg-gray-300" />

        {/* Month / Year */}
        <View className="mb-6 flex-row justify-between px-2">
          <View className="items-start">
            <Text className="mb-1 text-[10px] font-semibold uppercase tracking-[1px] text-gray-500">
              {t('share:ticket.monthly.month')}
            </Text>
            <Text className="text-[16px] font-bold text-gray-900">{stats.month}</Text>
          </View>
          <View className="items-end">
            <Text className="mb-1 text-[10px] font-semibold uppercase tracking-[1px] text-gray-500">
              {t('share:ticket.monthly.year')}
            </Text>
            <Text className="text-[16px] font-bold text-gray-900">{stats.year}</Text>
          </View>
        </View>

        {/* Main content box */}
        <View className="rounded-[24px] border-2 border-gray-200 bg-white/60 p-6">
          {/* Average completion rate */}
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-[16px] font-medium text-gray-700">
              {t('share:ticket.monthly.averageCompletionRate')}
            </Text>
            <Text className="text-[64px] font-black leading-[64px] text-green-600">
              {Math.round(stats.averageCompletionRate)}%
            </Text>
          </View>

          {/* Dashed separator */}
          <View className="mb-6 border-b border-dashed border-gray-300" />

          {/* Stats row */}
          <View className="mb-6 flex-row justify-around">
            <View className="items-center">
              <Text className="text-[28px] font-bold text-gray-900">{stats.perfectDays}</Text>
              <Text className="mt-1 text-[11px] font-medium text-gray-500">
                {t('share:ticket.monthly.perfectDays')}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-[28px] font-bold text-gray-900">{stats.maxStreak}</Text>
              <Text className="mt-1 text-[11px] font-medium text-gray-500">
                {t('share:ticket.monthly.maxStreak')}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-[28px] font-bold text-gray-900">{stats.totalHabits}</Text>
              <Text className="mt-1 text-[11px] font-medium text-gray-500">
                {t('share:ticket.monthly.totalHabits')}
              </Text>
            </View>
          </View>

          {/* Separator */}
          <View className="mb-4 h-[1px] bg-gray-200" />

          {/* Habits list */}
          {stats.habits.slice(0, 3).map((habit, index) => (
            <View key={habit.id}>
              <View className="flex-row items-center justify-between py-3">
                <View className="min-w-0 flex-1 flex-row items-center gap-3">
                  <Text className="w-6 text-[16px] font-bold text-gray-400">{index + 1}.</Text>
                  <Text
                    className="flex-1 text-[15px] font-semibold text-gray-800"
                    numberOfLines={1}>
                    {habit.name}
                  </Text>
                </View>
                <Text className="ml-3 text-[16px] font-bold text-green-600">
                  {Math.round(habit.completionRate)}%
                </Text>
              </View>
              {index < Math.min(stats.habits.length, 3) - 1 && (
                <View className="h-[1px] bg-gray-200" />
              )}
            </View>
          ))}
        </View>

        {/* Barcode */}
        <View className="mt-8 items-center">
          <View className="flex-row justify-center gap-[2px]">
            {[...Array(20)].map((_, i) => (
              <View
                key={i}
                className="bg-gray-900"
                style={{
                  width: i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1,
                  height: 48,
                  opacity: 0.8 + Math.random() * 0.2,
                }}
              />
            ))}
          </View>
          <Text className="mt-2 text-[10px] font-medium uppercase tracking-[2px] text-gray-400">
            {barcodeId}
          </Text>
        </View>
      </View>
    </View>
  );
}
