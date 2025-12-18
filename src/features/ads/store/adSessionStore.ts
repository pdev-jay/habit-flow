import { create } from 'zustand';
import type { AdSessionState } from '../types/ad.types';

/**
 * 광고 시청 후 세션별 잠금 해제 상태 관리
 * - 앱 재시작 시 초기화됨 (persist 없음)
 * - shareUnlocked: 공유 기능
 * - analyticsUnlocked: 상세 분석 기능
 */
export const useAdSessionStore = create<AdSessionState>((set) => ({
  shareUnlocked: false,
  analyticsUnlocked: false,

  unlockShare: () => {
    set({ shareUnlocked: true });
  },

  unlockAnalytics: () => {
    set({ analyticsUnlocked: true });
  },

  resetAll: () => {
    set({ shareUnlocked: false, analyticsUnlocked: false });
  },
}));
