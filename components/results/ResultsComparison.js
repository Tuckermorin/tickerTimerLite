import React from 'react';
import { View, Text } from 'react-native';
import { resultsStyles } from '../../styles/resultsStyles';

const ResultsComparison = ({ results, formatCurrency, formatPercentage }) => (
  <View style={resultsStyles.resultsSection}>
    <Text style={resultsStyles.sectionTitle}>Final Results</Text>

    <View style={resultsStyles.resultCard}>
      <View style={resultsStyles.resultHeader}>
        <Text style={resultsStyles.resultLabel}>Your Strategy</Text>
        <Text
          style={[resultsStyles.resultValue, { color: results.playerReturn >= 0 ? '#38ef7d' : '#ff6b6b' }]}
        >
          {formatCurrency(results.playerValue)}
        </Text>
      </View>
      <Text
        style={[resultsStyles.resultReturn, { color: results.playerReturn >= 0 ? '#38ef7d' : '#ff6b6b' }]}
      >
        {formatPercentage(results.playerReturn)} return
      </Text>
      <Text style={resultsStyles.resultDetail}>
        {results.trades} trades over {results.gameYears} years
      </Text>
    </View>

    <View style={resultsStyles.resultCard}>
      <View style={resultsStyles.resultHeader}>
        <Text style={resultsStyles.resultLabel}>Buy & Hold</Text>
        <Text
          style={[resultsStyles.resultValue, { color: results.buyHoldReturn >= 0 ? '#38ef7d' : '#ff6b6b' }]}
        >
          {formatCurrency(results.buyHoldValue)}
        </Text>
      </View>
      <Text
        style={[resultsStyles.resultReturn, { color: results.buyHoldReturn >= 0 ? '#38ef7d' : '#ff6b6b' }]}
      >
        {formatPercentage(results.buyHoldReturn)} return
      </Text>
      <Text style={resultsStyles.resultDetail}>
        Never sold, just held for {results.gameYears} years
      </Text>
    </View>

    <View
      style={[
        resultsStyles.differenceCard,
        {
          backgroundColor: results.didWin
            ? 'rgba(56, 239, 125, 0.1)'
            : 'rgba(255, 107, 107, 0.1)',
        },
      ]}
    >
      <Text style={resultsStyles.differenceLabel}>Difference</Text>
      <Text
        style={[
          resultsStyles.differenceValue,
          { color: results.didWin ? '#38ef7d' : '#ff6b6b' },
        ]}
      >
        {results.didWin ? '+' : ''}
        {formatCurrency(results.playerValue - results.buyHoldValue)}
      </Text>
      <Text
        style={[
          resultsStyles.differencePercent,
          { color: results.didWin ? '#38ef7d' : '#ff6b6b' },
        ]}
      >
        {formatPercentage(results.playerReturn - results.buyHoldReturn)} vs buy & hold
      </Text>
    </View>
  </View>
);

export default ResultsComparison;
