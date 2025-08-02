// components/PortfolioSummary.js
import React from 'react';
import { View, Text, Animated } from 'react-native';
import { gameStyles } from '../styles/gameStyles';

export default function PortfolioSummary({ formatCurrency, getCurrentPortfolioValue, getBuyHoldValue }) {
  return (
    <View style={gameStyles.portfolioSection}>
      <Text style={gameStyles.sectionTitle}>Your Portfolio</Text>
      <View style={gameStyles.portfolioGrid}>
        <View style={gameStyles.portfolioCard}>
          <Text style={gameStyles.portfolioLabel}>Current Value</Text>
          <Animated.Text style={gameStyles.portfolioValue}>
            {formatCurrency(getCurrentPortfolioValue())}
          </Animated.Text>
        </View>
        <View style={gameStyles.portfolioCard}>
          <Text style={gameStyles.portfolioLabel}>vs Buy & Hold</Text>
          <Animated.Text style={gameStyles.portfolioValue}>
            {formatCurrency(getBuyHoldValue())}
          </Animated.Text>
        </View>
      </View>
    </View>
  );
}

