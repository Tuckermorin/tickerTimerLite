// contexts/SettingsContext.js
// Global settings context for theme and currency management

import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    theme: 'dark', // 'dark' or 'light'
    currency: 'USD', // 'USD' or 'EUR'
  });

  // In a real app, you'd load/save from AsyncStorage or SecureStore
  // For this example, we'll just use in-memory state

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    // Here you would save to persistent storage
    // await SecureStore.setItemAsync('userSettings', JSON.stringify(newSettings));
  };

  const formatCurrency = (value, options = {}) => {
    const {
      currency = settings.currency,
      minimumFractionDigits = 0,
      maximumFractionDigits = 0,
    } = options;

    // Convert USD to EUR if needed (using a mock exchange rate)
    const exchangeRate = 0.85; // Mock EUR/USD rate
    const displayValue = currency === 'EUR' && settings.currency === 'EUR' 
      ? value * exchangeRate 
      : value;

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(displayValue);
  };

  const getThemeColors = () => {
    if (settings.theme === 'light') {
      return {
        background: ['#f8f9fa', '#e9ecef'],
        text: '#212529',
        textSecondary: '#6c757d',
        cardBackground: '#fff',
        borderColor: 'rgba(0,0,0,0.08)',
        shadowColor: '#000',
      };
    }
    
    return {
      background: ['#1a1a2e', '#16213e'],
      text: '#fff',
      textSecondary: '#8e8e93',
      cardBackground: 'rgba(255,255,255,0.05)',
      borderColor: 'rgba(255,255,255,0.1)',
      shadowColor: '#000',
    };
  };

  const value = {
    settings,
    updateSettings,
    formatCurrency,
    getThemeColors,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};