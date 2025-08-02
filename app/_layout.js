// app/_layout.js
// Root layout with settings screen and context provider

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SettingsProvider } from '../contexts/SettingsContext';

export default function RootLayout() {
  return (
    <SettingsProvider>
      <StatusBar style="light" backgroundColor="#1a1a2e" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerBackTitle: 'Back',
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Ticker Timer',
            headerShown: false, // Hide header on home screen for full-screen experience
          }}
        />
        <Stack.Screen
          name="setup"
          options={{
            title: 'Game Setup',
            headerBackTitle: 'Home',
          }}
        />
        <Stack.Screen
          name="game"
          options={{
            title: 'Market Timing Game',
            headerBackTitle: 'Setup',
          }}
        />
        <Stack.Screen
          name="results"
          options={{
            title: 'Game Results',
            headerBackTitle: 'Game',
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: 'Settings',
            headerBackTitle: 'Home',
          }}
        />
      </Stack>
    </SettingsProvider>
  );
}