// components/ActionButtons.js
import React from 'react';
import { View, Pressable, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { gameStyles } from '../styles/gameStyles';

export default function ActionButtons({ isPlaying, canBuy, canSell, buyAll, sellAll, buttonScaleAnim }) {
  if (!isPlaying) return null;

  return (
    <View style={gameStyles.actionSection}>
      <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
        <Pressable
          style={[gameStyles.actionButton, gameStyles.buyButton, { opacity: canBuy ? 1 : 0.5 }]}
          onPress={buyAll}
          disabled={!canBuy}
        >
          <Ionicons name="trending-up" size={20} color="#fff" />
          <Text style={gameStyles.actionButtonText}>BUY ALL</Text>
        </Pressable>
      </Animated.View>

      <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
        <Pressable
          style={[gameStyles.actionButton, gameStyles.sellButton, { opacity: canSell ? 1 : 0.5 }]}
          onPress={sellAll}
          disabled={!canSell}
        >
          <Ionicons name="trending-down" size={20} color="#fff" />
          <Text style={gameStyles.actionButtonText}>SELL ALL</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

