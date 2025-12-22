import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  FlatList,
  useWindowDimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme, useI18n } from '@/hooks';
import { WeekdayAnalysisCard } from '../components/WeekdayAnalysisCard';
import { StreakTrendCard } from '../components/StreakTrendCard';
import { TimePatternCard } from '../components/TimePatternCard';
import { HabitDetailCard } from '../components/HabitDetailCard';
import { MotivationInsightCard } from '../components/MotivationInsightCard';
import { useRewardedAd, useAdSessionStore } from '@/features/ads';

/**
 * Detailed analytics screen (Premium feature)
 * Shows advanced insights after watching rewarded ad
 */
export function DetailedAnalyticsScreen() {
  const colorScheme = useTheme();
  const { t } = useI18n();
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);

  // AdMob rewarded ad integration
  const {
    isLoading: adLoading,
    isLoaded: adLoaded,
    error: adError,
    loadAd,
    showAd,
  } = useRewardedAd();
  const { analyticsUnlocked, unlockAnalytics } = useAdSessionStore();

  // Load ad on mount
  useEffect(() => {
    // DEV 모드 우회 비활성화 (광고 테스트를 위해)
    // if (!__DEV__ && !analyticsUnlocked) {
    if (!analyticsUnlocked) {
      loadAd();
    }
  }, [loadAd, analyticsUnlocked]);

  // Handle watch ad action
  const handleWatchAd = async () => {
    if (!adLoaded) {
      Alert.alert(
        t('screens:stats.adNotReady'),
        adLoading ? t('screens:stats.adLoading') : t('screens:stats.adLoadFailed')
      );
      return;
    }

    const rewarded = await showAd();
    if (rewarded) {
      unlockAnalytics();
      Alert.alert(t('screens:stats.unlocked'), t('screens:stats.analyticsUnlocked'));
      // Reload ad for next time
      loadAd();
    }
  };

  // Analytics cards data
  const analyticsCards = [
    { id: '1', component: <WeekdayAnalysisCard /> },
    { id: '2', component: <StreakTrendCard /> },
    { id: '3', component: <TimePatternCard /> },
    { id: '4', component: <HabitDetailCard /> },
    { id: '5', component: <MotivationInsightCard /> },
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* Show unlocked analytics after watching ad */}
      {/* DEV 모드 우회 비활성화 (광고 테스트를 위해) */}
      {/* {__DEV__ || analyticsUnlocked ? ( */}
      {analyticsUnlocked ? (
        <>
          {/* Carousel */}
          <FlatList
            data={analyticsCards}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ScrollView
                style={{ width }}
                contentContainerStyle={{ padding: 8 }}
                showsVerticalScrollIndicator={false}
                className="bg-gray-100 dark:bg-gray-900">
                {item.component}
              </ScrollView>
            )}
          />

          {/* Page Indicator */}
          <View className="flex-row items-center justify-center gap-2 pb-6">
            {analyticsCards.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full ${
                  index === currentIndex ? 'w-6 bg-blue-500' : 'w-2 bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </View>
        </>
      ) : (
        /* Production mode: Show lock screen */
        <ScrollView className="flex-1 bg-gray-100 dark:bg-gray-900" contentContainerClassName="p-4">
          <View className="flex-1 items-center justify-center px-8 py-20">
            <View className="items-center rounded-3xl bg-white p-8 dark:bg-gray-800">
              <MaterialCommunityIcons
                name="lock-outline"
                size={64}
                color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
              />
              <Text className="mt-4 text-center text-xl font-bold text-gray-900 dark:text-white">
                {t('screens:stats.unlockDetailedAnalytics')}
              </Text>
              <Text className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                {t('screens:stats.detailedAnalyticsDescription')}
              </Text>

              {/* Features List */}
              <View className="mt-6 w-full space-y-3">
                {[
                  { icon: 'clock-outline', text: t('screens:stats.timePattern') },
                  { icon: 'chart-line', text: t('screens:stats.streakTrend') },
                  { icon: 'calendar-week', text: t('screens:stats.weekdayAnalysis') },
                  { icon: 'format-list-bulleted', text: t('screens:stats.habitDetails') },
                  { icon: 'lightbulb-outline', text: t('screens:stats.aiInsights') },
                ].map((item, index) => (
                  <View key={index} className="flex-row items-center gap-3">
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={20}
                      color={colorScheme === 'dark' ? '#60A5FA' : '#3B82F6'}
                    />
                    <Text className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                      {item.text}
                    </Text>
                  </View>
                ))}
              </View>

              {/* CTA Button */}
              <Pressable
                onPress={handleWatchAd}
                disabled={adLoading || !adLoaded}
                className="mt-8 w-full rounded-2xl bg-blue-500 px-6 py-4 disabled:bg-gray-400"
                style={{
                  shadowColor: '#3B82F6',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                }}>
                {adLoading ? (
                  <View className="flex-row items-center justify-center gap-2">
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text className="text-center text-base font-bold text-white">
                      {t('screens:stats.loadingAd')}
                    </Text>
                  </View>
                ) : adError ? (
                  <>
                    <Text className="text-center text-base font-bold text-white">
                      {t('screens:stats.adError')}
                    </Text>
                    <Text className="mt-1 text-center text-xs text-white/80">
                      {t('screens:stats.tryAgainLater')}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text className="text-center text-base font-bold text-white">
                      {t('screens:stats.watchAdToUnlock')}
                    </Text>
                    <Text className="mt-1 text-center text-xs text-white/80">
                      {t('screens:stats.freeForSession')}
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
