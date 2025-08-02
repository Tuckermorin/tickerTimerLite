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
  return (
    <View style={gameStyles.controlSection}>
      {!isPlaying && !gameComplete && (
        <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
          <Pressable style={gameStyles.controlButton} onPress={startGame}>
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={gameStyles.controlButtonText}>
              {isPaused ? 'Resume' : 'Start Game'}
            </Text>
          </Pressable>
        </Animated.View>
      )}

      {isPlaying && (
        <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
          <Pressable style={gameStyles.controlButton} onPress={pauseGame}>
            <Ionicons name="pause" size={20} color="#fff" />
            <Text style={gameStyles.controlButtonText}>Pause</Text>
          </Pressable>
        </Animated.View>
      )}

      <Pressable style={gameStyles.menuButton} onPress={goToMenu}>
        <Ionicons name="home" size={20} color="#fff" />
        <Text style={gameStyles.menuButtonText}>Menu</Text>
      </Pressable>
    </View>
  );
}

