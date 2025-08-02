// components/MarketData.js
import React from 'react';
import { View, Text, Animated } from 'react-native';
import { gameStyles } from '../styles/gameStyles';

export default function MarketData({
  gameMode,
  stockMetadata,
  priceAnimations,
  monthlyChanges,
  currentPrices,
  formatPercentage,
  formatCurrency,
}) {
  if (gameMode === 'diversified') {
    return (
      <View style={gameStyles.stocksSection}>
        <Text style={gameStyles.sectionTitle}>Market Prices</Text>
        <View style={gameStyles.stocksGrid}>
          {Object.keys(stockMetadata).map(symbol => (
            <Animated.View
              key={symbol}
              style={[
                gameStyles.stockCard,
                {
                  transform: priceAnimations.current[symbol]
                    ? [
                        {
                          translateY: priceAnimations.current[symbol].interpolate({
                            inputRange: [-0.1, 0, 0.1],
                            outputRange: [5, 0, -5],
                          }),
                        },
                      ]
                    : [],
                },
              ]}
            >
              <View style={gameStyles.stockHeader}>
                <Text style={gameStyles.stockSymbol}>{symbol}</Text>
                <Text
                  style={[
                    gameStyles.stockChange,
                    { color: (monthlyChanges[symbol] || 0) >= 0 ? '#38ef7d' : '#ff6b6b' },
                  ]}
                >
                  {formatPercentage(monthlyChanges[symbol] || 0)}
                </Text>
              </View>
              <Text style={gameStyles.stockPrice}>
                {formatCurrency(currentPrices[symbol] || 0)}
              </Text>
              <Text style={gameStyles.stockName}>
                {stockMetadata[symbol].name}
              </Text>
            </Animated.View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        gameStyles.marketSection,
        {
          transform: priceAnimations.current.SP500
            ? [
                {
                  translateY: priceAnimations.current.SP500.interpolate({
                    inputRange: [-0.1, 0, 0.1],
                    outputRange: [5, 0, -5],
                  }),
                },
              ]
            : [],
        },
      ]}
    >
      <Text style={gameStyles.sectionTitle}>S&P 500</Text>
      <Text style={gameStyles.marketPrice}>
        {formatCurrency(currentPrices.SP500 || 0)}
      </Text>
      <Text
        style={[
          gameStyles.marketChange,
          { color: (monthlyChanges.SP500 || 0) >= 0 ? '#38ef7d' : '#ff6b6b' },
        ]}
      >
        {formatPercentage(monthlyChanges.SP500 || 0)} this month
      </Text>
    </Animated.View>
  );
}

