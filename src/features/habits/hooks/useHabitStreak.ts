import { useMemo } from 'react';
import { useHabitCheckStore } from '../stores';
import { calculateStreak } from '../utils/streakUtils';
import type { Habit } from '../types/habit.types';

/**
 * 특정 습관의 스트릭(연속 달성 일수) 계산 훅
 *
 * @description
 * - 습관의 활성 요일만 고려하여 스트릭 계산
 * - 오늘부터 역순으로 연속 완료된 날짜 수 카운트
 * - 하루라도 빠지면 0으로 리셋
 * - 습관 생성일 이전은 카운트 안 함
 *
 * @param habit - 스트릭을 계산할 습관
 * @returns 연속 달성 일수
 *
 * @example
 * ```tsx
 * function HabitCard({ habit }: { habit: Habit }) {
 *   const streak = useHabitStreak(habit);
 *
 *   return (
 *     <View>
 *       <Text>{habit.name}</Text>
 *       <Text>{streak}일 연속</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useHabitStreak(habit: Habit): number {
  const getChecksByHabitId = useHabitCheckStore((state) => state.getChecksByHabitId);

  const streak = useMemo(() => {
    const checks = getChecksByHabitId(habit.id);
    return calculateStreak(habit, checks);
  }, [habit, getChecksByHabitId]);

  return streak;
}

/**
 * 여러 습관의 스트릭을 일괄 계산하는 훅
 *
 * @description
 * - 여러 습관의 스트릭을 한 번에 계산
 * - habitId를 key로 하는 Map 반환
 *
 * @param habits - 스트릭을 계산할 습관 배열
 * @returns habitId를 key로 하는 스트릭 Map
 *
 * @example
 * ```tsx
 * function HabitList({ habits }: { habits: Habit[] }) {
 *   const streaks = useHabitStreaks(habits);
 *
 *   return (
 *     <FlatList
 *       data={habits}
 *       renderItem={({ item }) => (
 *         <Text>{item.name}: {streaks[item.id]}일</Text>
 *       )}
 *     />
 *   );
 * }
 * ```
 */
export function useHabitStreaks(habits: Habit[]): Record<string, number> {
  const getChecksByHabitId = useHabitCheckStore((state) => state.getChecksByHabitId);

  const streaks = useMemo(() => {
    const result: Record<string, number> = {};

    habits.forEach((habit) => {
      const checks = getChecksByHabitId(habit.id);
      result[habit.id] = calculateStreak(habit, checks);
    });

    return result;
  }, [habits, getChecksByHabitId]);

  return streaks;
}
