// app/game.js
// Main game screen with monthly S&P 500 cycling

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { gameStyles } from '../styles/gameStyles';
import { getRandomPeriod } from '../utils/fullHistoricalData';

export default function GameScreen() {
  const router = useRouter();
  const intervalRef = useRef(null);
  
  // Game state
  const [gameData, setGameData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  
  // Player portfolio state
  const [playerCash, setPlayerCash] = useState(0);
  const [playerShares, setPlayerShares] = useState(0);
  const [buyHoldShares, setBuyHoldShares] = useState(0);
  const [isInvested, setIsInvested] = useState(true); // Start invested
  
  // Current market data
  const [currentPrice, setCurrentPrice] = useState(0);
  const [previousPrice, setPreviousPrice] = useState(0);
  const [monthlyChange, setMonthlyChange] = useState(0);

  // Initialize game data on component mount
  useEffect(() => {
    initializeGame();
  }, []);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const initializeGame = () => {
    // Get random 30-year period (360 months)
    const selectedData = getRandomPeriod();
    
    setGameData(selectedData);
    
    // Initialize player portfolio
    const startingPrice = selectedData[0].value;
    const startingShares = 10000 / startingPrice;
    
    setPlayerShares(startingShares);
    setBuyHoldShares(startingShares);
    setPlayerCash(0);
    setIsInvested(true);
    setCurrentPrice(startingPrice);
    setPreviousPrice(startingPrice);
    setCurrentMonth(0);
    setGameComplete(false);
  };

  const startGame = () => {
    if (gameData.length === 0) return;
    
    setIsPlaying(true);
    setIsPaused(false);
    
    intervalRef.current = setInterval(() => {
      setCurrentMonth(prev => {
        const nextMonth = prev + 1;
        
        // Check if it's a new year (every 12 months) and not the first month
        const isNewYear = nextMonth > 0 && (nextMonth % 12) === 0;

        if (isNewYear) {
          if (isInvested) {
            // If invested, automatically invest the $5000 bonus
            const bonusShares = 5000 / currentPrice;
            setPlayerShares(currentShares => currentShares + bonusShares);
          } else {
            // If in cash, add $5000 to cash
            setPlayerCash(currentCash => currentCash + 5000);
          }
          
          // Also add $5000 to buy-and-hold strategy
          setBuyHoldShares(currentShares => currentShares + (5000 / currentPrice));
        }

        if (nextMonth >= gameData.length) {
          // Game complete
          setIsPlaying(false);
          setGameComplete(true);
          clearInterval(intervalRef.current);
          
          // Navigate to results after a brief delay
          setTimeout(() => {
            // Calculate final values
            const finalPlayerValue = (playerCash + (playerShares * currentPrice));
            const finalBuyHoldValue = buyHoldShares * currentPrice;
            const playerReturn = ((finalPlayerValue - 10000) / 10000) * 100;
            const buyHoldReturn = ((finalBuyHoldValue - 10000) / 10000) * 100;

            router.push({
              pathname: '/results',
              params: {
                playerValue: finalPlayerValue,
                buyHoldValue: finalBuyHoldValue,
                playerReturn: playerReturn,
                buyHoldReturn: buyHoldReturn,
                didWin: finalPlayerValue > finalBuyHoldValue
              }
            });
          }, 2000);
          
          return prev;
        }
        
        // Update market data
        const newPrice = gameData[nextMonth].value;
        const oldPrice = gameData[nextMonth - 1].value;
        const change = ((newPrice - oldPrice) / oldPrice) * 100;
        
        setCurrentPrice(newPrice);

        // Check for annual bonus display
        if (nextMonth > 0 && (nextMonth % 12) === 0) {
          // Optional: You could add a toast notification here later
          console.log(`💰 Year ${Math.floor(nextMonth / 12) + 1} Bonus: +$5000!`);
        }

        setPreviousPrice(oldPrice);
        setMonthlyChange(change);
        
        return nextMonth;
      });
    }, 1000); // 1 second per month
  };

  const pauseGame = () => {
    setIsPaused(true);
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resumeGame = () => {
    setIsPaused(false);
    startGame();
  };

  const goToMenu = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    Alert.alert(
      "Return to Menu",
      "Are you sure? Your current game will be lost.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => router.push('/') }
      ]
    );
  };

  const buyAll = () => {
    if (!isInvested && playerCash > 0) {
      const sharesCanBuy = playerCash / currentPrice;
      setPlayerShares(sharesCanBuy);
      setPlayerCash(0);
      setIsInvested(true);
    }
  };

  const sellAll = () => {
    if (isInvested && playerShares > 0) {
      const cashFromSale = playerShares * currentPrice;
      setPlayerCash(cashFromSale);
      setPlayerShares(0);
      setIsInvested(false);
    }
  };

  // Calculate current portfolio value
  const currentPortfolioValue = isInvested 
    ? playerShares * currentPrice 
    : playerCash;

  // Calculate buy-and-hold comparison
  const buyHoldValue = buyHoldShares * currentPrice;

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  if (gameData.length === 0) {
    return (
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={gameStyles.container}>
        <View style={gameStyles.loadingContainer}>
          <Text style={gameStyles.loadingText}>Loading game data...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={gameStyles.container}>
      <View style={gameStyles.content}>
        
        {/* Game Progress */}
        <View style={gameStyles.progressSection}>
          <Text style={gameStyles.progressTitle}>
            Year {Math.floor(currentMonth / 12) + 1} of 30
          </Text>
          <Text style={gameStyles.progressSubtitle}>
            Month {(currentMonth % 12) + 1} • {gameData[currentMonth]?.date}
          </Text>
          <View style={gameStyles.progressBar}>
            <View 
              style={[
                gameStyles.progressFill, 
                { width: `${(currentMonth / 360) * 100}%` }
              ]} 
            />
          </View>
        </View>

        {/* Market Data */}
        <View style={gameStyles.marketSection}>
          <Text style={gameStyles.sectionTitle}>S&P 500</Text>
          <Text style={gameStyles.marketPrice}>{formatCurrency(currentPrice)}</Text>
          <Text style={[
            gameStyles.marketChange,
            { color: monthlyChange >= 0 ? '#38ef7d' : '#ff6b6b' }
          ]}>
            {formatPercentage(monthlyChange)} this month
          </Text>
        </View>

        {/* Player Portfolio */}
        <View style={gameStyles.portfolioSection}>
          <Text style={gameStyles.sectionTitle}>Your Portfolio</Text>
          
          <View style={gameStyles.portfolioGrid}>
            <View style={gameStyles.portfolioCard}>
              <Text style={gameStyles.portfolioLabel}>Current Value</Text>
              <Text style={gameStyles.portfolioValue}>
                {formatCurrency(currentPortfolioValue)}
              </Text>
            </View>
            
            <View style={gameStyles.portfolioCard}>
              <Text style={gameStyles.portfolioLabel}>Position</Text>
              <Text style={[
                gameStyles.portfolioPosition,
                { color: isInvested ? '#38ef7d' : '#4facfe' }
              ]}>
                {isInvested ? 'INVESTED' : 'CASH'}
              </Text>
            </View>
          </View>

          <View style={gameStyles.portfolioDetails}>
            <Text style={gameStyles.portfolioDetail}>
              Cash: {formatCurrency(playerCash)}
            </Text>
            <Text style={gameStyles.portfolioDetail}>
              Shares: {playerShares.toFixed(4)}
            </Text>
            <Text style={gameStyles.portfolioDetail}>
              vs Buy & Hold: {formatCurrency(buyHoldValue)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        {isPlaying && (
          <View style={gameStyles.actionSection}>
            <Pressable 
              style={[
                gameStyles.actionButton, 
                gameStyles.buyButton,
                { opacity: isInvested ? 0.5 : 1 }
              ]}
              onPress={buyAll}
              disabled={isInvested}
            >
              <Ionicons name="trending-up" size={20} color="#fff" />
              <Text style={gameStyles.actionButtonText}>BUY ALL</Text>
            </Pressable>
            
            <Pressable 
              style={[
                gameStyles.actionButton, 
                gameStyles.sellButton,
                { opacity: !isInvested ? 0.5 : 1 }
              ]}
              onPress={sellAll}
              disabled={!isInvested}
            >
              <Ionicons name="trending-down" size={20} color="#fff" />
              <Text style={gameStyles.actionButtonText}>SELL ALL</Text>
            </Pressable>
          </View>
        )}

        {/* Game Controls */}
        <View style={gameStyles.controlSection}>
          {!isPlaying && !gameComplete && (
            <Pressable style={gameStyles.controlButton} onPress={startGame}>
              <Ionicons name="play" size={20} color="#fff" />
              <Text style={gameStyles.controlButtonText}>
                {isPaused ? 'Resume' : 'Start Game'}
              </Text>
            </Pressable>
          )}
          
          {isPlaying && (
            <Pressable style={gameStyles.controlButton} onPress={pauseGame}>
              <Ionicons name="pause" size={20} color="#fff" />
              <Text style={gameStyles.controlButtonText}>Pause</Text>
            </Pressable>
          )}
          
          <Pressable style={gameStyles.menuButton} onPress={goToMenu}>
            <Ionicons name="home" size={20} color="#fff" />
            <Text style={gameStyles.menuButtonText}>Menu</Text>
          </Pressable>
        </View>

        {gameComplete && (
          <View style={gameStyles.completeSection}>
            <Text style={gameStyles.completeTitle}>Game Complete!</Text>
            <Text style={gameStyles.completeText}>
              Redirecting to results...
            </Text>
          </View>
        )}

      </View>
    </LinearGradient>
  );
}