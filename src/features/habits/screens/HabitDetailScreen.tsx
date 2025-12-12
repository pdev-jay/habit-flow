import React, { useLayoutEffect } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useHabits, useHabitDetailStats } from '@/features/habits/hooks';
import { useHabitCheckStore } from '@/features/habits/stores';
import { getFrequencyLabel } from '@/features/habits/utils/frequencyUtils';
import { useI18n, useTheme } from '@/hooks';
import { cn } from '@/lib/utils';

/**
 * Habit detail screen
 */
export function HabitDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getHabitById, remove } = useHabits();
  const { deleteChecksByHabitId } = useHabitCheckStore();
  const { t, i18n } = useI18n();
  const colorScheme = useTheme();

  const habit = getHabitById(id || '');
  const stats = useHabitDetailStats(id || '');

  // Set up edit button in header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => router.push(`/habit/${id}/edit`)} className="active:opacity-70">
          <MaterialCommunityIcons
            name="pencil"
            size={24}
            color={colorScheme === 'dark' ? '#60A5FA' : '#3B82F6'}
          />
        </Pressable>
      ),
    });
  }, [id, navigation, router, colorScheme]);

  const handleDelete = () => {
    if (!id) return;

    Alert.alert(t('screens:habitDetail.delete'), t('screens:habitDetail.deleteConfirm'), [
      {
        text: t('common:cancel'),
        style: 'cancel',
      },
      {
        text: t('common:delete'),
        style: 'destructive',
        onPress: () => {
          remove(id);
          deleteChecksByHabitId(id);
          router.back();
        },
      },
    ]);
  };

  // Handle not found case
  if (!habit) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <ThemedText className="text-gray-500 dark:text-gray-400">
          {t('screens:habitDetail.notFound')}
        </ThemedText>
      </ThemedView>
    );
  }

  // Get frequency label
  const getFrequencyText = () => {
    if (habit.frequency === 'daily') {
      return i18n.language === 'ko' ? '매일' : 'Daily';
    }
    if (habit.frequency === 'weekdays') {
      return i18n.language === 'ko' ? '평일' : 'Weekdays';
    }
    if (habit.frequency === 'weekends') {
      return i18n.language === 'ko' ? '주말' : 'Weekends';
    }
    if (habit.frequency === 'custom' && habit.customDays) {
      return getFrequencyLabel(habit.customDays, i18n.language as 'ko' | 'en');
    }
    return '';
  };

  const hasStats = stats.totalCompletions > 0;

  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: insets.bottom + 80 }}>
        {/* Habit Name Header */}
        <View className="mb-6 flex-row items-center">
          <View
            className="mr-3 h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: habit.color + '20' }}>
            <MaterialCommunityIcons name={habit.icon} size={28} color={habit.color} />
          </View>
          <ThemedText className="flex-1 text-2xl font-bold">{habit.name}</ThemedText>
        </View>

        {/* Statistics Section */}
        <View
          className="mb-6 rounded-xl bg-white p-4 dark:bg-gray-800"
          style={[styles.card, { borderLeftWidth: 4, borderLeftColor: habit.color }]}>
          <View className="mb-3 flex-row items-center">
            <MaterialCommunityIcons
              name="chart-line"
              size={22}
              color={habit.color}
              style={{ marginRight: 8 }}
            />
            <ThemedText className="text-lg font-bold">{t('screens:habitDetail.stats')}</ThemedText>
          </View>

          {hasStats ? (
            <View className="flex-row flex-wrap">
              {/* Current Streak */}
              <View className="mb-3 w-1/2 pr-2">
                <View className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                  <View className="mb-1 flex-row items-center">
                    <MaterialCommunityIcons name="fire" size={20} color="#EF4444" />
                    <ThemedText className="ml-1 text-xs text-gray-600 dark:text-gray-400">
                      {t('screens:habitDetail.currentStreak')}
                    </ThemedText>
                  </View>
                  <ThemedText className="text-2xl font-bold">
                    {stats.currentStreak}
                    <ThemedText className="text-sm font-normal text-gray-500">
                      {' '}
                      {t('screens:habitDetail.days')}
                    </ThemedText>
                  </ThemedText>
                </View>
              </View>

              {/* Total Completions */}
              <View className="mb-3 w-1/2 pl-2">
                <View className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                  <View className="mb-1 flex-row items-center">
                    <MaterialCommunityIcons name="check-all" size={20} color="#10B981" />
                    <ThemedText className="ml-1 text-xs text-gray-600 dark:text-gray-400">
                      {t('screens:habitDetail.totalCompletions')}
                    </ThemedText>
                  </View>
                  <ThemedText className="text-2xl font-bold">
                    {stats.totalCompletions}
                    <ThemedText className="text-sm font-normal text-gray-500">
                      {' '}
                      {t('screens:habitDetail.times')}
                    </ThemedText>
                  </ThemedText>
                </View>
              </View>

              {/* Best Streak */}
              <View className="mb-3 w-1/2 pr-2">
                <View className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                  <View className="mb-1 flex-row items-center">
                    <MaterialCommunityIcons name="trophy" size={20} color="#F59E0B" />
                    <ThemedText className="ml-1 text-xs text-gray-600 dark:text-gray-400">
                      {t('screens:habitDetail.bestStreak')}
                    </ThemedText>
                  </View>
                  <ThemedText className="text-2xl font-bold">
                    {stats.longestStreakEver}
                    <ThemedText className="text-sm font-normal text-gray-500">
                      {' '}
                      {t('screens:habitDetail.days')}
                    </ThemedText>
                  </ThemedText>
                </View>
              </View>

              {/* Completion Rate */}
              <View className="mb-3 w-1/2 pl-2">
                <View className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                  <View className="mb-1 flex-row items-center">
                    <MaterialCommunityIcons name="percent" size={20} color="#3B82F6" />
                    <ThemedText className="ml-1 text-xs text-gray-600 dark:text-gray-400">
                      {t('screens:habitDetail.completionRate')}
                    </ThemedText>
                  </View>
                  <ThemedText className="text-2xl font-bold">
                    {stats.overallCompletionRate}%
                  </ThemedText>
                </View>
              </View>
            </View>
          ) : (
            <View className="items-center py-6">
              <MaterialCommunityIcons
                name="chart-line-variant"
                size={48}
                color={colorScheme === 'dark' ? '#4B5563' : '#D1D5DB'}
              />
              <ThemedText className="mt-3 text-center text-gray-500 dark:text-gray-400">
                {t('screens:habitDetail.noStatsYet')}
              </ThemedText>
            </View>
          )}
        </View>

        {/* Frequency Section */}
        <View
          className="mb-6 rounded-xl bg-white p-4 dark:bg-gray-800"
          style={[styles.card, { borderLeftWidth: 4, borderLeftColor: '#A855F7' }]}>
          <View className="mb-3 flex-row items-center">
            <MaterialCommunityIcons
              name="calendar-clock"
              size={22}
              color="#A855F7"
              style={{ marginRight: 8 }}
            />
            <ThemedText className="text-lg font-bold">
              {t('screens:habitDetail.frequency')}
            </ThemedText>
          </View>

          <View className="rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-700">
            <ThemedText className="text-base font-semibold">{getFrequencyText()}</ThemedText>
          </View>
        </View>

        {/* Reminder Section (only if enabled) */}
        {habit.reminderEnabled && habit.reminderTime && (
          <View
            className="mb-6 rounded-xl bg-white p-4 dark:bg-gray-800"
            style={[styles.card, { borderLeftWidth: 4, borderLeftColor: '#F59E0B' }]}>
            <View className="mb-3 flex-row items-center">
              <MaterialCommunityIcons
                name="bell-ring"
                size={22}
                color="#F59E0B"
                style={{ marginRight: 8 }}
              />
              <ThemedText className="text-lg font-bold">
                {t('screens:habitDetail.reminder')}
              </ThemedText>
            </View>

            <View className="rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-700">
              <ThemedText className="text-base font-semibold">{habit.reminderTime}</ThemedText>
            </View>
          </View>
        )}

        {/* Delete Button */}
        <View className="mt-4">
          <Pressable
            onPress={handleDelete}
            className={cn(
              'items-center justify-center rounded-lg border border-red-200 bg-white py-4',
              'active:bg-red-50 dark:border-red-900 dark:bg-gray-800 dark:active:bg-gray-700'
            )}>
            <ThemedText
              className="font-semibold"
              style={{ color: colorScheme === 'dark' ? '#F87171' : '#EF4444' }}>
              {t('common:delete')}
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
});
