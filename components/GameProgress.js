// components/GameProgress.js
import React from 'react';
import { View, Text, Animated } from 'react-native';
import { gameStyles } from '../styles/gameStyles';

export default function GameProgress({ currentMonth, gameYears, monthName, isPlaying, pulseAnim, progressAnim, gameMode }) {
  // Handle both animated values and static numbers for pulseAnim
  const renderTitle = () => {
    const titleText = `Year ${Math.floor(currentMonth / 12) + 1} of ${gameYears}`;
    
    // If pulseAnim is a number (speed mode), use regular View
    if (typeof pulseAnim === 'number') {
      return (
        <Text style={gameStyles.progressTitle}>
          {titleText}
        </Text>
      );
    }
    
    // If pulseAnim is an animated value, use Animated.Text
    return (
      <Animated.Text
        style={[
          gameStyles.progressTitle,
          { transform: [{ scale: isPlaying ? pulseAnim : 1 }] }
        ]}
      >
        {titleText}
      </Animated.Text>
    );
  };

  return (
    <View style={gameStyles.progressSection}>
      {renderTitle()}
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