/**
 * AdMob 광고 관련 타입 정의
 */

/**
 * 광고 로드 에러 타입
 */
export interface AdLoadError {
  code: number;
  message: string;
}

/**
 * 광고 이벤트 타입
 */
export type AdEventType =
  | 'loaded'
  | 'failed_to_load'
  | 'presented'
  | 'failed_to_present'
  | 'dismissed'
  | 'earned_reward';

/**
 * 리워드 정보
 */
export interface AdReward {
  type: string;
  amount: number;
}

/**
 * useRewardedAd 훅 반환 타입
 */
export interface RewardedAdHookResult {
  /**
   * 광고 로드 중 상태
   */
  isLoading: boolean;

  /**
   * 광고가 로드되었는지 여부
   */
  isLoaded: boolean;

  /**
   * 광고 표시 중 여부
   */
  isShowing: boolean;

  /**
   * 광고 로드 에러
   */
  error: AdLoadError | null;

  /**
   * 광고 로드 함수
   */
  loadAd: () => void;

  /**
   * 광고 표시 함수
   */
  showAd: () => Promise<boolean>;
}

/**
 * 광고 세션 스토어 타입
 */
export interface AdSessionState {
  /**
   * 공유 기능 잠금 해제 여부 (세션 기반)
   */
  shareUnlocked: boolean;

  /**
   * 상세 분석 기능 잠금 해제 여부 (세션 기반)
   */
  analyticsUnlocked: boolean;

  /**
   * 공유 기능 잠금 해제
   */
  unlockShare: () => void;

  /**
   * 상세 분석 기능 잠금 해제
   */
  unlockAnalytics: () => void;

  /**
   * 모든 잠금 초기화 (앱 재시작 시 자동 호출됨)
   */
  resetAll: () => void;
}
