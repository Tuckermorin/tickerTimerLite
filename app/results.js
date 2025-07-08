// app/results.js
// Results screen showing final comparison

import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { resultsStyles } from '../styles/resultsStyles';

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Mock data for now - in a real app, this would come from game state
  const [results, setResults] = useState({
    playerValue: 15420,
    buyHoldValue: 18750,
    startingValue: 10000,
    playerReturn: 54.2,
    buyHoldReturn: 87.5,
    didWin: false,
    years: 30,
    trades: 24
  });

  useEffect(() => {
    // Calculate results from game data
    // For now using mock data, but this would be populated from the actual game
    const playerValue = 15420; // Would come from final portfolio value
    const buyHoldValue = 18750; // Would come from buy-and-hold calculation
    const startingValue = 10000;
    
    const playerReturn = ((playerValue - startingValue) / startingValue) * 100;
    const buyHoldReturn = ((buyHoldValue - startingValue) / startingValue) * 100;
    const didWin = playerValue > buyHoldValue;
    
    setResults({
      playerValue,
      buyHoldValue,
      startingValue,
      playerReturn,
      buyHoldReturn,
      didWin,
      years: 30,
      trades: 24
    });
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
    router.push('/game');
  };

  const goHome = () => {
    router.push('/');
  };

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={resultsStyles.container}>
      <View style={resultsStyles.content}>
        
        {/* Header */}
        <View style={resultsStyles.header}>
          <Ionicons 
            name={results.didWin ? "trophy" : "medal"} 
            size={64} 
            color={results.didWin ? "#ffd700" : "#c0c0c0"} 
          />
          <Text style={resultsStyles.title}>
            {results.didWin ? "You Beat the Market!" : "Market Wins This Time"}
          </Text>
          <Text style={resultsStyles.subtitle}>
            {results.didWin 
              ? "Congratulations on your market timing skills!" 
              : "Market timing is harder than it looks!"
            }
          </Text>
        </View>

        {/* Results Comparison */}
        <View style={resultsStyles.resultsSection}>
          <Text style={resultsStyles.sectionTitle}>Final Results</Text>
          
          {/* Your Strategy */}
          <View style={resultsStyles.resultCard}>
            <View style={resultsStyles.resultHeader}>
              <Text style={resultsStyles.resultLabel}>Your Strategy</Text>
              <Text style={[
                resultsStyles.resultValue,
                { color: results.playerReturn >= 0 ? '#38ef7d' : '#ff6b6b' }
              ]}>
                {formatCurrency(results.playerValue)}
              </Text>
            </View>
            <Text style={[
              resultsStyles.resultReturn,
              { color: results.playerReturn >= 0 ? '#38ef7d' : '#ff6b6b' }
            ]}>
              {formatPercentage(results.playerReturn)} return
            </Text>
            <Text style={resultsStyles.resultDetail}>
              {results.trades} trades over {results.years} years
            </Text>
          </View>

          {/* Buy & Hold */}
          <View style={resultsStyles.resultCard}>
            <View style={resultsStyles.resultHeader}>
              <Text style={resultsStyles.resultLabel}>Buy & Hold</Text>
              <Text style={[
                resultsStyles.resultValue,
                { color: results.buyHoldReturn >= 0 ? '#38ef7d' : '#ff6b6b' }
              ]}>
                {formatCurrency(results.buyHoldValue)}
              </Text>
            </View>
            <Text style={[
              resultsStyles.resultReturn,
              { color: results.buyHoldReturn >= 0 ? '#38ef7d' : '#ff6b6b' }
            ]}>
              {formatPercentage(results.buyHoldReturn)} return
            </Text>
            <Text style={resultsStyles.resultDetail}>
              Never sold, just held for {results.years} years
            </Text>
          </View>

          {/* Difference */}
          <View style={[
            resultsStyles.differenceCard,
            { backgroundColor: results.didWin ? 'rgba(56, 239, 125, 0.1)' : 'rgba(255, 107, 107, 0.1)' }
          ]}>
            <Text style={resultsStyles.differenceLabel}>Difference</Text>
            <Text style={[
              resultsStyles.differenceValue,
              { color: results.didWin ? '#38ef7d' : '#ff6b6b' }
            ]}>
              {results.didWin ? '+' : ''}{formatCurrency(results.playerValue - results.buyHoldValue)}
            </Text>
            <Text style={[
              resultsStyles.differencePercent,
              { color: results.didWin ? '#38ef7d' : '#ff6b6b' }
            ]}>
              {formatPercentage(results.playerReturn - results.buyHoldReturn)} vs buy & hold
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={resultsStyles.statsSection}>
          <Text style={resultsStyles.sectionTitle}>Game Stats</Text>
          <View style={resultsStyles.statsGrid}>
            <View style={resultsStyles.statItem}>
              <Text style={resultsStyles.statNumber}>{results.years}</Text>
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

        {/* Fun Fact */}
        <View style={resultsStyles.factSection}>
          <Text style={resultsStyles.factTitle}>💡 Fun Fact</Text>
          <Text style={resultsStyles.factText}>
            {results.didWin 
              ? "You're in the minority! Studies show that over 80% of professional fund managers fail to beat the market consistently over long periods."
              : "You're in good company! Even professional fund managers struggle to beat a simple buy-and-hold strategy over the long term."
            }
          </Text>
        </View>

        {/* Action Buttons */}
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

      </View>
    </LinearGradient>
  );
}