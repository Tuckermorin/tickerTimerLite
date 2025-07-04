// app/portfolio.js
// Portfolio overview screen showing current holdings and performance

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import MetricCard from '../components/MetricCard';
import { loadPortfolio, loadPriceData, clearAllData } from '../utils/storage';
import { generateMonthlyPrices } from '../utils/generator';

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState({
    cash: 10000,
    shares: 0,
    totalValue: 10000,
    totalReturn: 0,
    totalReturnPercent: 0,
    lastUpdated: null,
  });
  
  const [currentPrice, setCurrentPrice] = useState(4500);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      setIsLoading(true);
      
      // Load portfolio data
      const savedPortfolio = await loadPortfolio();
      if (savedPortfolio) {
        setPortfolio(savedPortfolio);
      }
      
      // Load current price data
      const priceData = await loadPriceData();
      if (priceData && priceData.length > 0) {
        const latestPrice = priceData[priceData.length - 1];
        setCurrentPrice(latestPrice.price);
        
        // Update portfolio value with current price
        if (savedPortfolio) {
          const updatedValue = savedPortfolio.cash + (savedPortfolio.shares * latestPrice.price);
          const initialValue = 10000; // Starting portfolio value
          const totalReturn = updatedValue - initialValue;
          const totalReturnPercent = (totalReturn / initialValue) * 100;
          
          setPortfolio(prev => ({
            ...prev,
            totalValue: updatedValue,
            totalReturn,
            totalReturnPercent,
          }));
        }
      }
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load portfolio data',
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPortfolioData();
  };

  const handleReset = async () => {
    try {
      await clearAllData();
      
      // Reset to default state
      setPortfolio({
        cash: 10000,
        shares: 0,
        totalValue: 10000,
        totalReturn: 0,
        totalReturnPercent: 0,
        lastUpdated: null,
      });
      
      setCurrentPrice(4500);
      
      Toast.show({
        type: 'success',
        text1: 'Reset Complete',
        text2: 'Portfolio has been reset to initial state',
      });
    } catch (error) {
      console.error('Error resetting portfolio:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to reset portfolio',
      });
    }
  };

  const getReturnColor = (value) => {
    if (value > 0) return '#38ef7d';
    if (value < 0) return '#ff6b6b';
    return '#8e8e93';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading portfolio...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Portfolio Overview</Text>
          <Text style={styles.subtitle}>Track your market timing performance</Text>
        </View>

        {/* Current S&P 500 Price */}
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Current S&P 500</Text>
          <Text style={styles.priceValue}>{formatCurrency(currentPrice)}</Text>
        </View>

        {/* Portfolio Metrics */}
        <View style={styles.metricsContainer}>
          <MetricCard
            title="Total Portfolio Value"
            value={formatCurrency(portfolio.totalValue)}
            subtitle="Current worth of all holdings"
            color="#4facfe"
          />
          
          <MetricCard
            title="Available Cash"
            value={formatCurrency(portfolio.cash)}
            subtitle="Ready for new trades"
            color="#00f2fe"
          />
          
          <MetricCard
            title="Shares Owned"
            value={portfolio.shares.toFixed(4)}
            subtitle="S&P 500 ETF shares"
            color="#43e97b"
          />
          
          <MetricCard
            title="Total Return"
            value={`${portfolio.totalReturnPercent >= 0 ? '+' : ''}${portfolio.totalReturnPercent.toFixed(2)}%`}
            subtitle={formatCurrency(portfolio.totalReturn)}
            color={getReturnColor(portfolio.totalReturn)}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <Pressable style={styles.resetButton} onPress={handleReset}>
            <Ionicons name="refresh" size={20} color="#ff6b6b" />
            <Text style={styles.resetButtonText}>Reset Portfolio</Text>
          </Pressable>
        </View>

        {/* Last Updated */}
        {portfolio.lastUpdated && (
          <View style={styles.lastUpdated}>
            <Text style={styles.lastUpdatedText}>
              Last updated: {new Date(portfolio.lastUpdated).toLocaleString()}
            </Text>
          </View>
        )}
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
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
  },
  priceSection: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  priceLabel: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4facfe',
  },
  metricsContainer: {
    marginBottom: 20,
  },
  actionSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ff6b6b',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    gap: 8,
  },
  resetButtonText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: '600',
  },
  lastUpdated: {
    alignItems: 'center',
    marginTop: 10,
  },
  lastUpdatedText: {
    color: '#8e8e93',
    fontSize: 12,
  },
});