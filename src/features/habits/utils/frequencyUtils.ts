import { Habit } from '../types/habit.types';
import type { LanguageType } from '../types';

/**
 * 요일별 그룹
 */
export interface WeekdayGroup {
  weekday: string; // Localized weekday name
  weekdayIndex: number; // 1, 2, 3, ..., 0 (월~일)
  habits: Habit[];
}

/**
 * 요일 이름 배열 (인덱스 0=일, 1=월, 2=화, ...)
 * Language-specific weekday names
 */
const WEEKDAY_NAMES: Record<LanguageType, string[]> = {
  ko: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};

/**
 * 짧은 요일 이름 배열
 * Language-specific short weekday names
 */
const SHORT_WEEKDAY_NAMES: Record<LanguageType, string[]> = {
  ko: ['일', '월', '화', '수', '목', '금', '토'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

/**
 * customDays 배열을 사람이 읽을 수 있는 레이블로 변환
 * @param customDays - 요일 인덱스 배열 (0=일, 1=월, ..., 6=토)
 * @param language - Language for the label
 * @returns 요일 레이블 문자열
 *
 * @example
 * getFrequencyLabel([0,1,2,3,4,5,6], 'ko') // "매일"
 * getFrequencyLabel([1,2,3,4,5], 'ko') // "평일"
 * getFrequencyLabel([0,6], 'en') // "Weekends"
 * getFrequencyLabel([1,3,5], 'ko') // "월·수·금"
 */
export function getFrequencyLabel(customDays: number[], language: LanguageType = 'ko'): string {
  if (!customDays || customDays.length === 0) {
    return '';
  }

  const sortedDays = [...customDays].sort((a, b) => a - b);

  // 매일 (7일 모두)
  if (sortedDays.length === 7) {
    return language === 'ko' ? '매일' : 'Daily';
  }

  // 평일 (월~금)
  const weekdays = [1, 2, 3, 4, 5];
  if (sortedDays.length === 5 && weekdays.every((day) => sortedDays.includes(day))) {
    return language === 'ko' ? '평일' : 'Weekdays';
  }

  // 주말 (토, 일)
  const weekends = [0, 6];
  if (sortedDays.length === 2 && weekends.every((day) => sortedDays.includes(day))) {
    return language === 'ko' ? '주말' : 'Weekends';
  }

  // 커스텀 요일 (중점으로 구분)
  return sortedDays.map((day) => SHORT_WEEKDAY_NAMES[language][day]).join('·');
}

/**
 * 요일 인덱스가 해당 습관의 customDays에 포함되는지 확인
 * @param habit - 습관 객체
 * @param weekdayIndex - 요일 인덱스 (0=일, 1=월, ..., 6=토)
 * @returns 포함 여부
 */
function isHabitActiveOnWeekday(habit: Habit, weekdayIndex: number): boolean {
  if (!habit.customDays || habit.customDays.length === 0) {
    return false;
  }

  return habit.customDays.includes(weekdayIndex);
}

/**
 * 습관 배열을 요일별로 그룹핑
 * @param habits - 습관 배열
 * @param language - Language for weekday names
 * @returns 요일별 그룹 배열 (월→화→수→목→금→토→일 순서)
 *
 * @example
 * const habits = [
 *   { id: '1', name: '물 마시기', customDays: [0,1,2,3,4,5,6] }, // 매일
 *   { id: '2', name: '운동하기', customDays: [1,3,5] }, // 월수금
 * ];
 * const groups = groupHabitsByWeekday(habits, 'ko');
 * // 결과: 월요일 그룹에는 두 습관 모두 포함, 화요일에는 '물 마시기'만 포함
 */
export function groupHabitsByWeekday(
  habits: Habit[],
  language: LanguageType = 'ko'
): WeekdayGroup[] {
  // 요일 순서: 월(1) → 화(2) → 수(3) → 목(4) → 금(5) → 토(6) → 일(0)
  const weekdayOrder = [1, 2, 3, 4, 5, 6, 0];

  const groups: WeekdayGroup[] = weekdayOrder
    .map((weekdayIndex) => {
      // 해당 요일에 활성화된 습관만 필터링
      const habitsForDay = habits.filter((habit) => isHabitActiveOnWeekday(habit, weekdayIndex));

      return {
        weekday: WEEKDAY_NAMES[language][weekdayIndex],
        weekdayIndex,
        habits: habitsForDay,
      };
    })
    .filter((group) => group.habits.length > 0); // 빈 그룹 제외

  return groups;
}

/**
 * 현재 요일 인덱스 가져오기
 * @returns 0(일) ~ 6(토)
 */
export function getCurrentWeekdayIndex(): number {
  return new Date().getDay();
}

/**
 * 특정 날짜의 요일 인덱스 가져오기
 * @param date - 날짜 문자열 (YYYY-MM-DD)
 * @returns 0(일) ~ 6(토)
 */
export function getWeekdayIndexFromDate(date: string): number {
  return new Date(date).getDay();
}

/**
 * 오늘 활성화된 습관만 필터링
 * @param habits - 습관 배열
 * @returns 오늘 활성화된 습관 배열
 */
export function getTodayHabits(habits: Habit[]): Habit[] {
  const todayIndex = getCurrentWeekdayIndex();
  return habits.filter((habit) => isHabitActiveOnWeekday(habit, todayIndex));
}
