import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { useTheme, useI18n } from '@/hooks';
import { cn } from '@/lib/utils';
import { HabitIconName } from '@/features/habits/types';

// Frequently used icons (displayed by default)
const FREQUENT_ICONS: HabitIconName[] = [
  'water',
  'run',
  'walk',
  'bike',
  'swim',
  'dumbbell',
  'weight-lifter',
  'yoga',
  'meditation',
];

// All available icons
const ICONS: HabitIconName[] = [
  // Health & Fitness (건강 & 운동)
  'water',
  'run',
  'walk',
  'bike',
  'swim',
  'dumbbell',
  'weight-lifter',
  'yoga',
  'meditation',
  'basketball',
  'tennis',
  'soccer',
  // Food & Nutrition (음식 & 영양)
  'food-apple',
  'food-variant',
  'coffee',
  'fruit-cherries',
  'carrot',
  'leaf',
  // Sleep & Rest (수면 & 휴식)
  'bed',
  'sleep',
  'power-sleep',
  // Health Care (건강 관리)
  'pill',
  'medical-bag',
  'heart-outline',
  'heart-pulse',
  'thermometer',
  // Learning & Reading (학습 & 독서)
  'book-open-variant',
  'book-open-page-variant',
  'brain',
  'school',
  'pencil',
  'notebook',
  'translate',
  // Creative & Hobbies (창작 & 취미)
  'guitar-acoustic',
  'palette',
  'brush',
  'music',
  'camera',
  'draw',
  'microphone',
  // Productivity (생산성)
  'clipboard-check',
  'calendar-check',
  'clock-outline',
  'timer-outline',
  'alarm',
  'laptop',
  // Social & Communication (소셜 & 커뮤니케이션)
  'account-group',
  'phone',
  'email',
  'chat',
  'video',
  // Mindfulness & Spiritual (명상 & 정신)
  'candle',
  'flower',
  'weather-sunny',
  'moon-waning-crescent',
  'star',
  // Cleaning & Household (청소 & 가사)
  'broom',
  'vacuum',
  'washing-machine',
  'hanger',
  // Finance (재무)
  'cash',
  'piggy-bank',
  'chart-line',
  // Nature & Environment (자연 & 환경)
  'tree',
  'sprout',
  'flower-tulip',
  'recycle',
  // Miscellaneous (기타)
  'trophy',
  'flag',
  'fire',
  'diamond',
  'lightbulb',
  'check',
  'target',
];

interface IconPickerProps {
  selectedIcon: HabitIconName;
  selectedColor: string;
  onSelect: (icon: HabitIconName) => void;
}

/**
 * Icon picker component
 */
export function IconPicker({ selectedIcon, selectedColor, onSelect }: IconPickerProps) {
  const colorScheme = useTheme();
  const { t } = useI18n();
  const [showAllIcons, setShowAllIcons] = useState(false);

  // If selected icon is not in frequent icons, show it first
  const displayIcons = React.useMemo(() => {
    if (FREQUENT_ICONS.includes(selectedIcon)) {
      return FREQUENT_ICONS;
    }
    // Show selected icon first, then remaining frequent icons (except last one to make room)
    return [selectedIcon, ...FREQUENT_ICONS.slice(0, -1)];
  }, [selectedIcon]);

  const renderIconButton = (icon: HabitIconName, size: number = 32) => {
    const isSelected = selectedIcon === icon;
    return (
      <Pressable
        key={icon}
        onPress={() => {
          onSelect(icon);
          setShowAllIcons(false);
        }}
        className={cn(
          'mb-3 h-16 items-center justify-center rounded-2xl',
          !isSelected && 'bg-gray-100 dark:bg-gray-700'
        )}
        style={[
          styles.iconButton,
          {
            width: '18%',
            backgroundColor: isSelected ? selectedColor + '20' : undefined,
          },
        ]}>
        <MaterialCommunityIcons
          name={icon}
          size={size}
          color={isSelected ? selectedColor : colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
        />
      </Pressable>
    );
  };

  const renderMoreButton = () => (
    <Pressable
      key="more-button"
      onPress={() => setShowAllIcons(true)}
      className="mb-3 h-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-700"
      style={[styles.iconButton, { width: '18%' }]}>
      <MaterialCommunityIcons
        name="dots-horizontal"
        size={32}
        color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
      />
    </Pressable>
  );

  // Calculate placeholders for display icons row
  const iconsPerRow = 5;
  const frequentWithButton = displayIcons.length + 1; // +1 for "..." button
  const remainder = frequentWithButton % iconsPerRow;
  const placeholdersNeeded = remainder === 0 ? 0 : iconsPerRow - remainder;

  // Calculate placeholders for all icons modal
  const allIconsRemainder = ICONS.length % iconsPerRow;
  const allIconsPlaceholders = allIconsRemainder === 0 ? 0 : iconsPerRow - allIconsRemainder;

  return (
    <View>
      <ThemedText className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
        {t('components:iconPicker.title')}
      </ThemedText>

      {/* Display Icons (frequent or with selected) with More Button */}
      <View className="flex-row flex-wrap justify-between">
        {displayIcons.map((icon) => renderIconButton(icon))}
        {renderMoreButton()}
        {Array.from({ length: placeholdersNeeded }).map((_, index) => (
          <View key={`placeholder-${index}`} style={{ width: '18%' }} />
        ))}
      </View>

      {/* All Icons Modal */}
      <Modal
        visible={showAllIcons}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAllIcons(false)}>
        <View style={styles.modalContainer}>
          <View className="flex-1 bg-white dark:bg-gray-900">
            {/* Handle Bar */}
            <View className="items-center bg-gray-100 py-2 dark:bg-gray-800">
              <View className="h-1 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
            </View>

            {/* Modal Header */}
            <View className="flex-row items-center justify-between border-b border-gray-200 bg-gray-100 px-4 pb-3 dark:border-gray-700 dark:bg-gray-800">
              <ThemedText className="text-lg font-semibold">
                {t('components:iconPicker.selectIcon')}
              </ThemedText>
              <Pressable
                onPress={() => setShowAllIcons(false)}
                className="rounded-lg bg-blue-500 px-4 py-2 active:bg-blue-600">
                <ThemedText className="font-semibold text-white">{t('common:done')}</ThemedText>
              </Pressable>
            </View>

            {/* All Icons Grid */}
            <ScrollView className="flex-1 p-4">
              <View className="flex-row flex-wrap justify-between">
                {ICONS.map((icon) => renderIconButton(icon))}
                {Array.from({ length: allIconsPlaceholders }).map((_, index) => (
                  <View key={`placeholder-all-${index}`} style={{ width: '18%' }} />
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  modalContainer: {
    flex: 1,
    overflow: 'hidden',
  },
});
