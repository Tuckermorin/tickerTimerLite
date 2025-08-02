import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { resultsStyles } from '../../styles/resultsStyles';

const ResultsActions = ({ playAgain, goHome }) => (
  <View style={resultsStyles.actionSection}>
    <Pressable style={resultsStyles.playAgainButton} onPress={playAgain}>
      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        style={resultsStyles.playAgainGradient}
      >
        <Ionicons name="refresh" size={20} color="#fff" />
        <Text style={resultsStyles.playAgainText}>Play Again</Text>
      </LinearGradient>
    </Pressable>

    <Pressable style={resultsStyles.homeButton} onPress={goHome}>
      <Ionicons name="home" size={20} color="#fff" />
      <Text style={resultsStyles.homeButtonText}>Home</Text>
    </Pressable>
  </View>
);

export default ResultsActions;
