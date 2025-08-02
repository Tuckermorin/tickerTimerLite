import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { resultsStyles } from '../../styles/resultsStyles';

const ModeInfoCard = ({ modeInfo }) => (
  <View style={resultsStyles.modeSection}>
    <View style={resultsStyles.modeCard}>
      <Ionicons name={modeInfo.icon} size={24} color="#4facfe" />
      <View style={resultsStyles.modeText}>
        <Text style={resultsStyles.modeTitle}>{modeInfo.title}</Text>
        <Text style={resultsStyles.modeSubtitle}>{modeInfo.subtitle}</Text>
      </View>
    </View>
  </View>
);

export default ModeInfoCard;
