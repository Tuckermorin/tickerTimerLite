import React from 'react';
import { View, Text } from 'react-native';
import { resultsStyles } from '../../styles/resultsStyles';

const GameStats = ({ results, formatCurrency }) => (
  <View style={resultsStyles.statsSection}>
    <Text style={resultsStyles.sectionTitle}>Game Stats</Text>
    <View style={resultsStyles.statsGrid}>
      <View style={resultsStyles.statItem}>
        <Text style={resultsStyles.statNumber}>{results.gameYears}</Text>
        <Text style={resultsStyles.statLabel}>Years</Text>
      </View>
      <View style={resultsStyles.statItem}>
        <Text style={resultsStyles.statNumber}>{results.trades}</Text>
        <Text style={resultsStyles.statLabel}>Trades</Text>
      </View>
      <View style={resultsStyles.statItem}>
        <Text style={resultsStyles.statNumber}>{formatCurrency(results.startingValue)}</Text>
        <Text style={resultsStyles.statLabel}>Started</Text>
      </View>
    </View>
  </View>
);

export default GameStats;
