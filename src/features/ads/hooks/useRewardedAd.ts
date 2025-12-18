import { useState, useEffect, useCallback } from 'react';
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import { REWARDED_AD_UNIT_ID, isAdMobConfigured } from '../constants/adUnitIds';
import type { RewardedAdHookResult, AdLoadError } from '../types/ad.types';

/**
 * Rewarded 광고 훅
 * - 광고 로드, 표시, 리워드 콜백 제공
 * - 에러 처리 및 로딩 상태 관리
 *
 * @example
 * ```tsx
 * const { isLoaded, isLoading, showAd, loadAd, error } = useRewardedAd();
 *
 * useEffect(() => {
 *   loadAd();
 * }, []);
 *
 * const handleWatchAd = async () => {
 *   const rewarded = await showAd();
 *   if (rewarded) {
 *     // 리워드 처리
 *   }
 * };
 * ```
 */
export function useRewardedAd(): RewardedAdHookResult {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const [error, setError] = useState<AdLoadError | null>(null);
  const [rewardedAd, setRewardedAd] = useState<RewardedAd | null>(null);

  /**
   * 광고 인스턴스 초기화
   */
  useEffect(() => {
    if (!isAdMobConfigured()) {
      setError({
        code: -1,
        message: 'AdMob이 설정되지 않았습니다.',
      });
      return;
    }

    // 개발 중에는 테스트 ID 사용, 프로덕션에서는 실제 ID 사용
    const adUnitId =
      __DEV__ && REWARDED_AD_UNIT_ID.includes('3940256099942544')
        ? TestIds.REWARDED
        : REWARDED_AD_UNIT_ID;

    const ad = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: false,
    });

    setRewardedAd(ad);

    return () => {
      // Cleanup (광고 인스턴스는 자동으로 정리됨)
    };
  }, []);

  /**
   * 광고 이벤트 리스너 등록
   */
  useEffect(() => {
    if (!rewardedAd) return;

    const loadedListener = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setIsLoading(false);
      setIsLoaded(true);
      setError(null);
    });

    const earnedRewardListener = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        // 리워드 획득 로그 (개발 모드에서만)
        if (__DEV__) {
          console.log('광고 리워드 획득:', reward);
        }
      }
    );

    return () => {
      loadedListener();
      earnedRewardListener();
    };
  }, [rewardedAd]);

  /**
   * 광고 로드 함수
   */
  const loadAd = useCallback(() => {
    if (!rewardedAd) {
      setError({
        code: -1,
        message: '광고 인스턴스가 초기화되지 않았습니다.',
      });
      return;
    }

    if (isLoading || isLoaded) {
      return;
    }

    setIsLoading(true);
    setError(null);

    // 에러 리스너 추가
    const errorListener = rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
      setIsLoading(false);
      setIsLoaded(false);
      setError({
        code: 0,
        message: error.message || '광고 로드에 실패했습니다.',
      });
      errorListener();
    });

    // load()는 void를 반환하므로 바로 호출
    rewardedAd.load();
  }, [rewardedAd, isLoading, isLoaded]);

  /**
   * 광고 표시 함수
   * @returns 리워드를 받았는지 여부
   */
  const showAd = useCallback(async (): Promise<boolean> => {
    if (!rewardedAd) {
      setError({
        code: -1,
        message: '광고 인스턴스가 초기화되지 않았습니다.',
      });
      return false;
    }

    if (!isLoaded) {
      setError({
        code: -2,
        message: '광고가 아직 로드되지 않았습니다.',
      });
      return false;
    }

    return new Promise<boolean>((resolve) => {
      let rewarded = false;

      // 리워드 획득 리스너 (일회성)
      const earnedListener = rewardedAd.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
          rewarded = true;
        }
      );

      // 광고 닫힘 리스너 (일회성) - AdEventType.CLOSED 사용
      const closedListener = rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
        setIsShowing(false);
        setIsLoaded(false);
        earnedListener();
        closedListener();
        resolve(rewarded);
      });

      setIsShowing(true);
      rewardedAd.show().catch((showError: Error) => {
        setIsShowing(false);
        setIsLoaded(false);
        setError({
          code: 0,
          message: showError.message || '광고 표시에 실패했습니다.',
        });
        earnedListener();
        closedListener();
        resolve(false);
      });
    });
  }, [rewardedAd, isLoaded]);

  return {
    isLoading,
    isLoaded,
    isShowing,
    error,
    loadAd,
    showAd,
  };
}
