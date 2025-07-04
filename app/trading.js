// app/trading.js
// Trading screen for setting up and executing market timing strategies

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import TradeForm from '../components/TradeForm';
import { 
  loadStrategy, 
  saveStrategy, 
  loadPortfolio, 
  savePortfolio,
  loadPriceData,
  savePriceData,
  saveTradeHistory 
} from '../utils/storage';
import { 
  generateMonthlyPrices, 
  calculatePortfolioPerformance 
} from '../utils/generator';

export default function Trading() {
  const router = useRouter();
  const [strategy, setStrategy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const savedStrategy = await loadStrategy();
      setStrategy(savedStrategy);
    } catch (error) {
      console.error('Error loading strategy:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStrategySubmit = async (newStrategy) => {
    try {
      setIsLoading(true);
      
      // Save the strategy
      await saveStrategy(newStrategy);
      setStrategy(newStrategy);

      // Generate price data for simulation (24 months)
      const priceData = generateMonthlyPrices(24, 4500);
      await savePriceData(priceData);

      // Load current portfolio
      const currentPortfolio = await loadPortfolio();
      
      // Calculate portfolio performance with the new strategy
      const performance = calculatePortfolioPerformance(
        priceData, 
        newStrategy, 
        currentPortfolio?.cash || 10000
      );

      // Update portfolio with simulation results
      const updatedPortfolio = {
        cash: performance.finalCash,
        shares: performance.finalShares,
        totalValue: performance.finalValue,
        totalReturn: performance.totalReturn,
        totalReturnPercent: performance.totalReturnPercent,
        lastUpdated: new Date().toISOString(),
      };

      await savePortfolio(updatedPortfolio);
      await saveTradeHistory(performance.trades);

      // Show success message
      Toast.show({
        type: 'success',
        text1: 'Simulation Complete!',
        text2: `Strategy executed with ${performance.trades.length} trades`,
        visibilityTime: 3000,
      });

      // Navigate to results after a short delay
      setTimeout(() => {
        router.push('/results');
      }, 1500);

    } catch (error) {
      console.error('Error running simulation:', error);
      Toast.show({
        type: 'error',
        text1: 'Simulation Failed',
        text2: 'There was an error running the simulation',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatStrategyDescription = (strategy) => {
    if (!strategy) return "No strategy selected";
    
    const actionText = strategy.action === 'buy' ? 'Buy' : 'Sell';
    const timingText = {
      'first': 'first of each month',
      'middle': 'middle of each month (15th)',
      'last': 'end of each month'
    }[strategy.timing] || strategy.timing;
    
    return `${actionText} $${strategy.amount.toLocaleString()} worth of S&P 500 on the ${timingText}`;
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading trading data...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Market Timing Strategy</Text>
          <Text style={styles.subtitle}>
            Test your strategy against 24 months of simulated S&P 500 data
          </Text>
        </View>

        {/* Current Strategy Display */}
        {strategy && (
          <View style={styles.currentStrategy}>
            <Text style={styles.currentStrategyTitle}>Current Strategy</Text>
            <Text style={styles.currentStrategyText}>
              {formatStrategyDescription(strategy)}
            </Text>
          </View>
        )}

        {/* Strategy Form */}
        <TradeForm 
          onSubmit={handleStrategySubmit}
          initialStrategy={strategy}
        />

        {/* Information Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How It Works</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>
              • Choose to buy or sell a fixed amount monthly
            </Text>
            <Text style={styles.infoItem}>
              • Select your preferred timing within each month
            </Text>
            <Text style={styles.infoItem}>
              • Run simulation against 24 months of market data
            </Text>
            <Text style={styles.infoItem}>
              • Compare your results to buy-and-hold strategy
            </Text>
          </View>
        </View>

        {/* Risk Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>⚠️ Educational Only</Text>
          <Text style={styles.disclaimerText}>
            This app uses simulated data for educational purposes. 
            Past performance does not guarantee future results. 
            Real market timing is extremely difficult and risky.
          </Text>
        </View>
      </ScrollView>
      
      <Toast />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#8e8e93',
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
    lineHeight: 22,
  },
  currentStrategy: {
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.3)',
  },
  currentStrategyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4facfe',
    marginBottom: 8,
  },
  currentStrategyText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  infoSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    fontSize: 14,
    color: '#8e8e93',
    lineHeight: 20,
  },
  disclaimer: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#8e8e93',
    lineHeight: 18,
  },
});