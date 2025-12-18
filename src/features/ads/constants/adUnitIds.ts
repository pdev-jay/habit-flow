import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * AdMob 광고 단위 ID 상수
 * - app.json의 extra.admob에서 가져옴
 * - Platform별 ID 분기
 */

const admobConfig = Constants.expoConfig?.extra?.admob;

/**
 * Rewarded Ad Unit ID
 * - iOS/Android 플랫폼별 분기
 * - 환경변수가 없으면 빈 문자열 (개발 중 안전장치)
 */
export const REWARDED_AD_UNIT_ID: string =
  Platform.OS === 'ios'
    ? (admobConfig?.iosRewardedAdUnitId ?? '')
    : (admobConfig?.androidRewardedAdUnitId ?? '');

/**
 * AdMob 설정 검증
 * - 광고 단위 ID가 올바르게 설정되었는지 확인
 */
export const isAdMobConfigured = (): boolean => {
  return REWARDED_AD_UNIT_ID.length > 0;
};
