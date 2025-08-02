// components/GameControls.js
import React from 'react';
import { View, Pressable, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { gameStyles } from '../styles/gameStyles';

export default function GameControls({
  isPlaying,
  isPaused,
  gameComplete,
  startGame,
  pauseGame,
  goToMenu,
  buttonScaleAnim,
}) {
  // Handle both animated values and static numbers for buttonScaleAnim
  const renderAnimatedButton = (onPress, style, icon, text) => {
    const buttonContent = (
      <Pressable style={style} onPress={onPress}>
        <Ionicons name={icon} size={20} color="#fff" />
        <Text style={gameStyles.controlButtonText}>{text}</Text>
      </Pressable>
    );

    // If buttonScaleAnim is a number (speed mode), use regular View
    if (typeof buttonScaleAnim === 'number') {
      return buttonContent;
    }

    // If buttonScaleAnim is an animated value, use Animated.View
    return (
      <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
        {buttonContent}
      </Animated.View>
    );
  };

  return (
    <View style={gameStyles.controlSection}>
      {!isPlaying && !gameComplete && 
        renderAnimatedButton(startGame, gameStyles.controlButton, "play", isPaused ? 'Resume' : 'Start Game')
      }

      {isPlaying && 
        renderAnimatedButton(pauseGame, gameStyles.controlButton, "pause", "Pause")
      }

      <Pressable style={gameStyles.menuButton} onPress={goToMenu}>
        <Ionicons name="home" size={20} color="#fff" />
        <Text style={gameStyles.menuButtonText}>Menu</Text>
      </Pressable>
    </View>
  );
}