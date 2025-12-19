import { storage } from '@/features/habits/api/storage';
import { useHabitStore, useHabitCheckStore } from '@/features/habits/api';
import type { Habit, HabitCheck, FrequencyType, HabitIconName } from '@/features/habits/types';

/**
 * Dummy Habit 데이터 템플릿
 */
interface DummyHabitTemplate {
  name: string;
  icon: HabitIconName;
  color: string;
  frequency: FrequencyType;
}

const DUMMY_HABIT_TEMPLATES: DummyHabitTemplate[] = [
  { name: '물 마시기', icon: 'water', color: '#3B82F6', frequency: 'daily' },
  { name: '운동하기', icon: 'run', color: '#F97316', frequency: 'weekdays' },
  { name: '독서', icon: 'book-open-variant', color: '#8B5CF6', frequency: 'daily' },
  { name: '명상', icon: 'meditation', color: '#10B981', frequency: 'daily' },
  { name: '영어 공부', icon: 'translate', color: '#EAB308', frequency: 'weekdays' },
  { name: '일기 쓰기', icon: 'pencil', color: '#EC4899', frequency: 'daily' },
];

const STORAGE_KEY = 'dummy-data-initialized';

/**
 * 더미 습관 데이터 생성
 */
function generateDummyHabits(): Habit[] {
  const now = new Date();
  const createdAt = new Date(now);
  createdAt.setDate(createdAt.getDate() - 30); // 30일 전에 생성된 것으로 설정

  return DUMMY_HABIT_TEMPLATES.map((template, index) => ({
    id: `dummy-habit-${index + 1}`,
    name: template.name,
    icon: template.icon,
    color: template.color,
    frequency: template.frequency,
    reminderEnabled: false, // 알림 스케줄링 방지
    createdAt: createdAt.toISOString(),
    order: index,
  }));
}

/**
 * 습관의 frequency에 맞게 해당 날짜에 활성화되는지 확인
 */
function isHabitActiveOnDate(habit: Habit, date: Date): boolean {
  const dayOfWeek = date.getDay();

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
}

/**
 * 날짜 범위에 따른 완료율 계산
 */
function getCompletionRateForDaysAgo(daysAgo: number): number {
  if (daysAgo <= 7) {
    // 최근 7일: 90-100% 완료율
    return 0.9 + Math.random() * 0.1;
  } else if (daysAgo <= 14) {
    // 8-14일 전: 80-90% 완료율
    return 0.8 + Math.random() * 0.1;
  } else {
    // 15-30일 전: 70-85% 완료율
    return 0.7 + Math.random() * 0.15;
  }
}

/**
 * 더미 완료 기록 생성
 */
function generateDummyChecks(habits: Habit[]): HabitCheck[] {
  const checks: HabitCheck[] = [];
  const today = new Date();

  // 최근 30일간의 데이터 생성
  for (let daysAgo = 0; daysAgo < 30; daysAgo++) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    const dateString = date.toISOString().split('T')[0];

    const completionRate = getCompletionRateForDaysAgo(daysAgo);

    for (const habit of habits) {
      // 습관의 frequency에 맞지 않는 날은 스킵
      if (!isHabitActiveOnDate(habit, date)) {
        continue;
      }

      // 완료율에 따라 랜덤하게 완료 여부 결정
      const shouldComplete = Math.random() < completionRate;

      if (shouldComplete) {
        // 완료 시간은 해당 날짜의 랜덤한 시간으로 설정
        const completedDate = new Date(date);
        completedDate.setHours(8 + Math.floor(Math.random() * 14)); // 08:00 ~ 22:00
        completedDate.setMinutes(Math.floor(Math.random() * 60));

        checks.push({
          habitId: habit.id,
          date: dateString,
          completed: true,
          completedAt: completedDate.toISOString(),
        });
      }
    }
  }

  return checks;
}

/**
 * 강제로 더미 데이터 생성 (플래그 무시)
 * 개발 전용 - 기존 데이터를 모두 삭제하고 더미 데이터로 대체
 */
export function forceDummyData(): void {
  if (!__DEV__) {
    console.warn('[ForceDummyData] Not available in production');
    return;
  }

  try {
    console.log('[ForceDummyData] 🔄 Clearing existing data...');

    // 기존 데이터 모두 삭제
    useHabitStore.setState({ habits: [] });
    useHabitCheckStore.setState({ checks: {} });

    console.log('[ForceDummyData] 🔄 Generating dummy data...');

    // 더미 데이터 생성
    const dummyHabits = generateDummyHabits();
    const dummyChecks = generateDummyChecks(dummyHabits);

    // 스토어에 저장
    useHabitStore.setState({ habits: dummyHabits });

    const checksRecord: Record<string, HabitCheck> = {};
    for (const check of dummyChecks) {
      const key = `${check.habitId}_${check.date}`;
      checksRecord[key] = check;
    }
    useHabitCheckStore.setState({ checks: checksRecord });

    // 플래그 설정
    storage.set(STORAGE_KEY, 'true');

    console.log(
      `[ForceDummyData] ✅ Successfully generated ${dummyHabits.length} habits and ${dummyChecks.length} checks`
    );
    console.log('[ForceDummyData] 🔄 Pull to refresh or navigate to see changes');
  } catch (error) {
    console.error('[ForceDummyData] ❌ Failed:', error);
  }
}

// 앱 시작 시 자동 실행 (임시)
if (__DEV__) {
  // 3초 후 자동 실행 (앱 로딩 완료 대기)
  setTimeout(() => {
    const { useHabitStore } = require('@/features/habits/api');
    const habitCount = useHabitStore.getState().habits.length;

    if (habitCount === 0) {
      console.log('[ForceDummyData] 🔄 No habits found, auto-generating dummy data...');
      forceDummyData();
    } else {
      console.log(`[ForceDummyData] ℹ️ Found ${habitCount} existing habits, skipping auto-generation`);
    }
  }, 3000);
}
