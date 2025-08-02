// components/ModeBadge.js
import React from 'react';
import { View, Text } from 'react-native';
import { gameStyles } from '../styles/gameStyles';

export default function ModeBadge({ gameMode, hasEconomicEvents }) {
  return (
    <View style={gameStyles.modeSection}>
      <Text style={gameStyles.modeText}>
        {gameMode === 'classic' && '📈 Classic Mode'}
        {gameMode === 'diversified' && '📊 Diversified Mode'}
        {gameMode === 'speedrun' && '⚡ Speed Run Mode'}
        {hasEconomicEvents && ' • Economic Events'}
      </Text>
    </View>
  );
}

