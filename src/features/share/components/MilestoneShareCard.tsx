import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { MilestoneShareCardProps, BadgeStyle } from '../types/share.types';

/**
 * Milestone achievement badge share card component
 * Displays achievement badge with gradient background
 */
export function MilestoneShareCard({
  habitName,
  icon,
  milestone,
  startDate,
  endDate,
}: MilestoneShareCardProps) {
  /**
   * Get badge style based on milestone days
   * @param days - Milestone days
   * @returns Badge style configuration
   */
  const getBadgeStyle = (days: number): BadgeStyle => {
    if (days >= 365) return { colors: ['#F59E0B', '#D97706'], emoji: '👑', title: '전설' };
    if (days >= 100) return { colors: ['#8B5CF6', '#7C3AED'], emoji: '💎', title: '다이아' };
    if (days >= 50) return { colors: ['#3B82F6', '#2563EB'], emoji: '⭐', title: '플래티넘' };
    if (days >= 30) return { colors: ['#10B981', '#059669'], emoji: '🏆', title: '골드' };
    if (days >= 14) return { colors: ['#6B7280', '#4B5563'], emoji: '🥈', title: '실버' };
    return { colors: ['#CD7F32', '#B87333'], emoji: '🥉', title: '브론즈' };
  };

  const badge = getBadgeStyle(milestone);

  /**
   * Get motivational message based on milestone
   * @param days - Milestone days
   * @returns Motivational message
   */
  const getMotivationalMessage = (days: number): string => {
    if (days >= 100) return '정말 대단해요! 계속해서 멋진 습관을 이어가세요! 🎉';
    if (days >= 30) return '한 달 이상 꾸준히 하다니, 정말 멋져요! 💪';
    return '좋은 시작이에요! 계속 화이팅! 🔥';
  };

  return (
    <View className="w-[350px] overflow-hidden rounded-3xl bg-white shadow-2xl">
      {/* Gradient background */}
      <LinearGradient
        colors={badge.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="items-center px-6 py-12">
        {/* Badge emoji */}
        <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-white/20">
          <Text className="text-6xl">{badge.emoji}</Text>
        </View>

        {/* Title */}
        <Text className="mb-2 text-2xl font-bold text-white">{milestone}일 연속 달성!</Text>

        <View className="mb-6 rounded-full bg-white/20 px-4 py-1">
          <Text className="text-sm font-semibold text-white">{badge.title} 등급</Text>
        </View>

        {/* Habit info */}
        <View className="mb-4 flex-row items-center">
          <MaterialCommunityIcons name={icon as any} size={28} color="white" />
          <Text className="ml-2 text-xl font-bold text-white">{habitName}</Text>
        </View>

        {/* Date range */}
        <Text className="text-sm text-white/80">
          {startDate} ~ {endDate}
        </Text>
      </LinearGradient>

      {/* Bottom section */}
      <View className="items-center px-6 py-6">
        {/* Motivational text */}
        <Text className="mb-4 text-center text-base text-gray-600">
          {getMotivationalMessage(milestone)}
        </Text>

        {/* Hashtags */}
        <Text className="mb-4 text-sm text-blue-500">
          #Routimeter #{milestone}일챌린지 #습관만들기
        </Text>

        {/* Watermark */}
        <View className="flex-row items-center">
          <Text className="text-xs text-gray-400">Made with </Text>
          <Text className="text-xs font-bold" style={{ color: badge.colors[0] }}>
            Routimeter
          </Text>
        </View>
      </View>
    </View>
  );
}
