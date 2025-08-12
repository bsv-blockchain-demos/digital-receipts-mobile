import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#a855f7', // purple-500 to match webapp theme
        tabBarInactiveTintColor: '#64748b', // slate-500
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)', // slate-900/95
          borderTopColor: 'rgba(51, 65, 85, 0.5)', // slate-700/50
          borderTopWidth: 1,
          ...Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="scan" size={size ?? 28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Receipts',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" size={size ?? 28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
