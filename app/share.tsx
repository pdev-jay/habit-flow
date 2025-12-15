import React, { useState, useLayoutEffect } from 'react';
import { ScrollView, View, Pressable, Text, Alert, Platform } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks';
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

/**
 * Share screen for habit statistics
 * Allows preview and selection of template styles and periods for sharing
 */
export default function ShareScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const colorScheme = useTheme();

  const [selectedStyle, setSelectedStyle] = useState<TemplateStyle>('minimal');
  const [selectedPeriod, setSelectedPeriod] = useState<TemplatePeriod>('weekly');

  const { viewRef, capture } = useImageCapture();
  const { isLoading, execute } = useShareImage();
  const { weeklyStats, monthlyStats } = useTemplateData();

  // Set up native header with share button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={async () => {
            try {
              const uri = await capture({ format: 'png', quality: 1 });
              await execute(uri, 'share');
            } catch (error) {
              Alert.alert('오류', '공유에 실패했습니다');
            }
          }}
          disabled={isLoading}
          style={{ paddingRight: 8 }}>
          <MaterialCommunityIcons
            name={Platform.OS === 'ios' ? 'export-variant' : 'share-variant'}
            size={28}
            color={isLoading ? '#9CA3AF' : colorScheme === 'dark' ? '#60A5FA' : '#3B82F6'}
          />
        </Pressable>
      ),
    });
  }, [navigation, isLoading, capture, execute, colorScheme]);

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
    <ThemedView className="flex-1">
      {/* Selectors */}
      <View className="border-b border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900">
        {/* Style selector */}
        <View className="mb-4">
          <Text className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
            스타일 선택
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 pr-4"
            className="-mx-4 px-4">
            <Pressable
              onPress={() => setSelectedStyle('minimal')}
              className={`rounded-xl px-4 py-2.5 ${selectedStyle === 'minimal'
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
                className={`text-center text-sm font-bold ${selectedStyle === 'minimal'
                  ? 'text-white dark:text-gray-900'
                  : 'text-gray-700 dark:text-gray-300'
                  }`}>
                ⚪ Minimal
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedStyle('wrapped')}
              className={`rounded-xl px-4 py-2.5 ${selectedStyle === 'wrapped'
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
                className={`text-center text-sm font-bold ${selectedStyle === 'wrapped' ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                ✨ Wrapped
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedStyle('glassmorphism')}
              className={`rounded-xl px-4 py-2.5 ${selectedStyle === 'glassmorphism'
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
                className={`text-center text-sm font-bold ${selectedStyle === 'glassmorphism'
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300'
                  }`}>
                💎 Glass
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedStyle('brutalist')}
              className={`rounded-xl px-4 py-2.5 ${selectedStyle === 'brutalist'
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
                className={`text-center text-sm font-black ${selectedStyle === 'brutalist' ? 'text-black' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                ⚡ Brutalist
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedStyle('ticket')}
              className={`rounded-xl px-4 py-2.5 ${selectedStyle === 'ticket'
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
                className={`text-center text-sm font-bold ${selectedStyle === 'ticket' ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                🎫 Ticket
              </Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* Period selector */}
        <View>
          <Text className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
            기간 선택
          </Text>
          <View className="flex-row rounded-2xl bg-gray-100 p-1 dark:bg-gray-800">
            <Pressable
              onPress={() => setSelectedPeriod('weekly')}
              className={`flex-1 rounded-xl px-4 py-2.5 ${selectedPeriod === 'weekly' ? 'bg-white dark:bg-gray-700' : 'bg-transparent'
                }`}>
              <Text
                className={`text-center text-sm font-semibold ${selectedPeriod === 'weekly'
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
                  }`}>
                주간
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedPeriod('monthly')}
              className={`flex-1 rounded-xl px-4 py-2.5 ${selectedPeriod === 'monthly' ? 'bg-white dark:bg-gray-700' : 'bg-transparent'
                }`}>
              <Text
                className={`text-center text-sm font-semibold ${selectedPeriod === 'monthly'
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
                  }`}>
                월간
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Template preview */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="items-center px-4 py-8"
        showsVerticalScrollIndicator={false}>
        <View ref={viewRef} collapsable={false}>
          {renderTemplate()}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
