import React, { useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import { WeekCalendar } from './WeekCalendar';
import { MonthCalendar } from './MonthCalendar';

interface ExpandableCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

/**
 * ExpandableCalendar component
 * Auto height with fade animation - no fixed heights needed
 */
export function ExpandableCalendar({ selectedDate, onSelectDate }: ExpandableCalendarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const opacity = useSharedValue(1);

  const handleExpand = () => {
    // Fade out current → switch → fade in new
    opacity.value = withTiming(0, { duration: 150 }, (finished) => {
      if (finished) {
        runOnJS(setIsExpanded)(true);
        opacity.value = withTiming(1, { duration: 150 });
      }
    });
  };

  const handleCollapse = () => {
    // Fade out current → switch → fade in new
    opacity.value = withTiming(0, { duration: 150 }, (finished) => {
      if (finished) {
        runOnJS(setIsExpanded)(false);
        opacity.value = withTiming(1, { duration: 150 });
      }
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      {isExpanded ? (
        <MonthCalendar
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          onCollapse={handleCollapse}
        />
      ) : (
        <WeekCalendar
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          onExpand={handleExpand}
        />
      )}
    </Animated.View>
  );
}
