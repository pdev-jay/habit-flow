import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme, useI18n } from '@/hooks';
import { cn } from '@/lib/utils';
import type { FrequencyType, HabitIconName } from '@/features/habits/types';

import { ColorPicker, COLORS } from './ColorPicker';
import { IconPicker } from './IconPicker';

interface HabitFormData {
  name: string;
  icon: HabitIconName;
  color: string;
  frequency: FrequencyType;
  customDays?: number[];
  reminderTime?: string;
  reminderEnabled: boolean;
}

export interface HabitFormRef {
  submit: () => void;
}

interface HabitFormProps {
  initialData?: Partial<HabitFormData>;
  onSubmit: (data: HabitFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
  onValidationChange?: (isValid: boolean) => void;
  renderFooter?: () => React.ReactNode;
}

/**
 * Habit form component
 */
export const HabitForm = forwardRef<HabitFormRef, HabitFormProps>(
  ({ initialData, onSubmit, onCancel, submitLabel, onValidationChange, renderFooter }, ref) => {
    const { t } = useI18n();

    const WEEKDAYS = [
      { day: 1, label: t('components:habitForm.weekdays.mon') },
      { day: 2, label: t('components:habitForm.weekdays.tue') },
      { day: 3, label: t('components:habitForm.weekdays.wed') },
      { day: 4, label: t('components:habitForm.weekdays.thu') },
      { day: 5, label: t('components:habitForm.weekdays.fri') },
      { day: 6, label: t('components:habitForm.weekdays.sat') },
      { day: 0, label: t('components:habitForm.weekdays.sun') },
    ];
    const [name, setName] = useState(initialData?.name || '');
    const [icon, setIcon] = useState<HabitIconName>(initialData?.icon || 'water');
    const [color, setColor] = useState(initialData?.color || COLORS[0]);
    const [customDays, setCustomDays] = useState<number[]>(
      initialData?.customDays !== undefined ? initialData.customDays : [0, 1, 2, 3, 4, 5, 6]
    );
    const [reminderEnabled, setReminderEnabled] = useState(initialData?.reminderEnabled || false);
    const [reminderTime, setReminderTime] = useState<Date>(() => {
      if (initialData?.reminderTime) {
        const [time, period] = initialData.reminderTime.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        const date = new Date();
        let hour = hours;
        if (period === 'pm' && hours !== 12) hour += 12;
        if (period === 'am' && hours === 12) hour = 0;
        date.setHours(hour, minutes, 0, 0);
        return date;
      }
      const defaultTime = new Date();
      defaultTime.setHours(9, 0, 0, 0);
      return defaultTime;
    });
    const [showTimePicker, setShowTimePicker] = useState(false);
    const slideAnim = useRef(new Animated.Value(300)).current;
    const colorScheme = useTheme();

    // Animate slide when time picker opens/closes
    useEffect(() => {
      if (showTimePicker) {
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }).start();
      } else {
        slideAnim.setValue(300);
      }
    }, [showTimePicker, slideAnim]);

    // Validate form and notify parent
    useEffect(() => {
      const isValid = name.trim().length > 0 && customDays.length > 0;
      onValidationChange?.(isValid);
    }, [name, customDays, onValidationChange]);

    const formatTime = (date: Date): string => {
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const period = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12 || 12;
      const minutesStr = minutes.toString().padStart(2, '0');
      return `${hours.toString().padStart(2, '0')}:${minutesStr} ${period}`;
    };

    const toggleDay = (day: number) => {
      setCustomDays((prev) => {
        if (prev.includes(day)) {
          return prev.filter((d) => d !== day);
        } else {
          return [...prev, day].sort((a, b) => a - b);
        }
      });
    };

    const handleTimeChange = (_event: any, selectedDate?: Date) => {
      console.log('handleTimeChange called', { selectedDate });

      // Android: picker closes automatically
      if (Platform.OS === 'android') {
        setShowTimePicker(false);
      }

      if (selectedDate) {
        setReminderTime(selectedDate);
      }
    };

    const handleTimePickerDone = () => {
      console.log('Time picker done');
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setShowTimePicker(false);
      });
    };

    const handleSubmit = () => {
      if (!name.trim()) {
        return;
      }

      onSubmit({
        name: name.trim(),
        icon,
        color,
        frequency: 'custom',
        customDays,
        reminderTime: formatTime(reminderTime),
        reminderEnabled,
      });
    };

    // Expose submit function via ref
    useImperativeHandle(ref, () => ({
      submit: handleSubmit,
    }));

    return (
      <ThemedView className="flex-1">
        <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 80 }}>
          {/* Name Input */}
          <View className="mb-6">
            <ThemedText className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              {t('components:habitForm.nameLabel')}
            </ThemedText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t('components:habitForm.namePlaceholder')}
              placeholderTextColor={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
              className="h-12 rounded-lg border border-gray-300 bg-white px-4 text-base text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              maxLength={50}
            />
          </View>

          {/* Icon Picker */}
          <View className="mb-6">
            <IconPicker selectedIcon={icon} selectedColor={color} onSelect={setIcon} />
          </View>

          {/* Color Picker */}
          <View className="mb-6">
            <ColorPicker selectedColor={color} onSelect={setColor} />
          </View>

          {/* Repeat - Day Selector */}
          <View className="mb-6">
            <ThemedText className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              {t('components:habitForm.repeat')}
            </ThemedText>
            <View className="flex-row justify-between">
              {WEEKDAYS.map((weekday) => {
                const isSelected = customDays.includes(weekday.day);
                return (
                  <Pressable
                    key={weekday.day}
                    onPress={() => toggleDay(weekday.day)}
                    className={cn(
                      'items-center justify-center rounded-lg px-3 py-3',
                      isSelected ? 'bg-blue-500' : 'bg-gray-100 dark:bg-gray-700'
                    )}
                    style={[styles.dayButton, { flex: 1, marginHorizontal: 2 }]}>
                    <ThemedText
                      className={cn(
                        'text-sm font-semibold',
                        isSelected ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                      )}>
                      {weekday.label}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Daily Reminder */}
          <View className="mb-6">
            <ThemedText className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              {t('components:habitForm.dailyReminder')}
            </ThemedText>

            <View className="flex-row items-center gap-3">
              {/* Time Pill - Opens time picker */}
              <Pressable
                onPress={() => {
                  console.log('Time picker button pressed');
                  setShowTimePicker(true);
                  console.log('showTimePicker set to true');
                }}
                className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3.5 active:bg-blue-600"
                style={styles.pillShadow}>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#FFFFFF" />
                <ThemedText className="text-base font-semibold text-white">
                  {formatTime(reminderTime)}
                </ThemedText>
              </Pressable>

              {/* Bell Button - Toggles ON/OFF */}
              <Pressable
                onPress={() => {
                  setReminderEnabled((prev) => !prev);
                }}
                className={cn(
                  'h-12 w-12 items-center justify-center rounded-xl',
                  reminderEnabled
                    ? 'bg-green-500 active:bg-green-600'
                    : 'bg-gray-300 active:bg-gray-400 dark:bg-gray-600 dark:active:bg-gray-500'
                )}
                style={styles.pillShadow}>
                <MaterialCommunityIcons
                  name={reminderEnabled ? 'bell' : 'bell-off-outline'}
                  size={22}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            {/* Status Text */}
            <View className="mt-3 flex-row items-center gap-2">
              <View
                className={cn(
                  'h-2 w-2 rounded-full',
                  reminderEnabled ? 'bg-green-500' : 'bg-gray-400'
                )}
              />
              <ThemedText
                className={cn(
                  'text-sm font-medium',
                  reminderEnabled
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-500 dark:text-gray-400'
                )}>
                {reminderEnabled
                  ? t('components:habitForm.reminderActiveMessage')
                  : t('components:habitForm.reminderInactiveMessage')}
              </ThemedText>
            </View>

            {/* iOS: Modal with Spinner */}
            {showTimePicker && Platform.OS === 'ios' && (
              <Modal
                transparent
                animationType="fade"
                visible={showTimePicker}
                onRequestClose={handleTimePickerDone}>
                <Pressable
                  style={styles.modalOverlay}
                  onPress={handleTimePickerDone}
                  className="flex-1 justify-end bg-black/50">
                  <Pressable onPress={(e) => e.stopPropagation()}>
                    <Animated.View
                      style={{ transform: [{ translateY: slideAnim }] }}
                      className="rounded-t-2xl bg-white p-4 dark:bg-gray-800">
                      <View className="mb-3 flex-row items-center justify-between">
                        <ThemedText className="text-lg font-semibold">
                          {t('components:habitForm.selectTime')}
                        </ThemedText>
                        <Pressable
                          onPress={handleTimePickerDone}
                          className="rounded-lg bg-blue-500 px-4 py-2 active:bg-blue-600">
                          <ThemedText className="font-semibold text-white">
                            {t('components:habitForm.done')}
                          </ThemedText>
                        </Pressable>
                      </View>
                      <DateTimePicker
                        value={reminderTime}
                        mode="time"
                        is24Hour={false}
                        display="spinner"
                        onChange={handleTimeChange}
                        textColor={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
                        style={styles.iosTimePicker}
                      />
                    </Animated.View>
                  </Pressable>
                </Pressable>
              </Modal>
            )}

            {/* Android: Native Picker */}
            {showTimePicker && Platform.OS === 'android' && (
              <DateTimePicker
                value={reminderTime}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </View>

          {/* Footer (optional) */}
          {renderFooter && renderFooter()}
        </ScrollView>
      </ThemedView>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  dayButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pillShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  modalOverlay: {
    flex: 1,
  },
  iosTimePicker: {
    height: 216,
  },
});
