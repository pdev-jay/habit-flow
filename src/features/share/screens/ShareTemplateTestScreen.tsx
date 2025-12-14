import React, { useState } from 'react';
import { ScrollView, View, Pressable, Text, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import {
  WeeklyShareCard,
  MonthlyHeatmapShare,
  MilestoneShareCard,
} from '../components';
import { useImageCapture, useShareImage } from '../hooks';
import type { HeatmapDay } from '../types/share.types';

/**
 * Test screen for share image templates
 * Allows preview and testing of all three share card templates
 */
export function ShareTemplateTestScreen() {
  const insets = useSafeAreaInsets();
  const [selectedTemplate, setSelectedTemplate] = useState<'weekly' | 'monthly' | 'milestone'>(
    'weekly'
  );

  const { viewRef, capture } = useImageCapture();
  const { isLoading, execute } = useShareImage();

  // Mock data for templates
  const weeklyData = {
    completionRate: 85,
    completedCount: 17,
    totalCount: 20,
    streakDays: 5,
    dateRange: '12월 8일 ~ 12월 14일',
  };

  const monthlyData = {
    month: '2024년 12월',
    days: Array.from({ length: 35 }, (_, i): HeatmapDay => ({
      date: `2024-12-${String(i + 1).padStart(2, '0')}`,
      completionRate: Math.random() * 100,
    })),
    totalHabits: 12,
    perfectDays: 8,
  };

  const milestoneData = {
    habitName: '물 마시기',
    icon: 'water',
    milestone: 100,
    startDate: '2024.09.06',
    endDate: '2024.12.14',
  };

  const handleShare = async (action: 'save' | 'share') => {
    try {
      const uri = await capture({ format: 'png', quality: 1 });
      const result = await execute(uri, action);

      if (!result.success) {
        Alert.alert('오류', result.error || '작업에 실패했습니다');
      }
    } catch (error) {
      Alert.alert('오류', '이미지 캡처에 실패했습니다');
    }
  };

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View
        className="border-b border-gray-200 bg-white px-4 pb-4 dark:border-gray-800 dark:bg-gray-900"
        style={{ paddingTop: insets.top }}>
        <ThemedText className="pb-4 text-3xl font-bold">템플릿 테스트</ThemedText>

        {/* Template selector */}
        <View className="flex-row space-x-2">
          <Pressable
            onPress={() => setSelectedTemplate('weekly')}
            className={`flex-1 rounded-lg px-4 py-2 ${
              selectedTemplate === 'weekly' ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
            }`}>
            <Text
              className={`text-center font-semibold ${
                selectedTemplate === 'weekly' ? 'text-white' : 'text-gray-700 dark:text-gray-300'
              }`}>
              주간
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedTemplate('monthly')}
            className={`flex-1 rounded-lg px-4 py-2 ${
              selectedTemplate === 'monthly' ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
            }`}>
            <Text
              className={`text-center font-semibold ${
                selectedTemplate === 'monthly' ? 'text-white' : 'text-gray-700 dark:text-gray-300'
              }`}>
              월간
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedTemplate('milestone')}
            className={`flex-1 rounded-lg px-4 py-2 ${
              selectedTemplate === 'milestone' ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
            }`}>
            <Text
              className={`text-center font-semibold ${
                selectedTemplate === 'milestone' ? 'text-white' : 'text-gray-700 dark:text-gray-300'
              }`}>
              마일스톤
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Template preview */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="items-center px-4 py-8"
        showsVerticalScrollIndicator={false}>
        <View ref={viewRef} collapsable={false}>
          {selectedTemplate === 'weekly' && <WeeklyShareCard {...weeklyData} />}
          {selectedTemplate === 'monthly' && <MonthlyHeatmapShare {...monthlyData} />}
          {selectedTemplate === 'milestone' && <MilestoneShareCard {...milestoneData} />}
        </View>

        {/* Action buttons */}
        <View className="mt-8 w-full max-w-[350px] space-y-3">
          <Pressable
            onPress={() => handleShare('save')}
            disabled={isLoading}
            className={`h-12 items-center justify-center rounded-lg bg-green-500 active:bg-green-600 ${
              isLoading ? 'opacity-50' : ''
            }`}>
            <Text className="font-semibold text-white">
              {isLoading ? '처리 중...' : '갤러리에 저장'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleShare('share')}
            disabled={isLoading}
            className={`h-12 items-center justify-center rounded-lg bg-blue-500 active:bg-blue-600 ${
              isLoading ? 'opacity-50' : ''
            }`}>
            <Text className="font-semibold text-white">
              {isLoading ? '처리 중...' : '공유하기'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
