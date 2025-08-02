import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { resultsStyles } from '../../styles/resultsStyles';

const ResultsHeader = ({ didWin }) => (
  <View style={resultsStyles.header}>
    <Ionicons
      name={didWin ? 'trophy' : 'medal'}
      size={64}
      color={didWin ? '#ffd700' : '#c0c0c0'}
    />
    <Text style={resultsStyles.title}>
      {didWin ? 'You Beat the Market!' : 'Market Wins This Time'}
    </Text>
    <Text style={resultsStyles.subtitle}>
      {didWin ?
        'Congratulations on your market timing skills!'
        : 'Market timing is harder than it looks!'}
    </Text>
  </View>
);

export default ResultsHeader;
