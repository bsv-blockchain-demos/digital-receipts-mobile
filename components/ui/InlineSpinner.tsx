import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import LoadingSpinner from './LoadingSpinner';

interface InlineSpinnerProps {
  size?: number;
  color?: string;
  style?: any;
}

export default function InlineSpinner({ 
  size = 20, 
  color,
  style 
}: InlineSpinnerProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const spinnerColor = color || (isDark ? '#10b981' : '#3b82f6');

  return (
    <View style={[styles.container, style]}>
      <LoadingSpinner 
        size={size} 
        color={spinnerColor}
        strokeWidth={2}
        speed={600}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
});
