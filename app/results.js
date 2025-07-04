// app/results.js
// Results screen showing portfolio performance and trade history

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import ChartLine from '../components/ChartLine';
import MetricCard from '../components/MetricCard';
import { 
  loadPortfolio, 
  loadPriceData, 
  loadTradeHistory, 
  loadStrategy 
} from '../utils/storage';
import { calculateBuyAndHold } from '../utils/generator';

export default function Results() {
  const [portfolio, setPortfolio] = useState(null);
  const [priceData, setPriceData] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [strategy, setStrategy] = useState(null);
  const [buyHoldComparison, setBuyHoldComparison] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showTrades, setShowTrades] = useState(false);

  useEffect(() => {
    loadResultsData();
  }, []);

  const loadResultsData = async () => {
    try {
      setIsLoading(true);

      // Load all data
      const [portfolioData, prices, trades, strategyData] = await Promise.all([
        loadPortfolio(),
        loadPriceData(),
        loadTradeHistory(),
        loadStrategy()
      ]);

      setPortfolio(portfolioData);
      setPriceData(prices || []);
      setTradeHistory(trades || []);
      setStrategy(strategyData);

      // Calculate buy and hold comparison
      if (prices && prices.length > 0) {
        const buyHold = calculateBuyAndHold(prices, 10000);
        setBuyHoldComparison(buyHold);
      }

    } catch (error) {
      console.error('Error loading results data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load results data',
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadResultsData();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPerformanceColor = (value) => {
    if (value > 0) return '#38ef7d';
    if (value < 0) return '#ff6b6b';
    return '#8e8e93';
  };

  // Prepare chart data
  const chartData = priceData.map((price, index) => ({
    value: portfolio ? (portfolio.cash + (portfolio.shares * price.price)) : 10000,
    date: price.date
  }));

  const buyHoldChartData = buyHoldComparison ? priceData.map((price, index) => ({
    value: (10000 / priceData[0].price) * price.price,
    date: price.date
  })) : null;

  if (isLoading) {
    return (
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading results...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!portfolio || !priceData.length) {
    return (
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
        <View style={styles.noDataContainer}>
          <Ionicons name="analytics-outline" size={64} color="#8e8e93" />
          <Text style={styles.noDataTitle}>No Results Yet</Text>
          <Text style={styles.noDataText}>
            Run a trading simulation to see your performance results
          </Text>
        </View>
      </LinearGradient>
    );
  }

  const outperformance = buyHoldComparison 
    ? portfolio.totalReturnPercent - buyHoldComparison.totalReturnPercent 
    : 0;

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Performance Results</Text>
          <Text style={styles.subtitle}>Your strategy vs. buy & hold</Text>
        </View>

        {/* Performance Chart */}
        <ChartLine
          data={chartData}
          compareData={buyHoldChartData}
          title="Portfolio Performance Over Time"
          height={280}
        />

        {/* Performance Metrics */}
        <View style={styles.metricsContainer}>
          <Text style={styles.sectionTitle}>Performance Summary</Text>
          
          <MetricCard
            title="Your Strategy Return"
            value={`${portfolio.totalReturnPercent >= 0 ? '+' : ''}${portfolio.totalReturnPercent.toFixed(2)}%`}
            subtitle={formatCurrency(portfolio.totalReturn)}
            color={getPerformanceColor(portfolio.totalReturn)}
          />

          {buyHoldComparison && (
            <MetricCard
              title="Buy & Hold Return"
              value={`${buyHoldComparison.totalReturnPercent >= 0 ? '+' : ''}${buyHoldComparison.totalReturnPercent.toFixed(2)}%`}
              subtitle={formatCurrency(buyHoldComparison.totalReturn)}
              color={getPerformanceColor(buyHoldComparison.totalReturn)}
            />
          )}

          <MetricCard
            title="Outperformance"
            value={`${outperformance >= 0 ? '+' : ''}${outperformance.toFixed(2)}%`}
            subtitle={outperformance >= 0 ? 'You beat the market!' : 'Market beat your timing'}
            color={getPerformanceColor(outperformance)}
          />

          <MetricCard
            title="Total Trades"
            value={tradeHistory.length.toString()}
            subtitle="Executed during simulation"
            color="#4facfe"
          />
        </View>

        {/* Trade History Toggle */}
        <Pressable 
          style={styles.tradeToggle}
          onPress={() => setShowTrades(!showTrades)}
        >
          <Text style={styles.tradeToggleText}>
            {showTrades ? 'Hide' : 'Show'} Trade History
          </Text>
          <Ionicons 
            name={showTrades ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color="#4facfe" 
          />
        </Pressable>

        {/* Trade History */}
        {showTrades && (
          <View style={styles.tradeHistory}>
            <Text style={styles.sectionTitle}>Trade History</Text>
            {tradeHistory.length === 0 ? (
              <Text style={styles.noTradesText}>No trades executed</Text>
            ) : (
              tradeHistory.map((trade, index) => (
                <View key={index} style={styles.tradeItem}>
                  <View style={styles.tradeInfo}>
                    <View style={styles.tradeHeader}>
                      <Text style={[
                        styles.tradeAction,
                        { color: trade.action === 'buy' ? '#38ef7d' : '#ff6b6b' }
                      ]}>
                        {trade.action.toUpperCase()}
                      </Text>
                      <Text style={styles.tradeDate}>{formatDate(trade.date)}</Text>
                    </View>
                    <Text style={styles.tradeDetails}>
                      {formatCurrency(trade.amount)} at {formatCurrency(trade.price)}
                    </Text>
                    <Text style={styles.tradeShares}>
                      {trade.shares.toFixed(4)} shares • Cash: {formatCurrency(trade.cash)}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* Strategy Summary */}
        {strategy && (
          <View style={styles.strategySummary}>
            <Text style={styles.sectionTitle}>Strategy Used</Text>
            <Text style={styles.strategyText}>
              {strategy.action === 'buy' ? 'Bought' : 'Sold'} {formatCurrency(strategy.amount)} 
              {' '}on the {strategy.timing === 'first' ? 'first' : strategy.timing === 'middle' ? 'middle' : 'end'} of each month
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
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noDataTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  noDataText: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
    lineHeight: 22,
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
  metricsContainer: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    marginTop: 10,
  },
  tradeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.3)',
    marginVertical: 10,
    gap: 8,
  },
  tradeToggleText: {
    color: '#4facfe',
    fontSize: 16,
    fontWeight: '600',
  },
  tradeHistory: {
    marginTop: 10,
  },
  noTradesText: {
    color: '#8e8e93',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
  tradeItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tradeInfo: {
    flex: 1,
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  tradeAction: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  tradeDate: {
    fontSize: 12,
    color: '#8e8e93',
  },
  tradeDetails: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 2,
  },
  tradeShares: {
    fontSize: 12,
    color: '#8e8e93',
  },
  strategySummary: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  strategyText: {
    fontSize: 14,
    color: '#8e8e93',
    lineHeight: 20,
  },
});