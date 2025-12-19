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
  customDays?: number[]; // custom frequency일 때 사용
}

const DUMMY_HABIT_TEMPLATES: DummyHabitTemplate[] = [
  { name: 'Drink Water', icon: 'water', color: '#3B82F6', frequency: 'daily' },
  { name: 'Exercise', icon: 'run', color: '#F97316', frequency: 'custom', customDays: [1, 3, 5] }, // Mon Wed Fri
  { name: 'Reading', icon: 'book-open-variant', color: '#8B5CF6', frequency: 'daily' },
  { name: 'Meditation', icon: 'meditation', color: '#10B981', frequency: 'weekdays' },
  { name: 'Study English', icon: 'translate', color: '#EAB308', frequency: 'custom', customDays: [2, 4] }, // Tue Thu
  { name: 'Journal Writing', icon: 'pencil', color: '#EC4899', frequency: 'weekends' },
  { name: 'Stretching', icon: 'yoga', color: '#06B6D4', frequency: 'daily' },
  { name: 'Take Vitamins', icon: 'pill', color: '#84CC16', frequency: 'weekdays' },
  { name: 'Walking', icon: 'walk', color: '#14B8A6', frequency: 'custom', customDays: [0, 3, 6] }, // Sun Wed Sat
  { name: 'Guitar Practice', icon: 'guitar-acoustic', color: '#F59E0B', frequency: 'custom', customDays: [1, 2, 3, 4, 5] }, // Weekdays
];

const STORAGE_KEY = 'dummy-data-initialized';

/**
 * frequency에 맞는 customDays 배열 생성
 */
function getCustomDaysFromFrequency(frequency: FrequencyType): number[] {
  switch (frequency) {
    case 'daily':
      return [0, 1, 2, 3, 4, 5, 6]; // 매일
    case 'weekdays':
      return [1, 2, 3, 4, 5]; // 평일 (월~금)
    case 'weekends':
      return [0, 6]; // 주말 (일, 토)
    default:
      return [0, 1, 2, 3, 4, 5, 6]; // 기본값: 매일
  }
}

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
    customDays: template.customDays || getCustomDaysFromFrequency(template.frequency),
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
 * 더미 데이터 초기화 함수
 * dev 모드에서만 한번 실행되도록 구현
 */
export async function initializeDummyData(): Promise<void> {
  try {
    console.log('[DummyData] Starting initialization...');

    // 1. dev 모드 체크
    if (!__DEV__) {
      console.log('[DummyData] Not in dev mode, skipping');
      return;
    }
    console.log('[DummyData] Dev mode confirmed');

    // 2. MMKV 플래그 체크
    const isInitialized = storage.getString(STORAGE_KEY);
    console.log('[DummyData] Flag status:', isInitialized);
    if (isInitialized === 'true') {
      console.log('[DummyData] Already initialized, skipping');
      return;
    }

    // 3. 기존 데이터 있으면 스킵 (초기화 플래그 설정)
    const habitStore = useHabitStore.getState();
    console.log('[DummyData] Existing habits count:', habitStore.habits.length);
    if (habitStore.habits.length > 0) {
      console.log('[DummyData] Existing data found, skipping');
      storage.set(STORAGE_KEY, 'true');
      return;
    }

    console.log('[DummyData] Generating dummy data...');
    // 4. 더미 데이터 생성
    const dummyHabits = generateDummyHabits();
    const dummyChecks = generateDummyChecks(dummyHabits);
    console.log('[DummyData] Generated:', dummyHabits.length, 'habits,', dummyChecks.length, 'checks');

    // 5. 스토어에 저장
    // 습관 데이터 저장 (addHabit 대신 직접 state 업데이트)
    useHabitStore.setState({ habits: dummyHabits });

    // 체크 데이터 저장 (toggleCheck 대신 직접 state 업데이트)
    const checksRecord: Record<string, HabitCheck> = {};
    for (const check of dummyChecks) {
      const key = `${check.habitId}_${check.date}`;
      checksRecord[key] = check;
    }
    useHabitCheckStore.setState({ checks: checksRecord });

    // 6. 플래그 저장
    storage.set(STORAGE_KEY, 'true');
    console.log('[DummyData] ✅ Initialization complete!');
  } catch (error) {
    console.error('[DummyData] ❌ Failed to initialize dummy data:', error);
  }
}

/**
 * 더미 데이터 초기화 플래그 리셋 (개발용)
 * dev 모드에서만 동작
 */
export function resetDummyDataFlag(): void {
  if (!__DEV__) {
    return;
  }

  try {
    storage.remove(STORAGE_KEY);
    console.log('[DummyData] ✅ Flag reset successfully. Restart app to regenerate dummy data.');
  } catch (error) {
    console.error('[DummyData] ❌ Failed to reset flag:', error);
  }
}

/**
 * 강제로 더미 데이터 재생성 (개발용)
 * 기존 데이터를 모두 삭제하고 새로운 더미 데이터로 교체
 */
export function forceRegenerateDummyData(): void {
  if (!__DEV__) {
    console.warn('[DummyData] Not available in production');
    return;
  }

  try {
    console.log('[DummyData] 🔄 Clearing existing data...');

    // 기존 데이터 모두 삭제
    useHabitStore.setState({ habits: [] });
    useHabitCheckStore.setState({ checks: {} });

    console.log('[DummyData] 🔄 Generating new dummy data...');

    // 새로운 더미 데이터 생성
    const dummyHabits = generateDummyHabits();
    const dummyChecks = generateDummyChecks(dummyHabits);

    console.log('[DummyData] Generated:', dummyHabits.length, 'habits,', dummyChecks.length, 'checks');

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

    console.log('[DummyData] ✅ Successfully regenerated dummy data!');
    console.log('[DummyData] Pull to refresh or navigate to see changes');
  } catch (error) {
    console.error('[DummyData] ❌ Failed to regenerate:', error);
  }
}
