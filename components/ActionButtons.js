// components/ActionButtons.js
import React from 'react';
import { View, Pressable, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { gameStyles } from '../styles/gameStyles';

export default function ActionButtons({ isPlaying, canBuy, canSell, buyAll, sellAll, buttonScaleAnim, gameStarted }) {
  // Show buttons if game has started (either playing or paused) and not completed
  if (!gameStarted) return null;

  // Handle both animated values and static numbers for buttonScaleAnim
  const renderButton = (onPress, style, icon, text, enabled) => {
    const buttonContent = (
      <Pressable
        style={[style, { opacity: enabled ? 1 : 0.5 }]}
        onPress={onPress}
        disabled={!enabled}
      >
        <Ionicons name={icon} size={20} color="#fff" />
        <Text style={gameStyles.actionButtonText}>{text}</Text>
      </Pressable>
    );

    // If buttonScaleAnim is a number (speed mode), use regular View
    if (typeof buttonScaleAnim === 'number') {
      return <View key={text}>{buttonContent}</View>;
    }

    // If buttonScaleAnim is an animated value, use Animated.View
    return (
      <Animated.View key={text} style={{ transform: [{ scale: buttonScaleAnim }] }}>
        {buttonContent}
      </Animated.View>
    );
  };

  return (
    <View style={gameStyles.actionSection}>
      {renderButton(buyAll, [gameStyles.actionButton, gameStyles.buyButton], "trending-up", "BUY ALL", canBuy)}
      {renderButton(sellAll, [gameStyles.actionButton, gameStyles.sellButton], "trending-down", "SELL ALL", canSell)}
    </View>
  );
}