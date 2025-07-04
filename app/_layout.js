// app/_layout.js
// Root layout with tab navigation setup

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#1a1a2e" />
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a2e',
            borderBottomWidth: 1,
            borderBottomColor: '#2d2d44',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          tabBarActiveTintColor: '#4facfe',
          tabBarInactiveTintColor: '#8e8e93',
          tabBarStyle: {
            backgroundColor: '#1a1a2e',
            borderTopColor: '#2d2d44',
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="portfolio"
          options={{
            title: 'Portfolio',
            headerTitle: 'Portfolio Overview',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? 'wallet' : 'wallet-outline'} 
                size={24} 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="trading"
          options={{
            title: 'Trading',
            headerTitle: 'Trading Strategy',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? 'trending-up' : 'trending-up-outline'} 
                size={24} 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="results"
          options={{
            title: 'Results',
            headerTitle: 'Performance Results',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? 'analytics' : 'analytics-outline'} 
                size={24} 
                color={color} 
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}