// app/results.js
// Results screen showing final comparison with mode support

import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { resultsStyles } from '../styles/resultsStyles';
import ResultsHeader from '../components/results/ResultsHeader';
import ModeInfoCard from '../components/results/ModeInfoCard';
import ResultsComparison from '../components/results/ResultsComparison';
import GameStats from '../components/results/GameStats';
import FunFact from '../components/results/FunFact';
import ResultsActions from '../components/results/ResultsActions';

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Use real game data if available, otherwise use mock data
  const gameData = {
    playerValue: params.playerValue ? parseFloat(params.playerValue) : 15420,
    buyHoldValue: params.buyHoldValue ? parseFloat(params.buyHoldValue) : 18750,
    playerReturn: params.playerReturn ? parseFloat(params.playerReturn) : 54.2,
    buyHoldReturn: params.buyHoldReturn ? parseFloat(params.buyHoldReturn) : 87.5,
    didWin: params.didWin === 'true' || false,
    gameMode: params.gameMode || 'classic',
    gameYears: params.gameYears ? parseInt(params.gameYears) : 20,
    startingValue: 10000,
    trades: 24
  };

  const [results, setResults] = useState(gameData);

  useEffect(() => {
    setResults(gameData);
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const playAgain = () => {
    router.push('/setup');
  };

  const goHome = () => {
    router.push('/');
  };

  // Get mode-specific display info
  const getModeInfo = () => {
    switch (results.gameMode) {
      case 'speedrun':
        return {
          icon: 'flash',
          title: 'Speed Run Complete!',
          subtitle: `${results.gameYears} years at 2x speed`
        };
      case 'diversified':
        return {
          icon: 'pie-chart',
          title: 'Diversified Challenge Complete!',
          subtitle: `${results.gameYears} years with multiple stocks`
        };
      default:
        return {
          icon: 'trending-up',
          title: 'Classic Challenge Complete!',
          subtitle: `${results.gameYears} years with S&P 500`
        };
    }
  };

  const modeInfo = getModeInfo();

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={resultsStyles.container}>
      <ScrollView style={resultsStyles.content}>
        <View style={resultsStyles.content}>
          <ResultsHeader didWin={results.didWin} />
          <ModeInfoCard modeInfo={modeInfo} />
          <ResultsComparison
            results={results}
            formatCurrency={formatCurrency}
            formatPercentage={formatPercentage}
          />
          <GameStats results={results} formatCurrency={formatCurrency} />
          <FunFact didWin={results.didWin} gameMode={results.gameMode} />
          <ResultsActions playAgain={playAgain} goHome={goHome} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
