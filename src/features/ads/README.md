# AdMob 광고 기능 (Ads Feature)

Google AdMob 보상형 광고 시스템 구현

## 파일 구조

```
src/features/ads/
├── types/
│   └── ad.types.ts              # 광고 관련 타입 정의
├── constants/
│   └── adUnitIds.ts             # 광고 단위 ID 상수
├── hooks/
│   ├── useRewardedAd.ts         # Rewarded 광고 훅
│   └── index.ts                 # 훅 export
├── store/
│   └── adSessionStore.ts        # 세션별 잠금 해제 상태 (Zustand)
├── index.ts                     # 전체 export
└── README.md                    # 이 문서
```

---

## Frontend 사용 가이드

### 1. 기본 사용법

```tsx
import { useRewardedAd } from '@/features/ads';
import { useEffect } from 'react';

function MyScreen() {
  const { isLoaded, isLoading, showAd, loadAd, error } = useRewardedAd();

  // 화면 진입 시 광고 로드
  useEffect(() => {
    loadAd();
  }, [loadAd]);

  const handleWatchAd = async () => {
    const rewarded = await showAd();
    if (rewarded) {
      // 리워드 처리
      console.log('사용자가 광고를 시청했습니다!');
    }
  };

  return (
    <View>
      {isLoading && <Text>광고 로딩 중...</Text>}
      {error && <Text>에러: {error.message}</Text>}
      <Button
        title="광고 시청하고 잠금 해제"
        onPress={handleWatchAd}
        disabled={!isLoaded || isLoading}
      />
    </View>
  );
}
```

### 2. 세션 스토어 사용 (공유/분석 잠금 해제)

```tsx
import { useAdSessionStore } from '@/features/ads';

function ShareScreen() {
  const shareUnlocked = useAdSessionStore((state) => state.shareUnlocked);
  const unlockShare = useAdSessionStore((state) => state.unlockShare);
  const { isLoaded, showAd, loadAd } = useRewardedAd();

  useEffect(() => {
    loadAd();
  }, []);

  const handleUnlock = async () => {
    const rewarded = await showAd();
    if (rewarded) {
      unlockShare();
    }
  };

  if (shareUnlocked) {
    return <ShareFeature />;
  }

  return (
    <View>
      <Text>광고를 시청하고 공유 기능을 사용하세요</Text>
      <Button title="광고 시청" onPress={handleUnlock} disabled={!isLoaded} />
    </View>
  );
}
```

---

## API 레퍼런스

### `useRewardedAd()`

Rewarded 광고 훅

#### 반환값 (`RewardedAdHookResult`)

| 속성        | 타입                     | 설명                                   |
| ----------- | ------------------------ | -------------------------------------- |
| `isLoading` | `boolean`                | 광고 로드 중 상태                      |
| `isLoaded`  | `boolean`                | 광고가 로드되었는지 여부               |
| `isShowing` | `boolean`                | 광고 표시 중 여부                      |
| `error`     | `AdLoadError \| null`    | 광고 로드/표시 에러                    |
| `loadAd`    | `() => void`             | 광고 로드 함수                         |
| `showAd`    | `() => Promise<boolean>` | 광고 표시 함수 (리워드 획득 여부 반환) |

#### 사용 예시

```tsx
const { isLoaded, isLoading, isShowing, error, loadAd, showAd } = useRewardedAd();

// 광고 로드
useEffect(() => {
  loadAd();
}, []);

// 광고 표시
const handleShow = async () => {
  const rewarded = await showAd();
  if (rewarded) {
    // 리워드 처리
  }
};
```

---

### `useAdSessionStore`

세션별 잠금 해제 상태 관리 (Zustand)

#### 상태

| 속성                | 타입      | 설명                          |
| ------------------- | --------- | ----------------------------- |
| `shareUnlocked`     | `boolean` | 공유 기능 잠금 해제 여부      |
| `analyticsUnlocked` | `boolean` | 상세 분석 기능 잠금 해제 여부 |

#### 액션

| 메서드            | 타입         | 설명                     |
| ----------------- | ------------ | ------------------------ |
| `unlockShare`     | `() => void` | 공유 기능 잠금 해제      |
| `unlockAnalytics` | `() => void` | 상세 분석 기능 잠금 해제 |
| `resetAll`        | `() => void` | 모든 잠금 초기화         |

#### 사용 예시

```tsx
const shareUnlocked = useAdSessionStore((state) => state.shareUnlocked);
const unlockShare = useAdSessionStore((state) => state.unlockShare);

if (!shareUnlocked) {
  return <AdGate onUnlock={unlockShare} />;
}

return <ShareFeature />;
```

---

## 타입 정의

### `AdLoadError`

```typescript
interface AdLoadError {
  code: number;
  message: string;
}
```

### `RewardedAdHookResult`

```typescript
interface RewardedAdHookResult {
  isLoading: boolean;
  isLoaded: boolean;
  isShowing: boolean;
  error: AdLoadError | null;
  loadAd: () => void;
  showAd: () => Promise<boolean>;
}
```

### `AdSessionState`

```typescript
interface AdSessionState {
  shareUnlocked: boolean;
  analyticsUnlocked: boolean;
  unlockShare: () => void;
  unlockAnalytics: () => void;
  resetAll: () => void;
}
```

---

## 주의사항

### 1. 광고 로드 타이밍

- `loadAd()`는 화면 진입 시 또는 이전 광고 시청 후 즉시 호출하세요
- 광고 로드에는 시간이 걸리므로 미리 로드해두는 것이 좋습니다

### 2. 에러 처리

- `error` 상태를 확인하여 사용자에게 적절한 피드백을 제공하세요
- 광고 로드 실패 시 재시도 버튼을 제공하세요

### 3. 세션 관리

- `useAdSessionStore`는 앱 재시작 시 자동으로 초기화됩니다 (persist 없음)
- 앱 종료 후 재시작하면 다시 광고를 시청해야 합니다

### 4. 테스트

- 개발 중에는 테스트 광고 단위 ID가 자동으로 사용됩니다
- 실제 광고는 프로덕션 빌드에서만 표시됩니다

---

## 설정

광고 단위 ID는 `app.json`의 `extra.admob`에 설정되어 있습니다:

```json
{
  "extra": {
    "admob": {
      "iosRewardedAdUnitId": "ca-app-pub-3940256099942544/1712485313",
      "androidRewardedAdUnitId": "ca-app-pub-3940256099942544/5224354917"
    }
  }
}
```

현재는 테스트 광고 단위 ID가 설정되어 있습니다.

---

## Frontend 체크리스트

- [ ] `useRewardedAd` 훅 사용
- [ ] 화면 진입 시 `loadAd()` 호출
- [ ] `isLoaded` 상태로 버튼 활성화/비활성화
- [ ] `isLoading` 상태로 로딩 UI 표시
- [ ] `error` 상태로 에러 메시지 표시
- [ ] `showAd()` 반환값으로 리워드 처리
- [ ] 세션 스토어로 잠금 해제 상태 관리
- [ ] 사용자 경험 고려 (로딩 상태, 에러 메시지 등)
