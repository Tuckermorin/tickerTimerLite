// components/GameProgress.js
import React from 'react';
import { View, Text, Animated } from 'react-native';
import { gameStyles } from '../styles/gameStyles';

export default function GameProgress({ currentMonth, gameYears, monthName, isPlaying, pulseAnim, progressAnim, gameMode }) {
  return (
    <View style={gameStyles.progressSection}>
      <Animated.Text
        style={[
          gameStyles.progressTitle,
          { transform: [{ scale: isPlaying ? pulseAnim : 1 }] }
        ]}
      >
        Year {Math.floor(currentMonth / 12) + 1} of {gameYears}
      </Animated.Text>
      <Text style={gameStyles.progressSubtitle}>
        {monthName}
        {gameMode === 'speedrun' && ' • 2x Speed'}
      </Text>
      <View style={gameStyles.progressBar}>
        <Animated.View
          style={[
            gameStyles.progressFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              })
            }
          ]}
        />
      </View>
    </View>
  );
}

