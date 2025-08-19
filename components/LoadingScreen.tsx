import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import LoadingSpinner from './ui/LoadingSpinner';

interface LoadingScreenProps {
  message?: string;
  size?: number;
  showMessage?: boolean;
}

export default function LoadingScreen({ 
  message = "Loading...", 
  size = 50,
  showMessage = true 
}: LoadingScreenProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[
      styles.container, 
      { backgroundColor: isDark ? '#1e293b' : '#f8fafc' }
    ]}>
      <LoadingSpinner size={size} speed={800} />
      {showMessage && (
        <Text style={[
          styles.message,
          { color: isDark ? '#e2e8f0' : '#64748b' }
        ]}>
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});
