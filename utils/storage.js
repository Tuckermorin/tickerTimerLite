// utils/storage.js
// Handles data persistence using Expo SecureStore

import * as SecureStore from 'expo-secure-store';

// Storage keys
const PORTFOLIO_KEY = 'portfolio_data';
const STRATEGY_KEY = 'trading_strategy';
const PRICE_DATA_KEY = 'price_data';
const TRADES_KEY = 'trade_history';

/**
 * Save portfolio data to secure storage
 */
export const savePortfolio = async (portfolioData) => {
  try {
    const dataString = JSON.stringify(portfolioData);
    await SecureStore.setItemAsync(PORTFOLIO_KEY, dataString);
    return true;
  } catch (error) {
    console.error('Error saving portfolio:', error);
    return false;
  }
};

/**
 * Load portfolio data from secure storage
 */
export const loadPortfolio = async () => {
  try {
    const dataString = await SecureStore.getItemAsync(PORTFOLIO_KEY);
    if (dataString) {
      return JSON.parse(dataString);
    }
    
    // Return default portfolio if none exists
    return {
      cash: 10000,
      shares: 0,
      totalValue: 10000,
      totalReturn: 0,
      totalReturnPercent: 0,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error loading portfolio:', error);
    return null;
  }
};

/**
 * Save trading strategy to secure storage
 */
export const saveStrategy = async (strategyData) => {
  try {
    const dataString = JSON.stringify(strategyData);
    await SecureStore.setItemAsync(STRATEGY_KEY, dataString);
    return true;
  } catch (error) {
    console.error('Error saving strategy:', error);
    return false;
  }
};

/**
 * Load trading strategy from secure storage
 */
export const loadStrategy = async () => {
  try {
    const dataString = await SecureStore.getItemAsync(STRATEGY_KEY);
    if (dataString) {
      return JSON.parse(dataString);
    }
    
    // Return default strategy if none exists
    return {
      action: 'buy',
      amount: 1000,
      timing: 'first',
      frequency: 1,
      isActive: false
    };
  } catch (error) {
    console.error('Error loading strategy:', error);
    return null;
  }
};

/**
 * Save price data to secure storage
 */
export const savePriceData = async (priceData) => {
  try {
    const dataString = JSON.stringify(priceData);
    await SecureStore.setItemAsync(PRICE_DATA_KEY, dataString);
    return true;
  } catch (error) {
    console.error('Error saving price data:', error);
    return false;
  }
};

/**
 * Load price data from secure storage
 */
export const loadPriceData = async () => {
  try {
    const dataString = await SecureStore.getItemAsync(PRICE_DATA_KEY);
    if (dataString) {
      return JSON.parse(dataString);
    }
    return null;
  } catch (error) {
    console.error('Error loading price data:', error);
    return null;
  }
};

/**
 * Save trade history to secure storage
 */
export const saveTradeHistory = async (trades) => {
  try {
    const dataString = JSON.stringify(trades);
    await SecureStore.setItemAsync(TRADES_KEY, dataString);
    return true;
  } catch (error) {
    console.error('Error saving trade history:', error);
    return false;
  }
};

/**
 * Load trade history from secure storage
 */
export const loadTradeHistory = async () => {
  try {
    const dataString = await SecureStore.getItemAsync(TRADES_KEY);
    if (dataString) {
      return JSON.parse(dataString);
    }
    return [];
  } catch (error) {
    console.error('Error loading trade history:', error);
    return [];
  }
};

/**
 * Clear all stored data (useful for reset functionality)
 */
export const clearAllData = async () => {
  try {
    await SecureStore.deleteItemAsync(PORTFOLIO_KEY);
    await SecureStore.deleteItemAsync(STRATEGY_KEY);
    await SecureStore.deleteItemAsync(PRICE_DATA_KEY);
    await SecureStore.deleteItemAsync(TRADES_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

/**
 * Check if data exists in storage
 */
export const hasStoredData = async () => {
  try {
    const portfolio = await SecureStore.getItemAsync(PORTFOLIO_KEY);
    return portfolio !== null;
  } catch (error) {
    console.error('Error checking stored data:', error);
    return false;
  }
};