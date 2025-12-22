import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
  ScrollView,
  View,
  Pressable,
  Text,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { ThemedView } from '@/components/ThemedView';
import { useTheme, useI18n } from '@/hooks';
import {
  WrappedWeekly,
  WrappedMonthly,
  MinimalWeekly,
  MinimalMonthly,
  GlassmorphismWeekly,
  GlassmorphismMonthly,
  BrutalistWeekly,
  BrutalistMonthly,
  TicketWeekly,
  TicketMonthly,
} from '@/features/share/components';
import { useImageCapture, useShareImage, useTemplateData } from '@/features/share/hooks';
import type { TemplateStyle, TemplatePeriod } from '@/features/share/types/share.types';
import { useRewardedAd, useAdSessionStore } from '@/features/ads';

/**
 * Share screen for habit statistics
 * Allows preview and selection of template styles and periods for sharing
 */
export default function ShareScreen() {
  const navigation = useNavigation();
  const colorScheme = useTheme();
  const { t, language } = useI18n();

  const [selectedStyle, setSelectedStyle] = useState<TemplateStyle>('minimal');
  const [selectedPeriod, setSelectedPeriod] = useState<TemplatePeriod>('weekly');

  const { viewRef, capture } = useImageCapture();
  const { isLoading, execute } = useShareImage();
  const { weeklyStats, monthlyStats } = useTemplateData(language);

  // AdMob rewarded ad integration
  const {
    isLoading: adLoading,
    isLoaded: adLoaded,
    error: adError,
    loadAd,
    showAd,
  } = useRewardedAd();
  const { shareUnlocked, unlockShare } = useAdSessionStore();

  // Load ad on mount
  useEffect(() => {
    // DEV 모드 우회 비활성화 (광고 테스트를 위해)
    // if (!__DEV__ && !shareUnlocked) {
    if (!shareUnlocked) {
      loadAd();
    }
  }, [loadAd, shareUnlocked]);

  // Handle watch ad action
  const handleWatchAd = async () => {
    if (!adLoaded) {
      Alert.alert(
        t('share:screen.adNotReady'),
        adLoading ? t('share:screen.adLoading') : t('share:screen.adLoadFailed')
      );
      return;
    }

    const rewarded = await showAd();
    if (rewarded) {
      unlockShare();
      Alert.alert(t('share:screen.unlocked'), t('share:screen.premiumTemplatesUnlocked'));
      // Reload ad for next time
      loadAd();
    }
  };

  // Set up native header with share button
  useLayoutEffect(() => {
    // DEV 모드 우회 비활성화 (광고 테스트를 위해)
    // const isLocked = !__DEV__ && selectedStyle !== 'minimal' && !shareUnlocked;
    const isLocked = selectedStyle !== 'minimal' && !shareUnlocked;
    const isDisabled = isLoading || isLocked;

    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={async () => {
            if (isLocked) {
              Alert.alert(t('share:screen.premiumTemplate'), t('share:screen.watchAdToUnlock'));
              return;
            }
            try {
              const uri = await capture({ format: 'png', quality: 1 });
              await execute(uri, 'share');
            } catch {
              Alert.alert(t('common:error'), t('share:screen.shareFailed'));
            }
          }}
          disabled={isDisabled}
          style={{ paddingRight: 8 }}>
          <MaterialCommunityIcons
            name={Platform.OS === 'ios' ? 'export-variant' : 'share-variant'}
            size={28}
            color={isDisabled ? '#9CA3AF' : colorScheme === 'dark' ? '#60A5FA' : '#3B82F6'}
          />
        </Pressable>
      ),
    });
  }, [navigation, isLoading, selectedStyle, shareUnlocked, capture, execute, colorScheme, t]);

  const renderTemplate = () => {
    // Wrapped style
    if (selectedStyle === 'wrapped') {
      return selectedPeriod === 'weekly' ? (
        <WrappedWeekly stats={weeklyStats} />
      ) : (
        <WrappedMonthly stats={monthlyStats} />
      );
    }

    // Minimal style
    if (selectedStyle === 'minimal') {
      return selectedPeriod === 'weekly' ? (
        <MinimalWeekly stats={weeklyStats} />
      ) : (
        <MinimalMonthly stats={monthlyStats} />
      );
    }

    // Glassmorphism style
    if (selectedStyle === 'glassmorphism') {
      return selectedPeriod === 'weekly' ? (
        <GlassmorphismWeekly stats={weeklyStats} />
      ) : (
        <GlassmorphismMonthly stats={monthlyStats} />
      );
    }

    // Brutalist style
    if (selectedStyle === 'brutalist') {
      return selectedPeriod === 'weekly' ? (
        <BrutalistWeekly stats={weeklyStats} />
      ) : (
        <BrutalistMonthly stats={monthlyStats} />
      );
    }

    // Ticket style
    if (selectedStyle === 'ticket') {
      return selectedPeriod === 'weekly' ? (
        <TicketWeekly stats={weeklyStats} />
      ) : (
        <TicketMonthly stats={monthlyStats} />
      );
    }

    // Default to Wrapped
    return selectedPeriod === 'weekly' ? (
      <WrappedWeekly stats={weeklyStats} />
    ) : (
      <WrappedMonthly stats={monthlyStats} />
    );
  };

  return (
    <ThemedView className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* Selectors */}
      <View className="bg-gray-100 px-4 py-4 dark:bg-gray-900">
        {/* Style selector */}
        <View className="mb-4">
          <Text className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
            {t('share:screen.styleSelect')}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 pr-4"
            className="-mx-4 px-4">
            <Pressable
              onPress={() => setSelectedStyle('minimal')}
              className={`rounded-xl px-4 py-2.5 ${
                selectedStyle === 'minimal'
                  ? 'bg-gray-900 dark:bg-white'
                  : 'border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
              }`}
              style={
                selectedStyle === 'minimal'
                  ? {
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.2,
                      shadowRadius: 8,
                    }
                  : undefined
              }>
              <Text
                className={`text-center text-sm font-bold ${
                  selectedStyle === 'minimal'
                    ? 'text-white dark:text-gray-900'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                ⚪ Minimal
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedStyle('wrapped')}
              className={`rounded-xl px-4 py-2.5 ${
                selectedStyle === 'wrapped'
                  ? 'bg-purple-500'
                  : 'border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
              }`}
              style={
                selectedStyle === 'wrapped'
                  ? {
                      shadowColor: '#a855f7',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                    }
                  : undefined
              }>
              <Text
                className={`text-center text-sm font-bold ${
                  selectedStyle === 'wrapped' ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                }`}>
                ✨ Wrapped
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedStyle('glassmorphism')}
              className={`rounded-xl px-4 py-2.5 ${
                selectedStyle === 'glassmorphism'
                  ? 'bg-blue-400'
                  : 'border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
              }`}
              style={
                selectedStyle === 'glassmorphism'
                  ? {
                      shadowColor: '#60a5fa',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                    }
                  : undefined
              }>
              <Text
                className={`text-center text-sm font-bold ${
                  selectedStyle === 'glassmorphism'
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                💎 Glass
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedStyle('brutalist')}
              className={`rounded-xl px-4 py-2.5 ${
                selectedStyle === 'brutalist'
                  ? 'border-2 border-black bg-yellow-400 dark:border-white dark:bg-yellow-300'
                  : 'border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
              }`}
              style={
                selectedStyle === 'brutalist'
                  ? {
                      shadowColor: '#000',
                      shadowOffset: { width: 4, height: 4 },
                      shadowOpacity: 0.25,
                      shadowRadius: 0,
                    }
                  : undefined
              }>
              <Text
                className={`text-center text-sm font-black ${
                  selectedStyle === 'brutalist' ? 'text-black' : 'text-gray-700 dark:text-gray-300'
                }`}>
                ⚡ Brutalist
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedStyle('ticket')}
              className={`rounded-xl px-4 py-2.5 ${
                selectedStyle === 'ticket'
                  ? 'bg-blue-500'
                  : 'border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
              }`}
              style={
                selectedStyle === 'ticket'
                  ? {
                      shadowColor: '#3b82f6',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                    }
                  : undefined
              }>
              <Text
                className={`text-center text-sm font-bold ${
                  selectedStyle === 'ticket' ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                }`}>
                🎫 Ticket
              </Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* Period selector */}
        <View>
          <Text className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
            {t('share:screen.periodSelect')}
          </Text>
          <View className="flex-row gap-2 rounded-lg bg-gray-200 p-1 dark:bg-gray-800">
            <Pressable
              onPress={() => setSelectedPeriod('weekly')}
              className={`flex-1 rounded-md px-4 py-2.5 ${
                selectedPeriod === 'weekly' ? 'bg-white dark:bg-gray-700' : ''
              }`}
              style={
                selectedPeriod === 'weekly'
                  ? {
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2,
                    }
                  : undefined
              }>
              <Text
                className={`text-center text-sm font-medium ${
                  selectedPeriod === 'weekly'
                    ? 'text-blue-500 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                {t('share:screen.weekly')}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedPeriod('monthly')}
              className={`flex-1 rounded-md px-4 py-2.5 ${
                selectedPeriod === 'monthly' ? 'bg-white dark:bg-gray-700' : ''
              }`}
              style={
                selectedPeriod === 'monthly'
                  ? {
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2,
                    }
                  : undefined
              }>
              <Text
                className={`text-center text-sm font-medium ${
                  selectedPeriod === 'monthly'
                    ? 'text-blue-500 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                {t('share:screen.monthly')}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Template preview */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 32,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}>
        <View ref={viewRef} collapsable={false}>
          {renderTemplate()}
        </View>

        {/* Lock overlay for premium templates */}
        {/* DEV 모드 우회 비활성화 (광고 테스트를 위해) */}
        {/* {!__DEV__ && selectedStyle !== 'minimal' && !shareUnlocked && ( */}
        {selectedStyle !== 'minimal' && !shareUnlocked && (
          <BlurView
            intensity={80}
            tint="dark"
            className="absolute inset-0 items-center justify-center">
            <View className="items-center rounded-2xl bg-black/50 px-8 py-6">
              <MaterialCommunityIcons name="lock" size={48} color="#FFFFFF" />
              <Text className="mt-3 text-center text-base font-bold text-white">
                {t('share:screen.premiumTemplate')}
              </Text>
              <Text className="mt-1 text-center text-sm text-white/80">
                {t('share:screen.watchAdToUnlock')}
              </Text>

              {/* Watch Ad Button */}
              <Pressable
                onPress={handleWatchAd}
                disabled={adLoading || !adLoaded}
                className="mt-4 rounded-xl bg-white px-6 py-3"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                }}>
                {adLoading ? (
                  <View className="flex-row items-center gap-2">
                    <ActivityIndicator size="small" color="#3B82F6" />
                    <Text className="text-sm font-semibold text-gray-900">
                      {t('share:screen.loadingAd')}
                    </Text>
                  </View>
                ) : adError ? (
                  <Text className="text-sm font-semibold text-red-600">
                    {t('share:screen.adError')}
                  </Text>
                ) : (
                  <Text className="text-sm font-semibold text-blue-600">
                    {t('share:screen.watchAdButton')}
                  </Text>
                )}
              </Pressable>
            </View>
          </BlurView>
        )}
      </ScrollView>
    </ThemedView>
  );
}
