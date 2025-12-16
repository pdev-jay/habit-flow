import { useCallback } from 'react';
import { useHabitStore } from '../api';
import { isHabitCreatedByDate } from '../utils/dateUtils';
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics';
import type { Habit, CreateHabitInput } from '../types';

/**
 * Habits CRUD 훅
 * - Zustand 스토어를 감싸서 컴포넌트에서 사용하기 쉽게 제공
 */
export function useHabits() {
  const habits = useHabitStore((state) => state.habits);
  const addHabit = useHabitStore((state) => state.addHabit);
  const updateHabit = useHabitStore((state) => state.updateHabit);
  const deleteHabit = useHabitStore((state) => state.deleteHabit);
  const reorderHabits = useHabitStore((state) => state.reorderHabits);
  const { logEvent } = useAnalytics();

  /**
   * 정렬된 습관 목록 반환 (order 기준)
   */
  const sortedHabits = useCallback(() => {
    return [...habits].sort((a, b) => a.order - b.order);
  }, [habits]);

  /**
   * 특정 ID의 습관 조회
   */
  const getHabitById = useCallback(
    (id: string): Habit | undefined => {
      return habits.find((habit) => habit.id === id);
    },
    [habits]
  );

  /**
   * 특정 날짜에 활성화된 습관 목록
   */
  const getActiveHabitsForDate = useCallback(
    (date: Date): Habit[] => {
      const dayOfWeek = date.getDay(); // 0 = 일요일, 6 = 토요일

      return sortedHabits().filter((habit) => {
        // 1. 습관 생성일 이전이면 제외
        if (!isHabitCreatedByDate(habit, date)) {
          return false;
        }

        // 2. 요일별 활성 여부 체크
        switch (habit.frequency) {
          case 'daily':
            return true;
          case 'weekdays':
            return dayOfWeek >= 1 && dayOfWeek <= 5;
          case 'weekends':
            return dayOfWeek === 0 || dayOfWeek === 6;
          case 'custom':
            return habit.customDays?.includes(dayOfWeek) ?? false;
          default:
            return false;
        }
      });
    },
    [sortedHabits]
  );

  /**
   * Create habit with analytics
   */
  const create = useCallback(
    (input: CreateHabitInput) => {
      const newHabit: Habit = {
        ...input,
        id: `habit_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        createdAt: new Date().toISOString(),
        order: habits.length,
      };

      addHabit(newHabit);
      logEvent('habit_created', {
        habit_id: newHabit.id,
        frequency: newHabit.frequency,
        has_reminder: newHabit.reminderEnabled,
      });
    },
    [addHabit, habits.length, logEvent]
  );

  /**
   * Delete habit with analytics
   */
  const remove = useCallback(
    (id: string) => {
      const habit = habits.find((h) => h.id === id);
      const streak = habit ? 0 : 0; // TODO: Get actual streak from check store

      deleteHabit(id);
      logEvent('habit_deleted', {
        habit_id: id,
        streak_lost: streak,
      });
    },
    [deleteHabit, habits, logEvent]
  );

  return {
    habits: sortedHabits(),
    addHabit,
    updateHabit,
    deleteHabit,
    reorderHabits,
    getHabitById,
    getActiveHabitsForDate,
    // Aliases for frontend compatibility with analytics
    create,
    update: updateHabit,
    remove,
  };
}
