import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

interface LoadingSpinnerProps {
  size?: number;
  strokeWidth?: number;
  color?: string;
  speed?: number;
}

export default function LoadingSpinner({ 
  size = 40, 
  strokeWidth = 4,
  color,
  speed = 1000 
}: LoadingSpinnerProps) {
  const colorScheme = useColorScheme();
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const spin = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: speed,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => spin());
    };
    spin();
  }, [spinValue, speed]);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const isDark = colorScheme === 'dark';
  
  // Dark theme colors that match your app
  const spinnerColor = color || (isDark ? '#10b981' : '#3b82f6'); // Green for dark, blue for light
  const trackColor = isDark ? '#334155' : '#e2e8f0'; // Subtle track color

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference * 0.25; // Show 75% of circle

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background track */}
      <View
        style={[
          styles.track,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: trackColor,
          },
        ]}
      />
      
      {/* Animated spinner */}
      <Animated.View
        style={[
          styles.spinner,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderTopColor: spinnerColor,
            borderRightColor: spinnerColor,
            borderBottomColor: 'transparent',
            borderLeftColor: 'transparent',
            transform: [{ rotate }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  track: {
    position: 'absolute',
    opacity: 0.2,
  },
  spinner: {
    position: 'absolute',
  },
});
