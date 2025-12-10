import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, View } from 'react-native';
import { addMonths, subMonths, format } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { DateGrid } from './DateGrid';

interface CalendarModalProps {
  visible: boolean;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onClose: () => void;
}

/**
 * CalendarModal component
 * Bottom sheet style modal with month navigation and date grid
 */
export function CalendarModal({
  visible,
  selectedDate,
  onSelectDate,
  onClose,
}: CalendarModalProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const insets = useSafeAreaInsets();

  // Animate slide when modal opens/closes
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      slideAnim.setValue(300);
    }
  }, [visible, slideAnim]);

  const handlePrevMonth = () => {
    setCurrentDate((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1));
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    onSelectDate(today);
  };

  const handleSelectDate = (date: Date) => {
    onSelectDate(date);
    onClose();
  };

  const monthYearText = format(currentDate, 'MMMM yyyy');

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 justify-end bg-black/50">
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Animated.View
            style={{ transform: [{ translateY: slideAnim }], paddingBottom: insets.bottom }}
            className="rounded-t-2xl bg-white p-4 dark:bg-gray-800">
            {/* Header */}
            <View className="mb-4 flex-row items-center justify-between">
              <Pressable
                onPress={handlePrevMonth}
                className="h-10 w-10 items-center justify-center rounded-lg bg-gray-100 active:bg-gray-200 dark:bg-gray-700 dark:active:bg-gray-600">
                <MaterialCommunityIcons name="chevron-left" size={24} color="#6B7280" />
              </Pressable>

              <ThemedText className="text-lg font-semibold">{monthYearText}</ThemedText>

              <Pressable
                onPress={handleNextMonth}
                className="h-10 w-10 items-center justify-center rounded-lg bg-gray-100 active:bg-gray-200 dark:bg-gray-700 dark:active:bg-gray-600">
                <MaterialCommunityIcons name="chevron-right" size={24} color="#6B7280" />
              </Pressable>
            </View>

            {/* Date Grid */}
            <DateGrid
              currentDate={currentDate}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
            />

            {/* Actions */}
            <View className="mt-4 flex-row gap-3">
              <Pressable
                onPress={handleGoToToday}
                className="flex-1 rounded-lg bg-gray-100 px-4 py-3 active:bg-gray-200 dark:bg-gray-700 dark:active:bg-gray-600">
                <ThemedText className="text-center font-semibold text-gray-900 dark:text-white">
                  오늘로 이동
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={onClose}
                className="flex-1 rounded-lg bg-blue-500 px-4 py-3 active:bg-blue-600">
                <ThemedText className="text-center font-semibold text-white">닫기</ThemedText>
              </Pressable>
            </View>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
