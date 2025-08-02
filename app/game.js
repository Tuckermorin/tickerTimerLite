// app/game.js
// Main game screen with React Native Animated API integration - CORRECTED VERSION with Settings

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { gameStyles } from '../styles/gameStyles';
import { getRandomPeriod } from '../utils/fullHistoricalData';
import { getRandomMultiStockPeriod, stockMetadata, getStockColor } from '../utils/stockData';
import { createEventEngine, formatEventForDisplay } from '../utils/eventEngine';
import NewsFlash from '../components/NewsFlash';
import CustomModal from '../components/CustomModal';
import { useSettings } from '../contexts/SettingsContext';

export default function GameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { settings, formatCurrency, getThemeColors } = useSettings();
  const themeColors = getThemeColors();
  const intervalRef = useRef(null);
  const eventEngineRef = useRef(null);
  
  // Animation refs
  const priceAnimations = useRef({});
  const portfolioValueAnim = useRef(new Animated.Value(0)).current;
  const buyHoldValueAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  
  // Get game parameters from setup
  const gameMode = params.mode || 'classic';
  const hasEconomicEvents = params.economicEvents === 'true';
  // News flashes are now consolidated with economic events
  const hasNewsFlashes = hasEconomicEvents;
  
  // Calculate game length based on mode
  const gameLength = gameMode === 'speedrun' ? 120 : 240; // 10 or 20 years in months
  const gameYears = gameMode === 'speedrun' ? 10 : 20;
  const gameSpeed = gameMode === 'speedrun' ? 500 : 1000; // milliseconds per month
  
  // Game state
  const [gameData, setGameData] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showBonusNotification, setShowBonusNotification] = useState(false);
  
  // Economic events state
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showNewsFlash, setShowNewsFlash] = useState(false);
  const [eventHistory, setEventHistory] = useState([]);
  
  // Modal state
  const [showExitModal, setShowExitModal] = useState(false);
  
  // Portfolio state for diversified mode
  const [portfolio, setPortfolio] = useState({
    SP500: { shares: 0, cash: 0 },
    AAPL: { shares: 0, cash: 0 },
    JPM: { shares: 0, cash: 0 },
    TGT: { shares: 0, cash: 0 },
    UNH: { shares: 0, cash: 0 }
  });
  
  // Buy-and-hold reference portfolio
  const [buyHoldPortfolio, setBuyHoldPortfolio] = useState({
    SP500: { shares: 0 },
    AAPL: { shares: 0 },
    JPM: { shares: 0 },
    TGT: { shares: 0 },
    UNH: { shares: 0 }
  });
  
  // Classic mode state (backwards compatibility)
  const [playerCash, setPlayerCash] = useState(0);
  const [playerShares, setPlayerShares] = useState(0);
  const [buyHoldShares, setBuyHoldShares] = useState(0);
  const [isInvested, setIsInvested] = useState(true);
  
  // Current market data
  const [currentPrices, setCurrentPrices] = useState({});
  const [previousPrices, setPreviousPrices] = useState({});
  const [monthlyChanges, setMonthlyChanges] = useState({});

  // Initialize price animations
  useEffect(() => {
    const symbols = gameMode === 'diversified' ? Object.keys(stockMetadata) : ['SP500'];
    symbols.forEach(symbol => {
      priceAnimations.current[symbol] = new Animated.Value(0);
    });
  }, [gameMode]);

  // Animate portfolio values when they change
  useEffect(() => {
    // Use requestAnimationFrame to defer animations until after render
    const animateValues = () => {
      const currentValue = getCurrentPortfolioValue();
      const buyHoldValue = getBuyHoldValue();
      
      animatePortfolioValue(portfolioValueAnim, currentValue);
      animatePortfolioValue(buyHoldValueAnim, buyHoldValue);
    };

    // Defer animation to next frame
    const animationFrame = requestAnimationFrame(animateValues);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [currentPrices, portfolio, buyHoldPortfolio, playerCash, playerShares]);

  // Animate progress bar
  useEffect(() => {
    // Defer animation to prevent render phase updates
    const animateProgress = () => {
      Animated.timing(progressAnim, {
        toValue: currentMonth / gameLength,
        duration: 300,
        useNativeDriver: false,
      }).start();
    };

    const animationFrame = requestAnimationFrame(animateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, [currentMonth, gameLength]);

  // Pulse animation for when game is playing
  useEffect(() => {
    if (isPlaying) {
      // Defer animation start to prevent render phase updates
      const startPulse = () => {
        const pulse = Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.05,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        );
        pulse.start();
        return pulse;
      };

      const animationFrame = requestAnimationFrame(() => {
        const pulse = startPulse();
        return () => pulse.stop();
      });
      
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [isPlaying]);

  const animatePortfolioValue = (animatedValue, targetValue) => {
    // Defer animation to prevent render phase updates
    requestAnimationFrame(() => {
      Animated.spring(animatedValue, {
        toValue: targetValue,
        tension: 100,
        friction: 8,
        useNativeDriver: false,
      }).start();
    });
  };

  const animatePriceChange = (symbol, newPrice, oldPrice) => {
    // Defer animation to prevent render phase updates
    requestAnimationFrame(() => {
      const change = newPrice - oldPrice;
      const direction = change >= 0 ? 1 : -1;
      
      if (priceAnimations.current[symbol]) {
        Animated.sequence([
          Animated.timing(priceAnimations.current[symbol], {
            toValue: direction * 0.1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(priceAnimations.current[symbol], {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });
  };

  const animateButtonPress = (callback) => {
    // Defer animation to prevent render phase updates
    requestAnimationFrame(() => {
      Animated.sequence([
        Animated.timing(buttonScaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (callback) callback();
      });
    });
  };

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
    if (gameMode === 'diversified') {
      // Get multi-stock data
      const selectedData = getRandomMultiStockPeriod(gameMode);
      setGameData(selectedData);
      
      // Initialize event engine with S&P 500 data for consistency
      if (hasEconomicEvents) {
        eventEngineRef.current = createEventEngine(selectedData.SP500, gameMode, hasEconomicEvents);
      }
      
      // Initialize diversified portfolio - equal allocation across 5 stocks
      const initialAllocation = 10000 / 5; // $2000 per stock
      const initialPortfolio = {};
      const initialBuyHold = {};
      const initialPrices = {};
      
      Object.keys(selectedData).forEach(symbol => {
        const startingPrice = selectedData[symbol][0].value;
        const shares = initialAllocation / startingPrice;
        
        initialPortfolio[symbol] = { shares, cash: 0 };
        initialBuyHold[symbol] = { shares };
        initialPrices[symbol] = startingPrice;
      });
      
      setPortfolio(initialPortfolio);
      setBuyHoldPortfolio(initialBuyHold);
      setCurrentPrices(initialPrices);
      setPreviousPrices(initialPrices);
      
    } else {
      // Classic and speedrun modes - single stock (S&P 500)
      const selectedData = getRandomPeriod(gameMode);
      setGameData(selectedData);
      
      // Initialize event engine with S&P 500 data
      if (hasEconomicEvents) {
        eventEngineRef.current = createEventEngine(selectedData, gameMode, hasEconomicEvents);
      }
      
      const startingPrice = selectedData[0].value;
      const startingShares = 10000 / startingPrice;
      
      setPlayerShares(startingShares);
      setBuyHoldShares(startingShares);
      setPlayerCash(0);
      setIsInvested(true);
      setCurrentPrices({ SP500: startingPrice });
      setPreviousPrices({ SP500: startingPrice });
    }
    
    setCurrentMonth(0);
    setGameComplete(false);
    setEventHistory([]);
  };

  const checkForEconomicEvents = (month) => {
    if (!eventEngineRef.current || !hasEconomicEvents) return;
    
    console.log(`Checking for events at month ${month}`);
    const event = eventEngineRef.current.checkForEvents(month);
    
    if (event) {
      const formattedEvent = formatEventForDisplay(event);
      console.log('Event triggered:', formattedEvent);
      
      // Add to event history
      setEventHistory(prev => [...prev, formattedEvent]);
      
      // Always show economic events as news flash (consolidated system)
      console.log('Setting news flash state:', formattedEvent);
      setCurrentEvent(formattedEvent);
      setShowNewsFlash(true);
      console.log('News flash state set - showNewsFlash should be true');
      
      // CRITICAL: Pause the game while showing news flash
      console.log('Pausing game for news flash...');
      setIsPlaying(false);
      if (intervalRef.current) {
        console.log('Clearing game interval');
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const dismissNewsFlash = () => {
    console.log('Dismissing news flash and resuming game...');
    setShowNewsFlash(false);
    setCurrentEvent(null);
    
    // Resume the game after news flash - but only if it wasn't manually paused
    if (!isPaused && !gameComplete) {
      console.log('Resuming game after news flash dismissal');
      // Small delay to ensure state is updated before restarting
      setTimeout(() => {
        setIsPlaying(true);
        startGame();
      }, 200);
    }
  };

  const handleNewsFlashBuy = () => {
    if ((gameMode === 'classic' || gameMode === 'speedrun') && !isInvested && playerCash > 0) {
      const sharesCanBuy = playerCash / currentPrices.SP500;
      setPlayerShares(sharesCanBuy);
      setPlayerCash(0);
      setIsInvested(true);
      console.log('Bought all shares from news flash');
    } else if (gameMode === 'diversified') {
      // For diversified mode, move all cash into stocks
      setPortfolio(currentPortfolio => {
        const updatedPortfolio = { ...currentPortfolio };
        Object.keys(updatedPortfolio).forEach(symbol => {
          const totalCash = updatedPortfolio[symbol].cash;
          if (totalCash > 0) {
            const additionalShares = totalCash / currentPrices[symbol];
            updatedPortfolio[symbol] = {
              shares: updatedPortfolio[symbol].shares + additionalShares,
              cash: 0
            };
          }
        });
        return updatedPortfolio;
      });
    }
  };

  const handleNewsFlashSell = () => {
    if ((gameMode === 'classic' || gameMode === 'speedrun') && isInvested && playerShares > 0) {
      const cashFromSale = playerShares * currentPrices.SP500;
      setPlayerCash(cashFromSale);
      setPlayerShares(0);
      setIsInvested(false);
      console.log('Sold all shares from news flash');
    } else if (gameMode === 'diversified') {
      // For diversified mode, convert all shares to cash
      setPortfolio(currentPortfolio => {
        const updatedPortfolio = { ...currentPortfolio };
        Object.keys(updatedPortfolio).forEach(symbol => {
          const totalValue = updatedPortfolio[symbol].shares * currentPrices[symbol];
          updatedPortfolio[symbol] = {
            shares: 0,
            cash: updatedPortfolio[symbol].cash + totalValue
          };
        });
        return updatedPortfolio;
      });
    }
  };

  const startGame = () => {
    if (!gameData) return;
    
    // Clear any existing interval to prevent multiple intervals
    if (intervalRef.current) {
      console.log('Clearing existing interval before starting new one');
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    animateButtonPress(() => {
      setIsPlaying(true);
      setIsPaused(false);
      
      console.log(`Starting game interval with ${gameSpeed}ms speed`);
      intervalRef.current = setInterval(() => {
        setCurrentMonth(prev => {
          const nextMonth = prev + 1;
          
          // Check for economic events
          checkForEconomicEvents(nextMonth);
          
          // Check if it's a new year (every 12 months) and not the first month
          const isNewYear = nextMonth > 0 && (nextMonth % 12) === 0;

          if (isNewYear) {
            console.log(`Year ${Math.floor(nextMonth / 12)} completed - adding $5000 bonus`);
            // Add $5000 annual bonus
            if (gameMode === 'diversified') {
              // Distribute $1000 to each of 5 stocks
              console.log('Adding $5000 bonus to diversified portfolio ($1000 per stock)');
              setPortfolio(currentPortfolio => {
                const updatedPortfolio = { ...currentPortfolio };
                Object.keys(updatedPortfolio).forEach(symbol => {
                  const currentPrice = currentPrices[symbol];
                  const bonusShares = 1000 / currentPrice;
                  console.log(`Adding ${bonusShares} shares of ${symbol} at ${currentPrice}`);
                  updatedPortfolio[symbol] = {
                    ...updatedPortfolio[symbol],
                    shares: updatedPortfolio[symbol].shares + bonusShares
                  };
                });
                return updatedPortfolio;
              });
              
              setBuyHoldPortfolio(currentBuyHold => {
                const updatedBuyHold = { ...currentBuyHold };
                Object.keys(updatedBuyHold).forEach(symbol => {
                  const currentPrice = currentPrices[symbol];
                  const bonusShares = 1000 / currentPrice;
                  updatedBuyHold[symbol] = {
                    shares: updatedBuyHold[symbol].shares + bonusShares
                  };
                });
                return updatedBuyHold;
              });
              
            } else {
              // Classic and speedrun modes
              console.log('Adding $5000 bonus to classic/speedrun portfolio');
              if (isInvested) {
                const bonusShares = 5000 / currentPrices.SP500;
                console.log(`Adding ${bonusShares} shares of S&P 500 at ${currentPrices.SP500}`);
                setPlayerShares(currentShares => currentShares + bonusShares);
              } else {
                console.log('Adding $5000 cash (player not invested)');
                setPlayerCash(currentCash => currentCash + 5000);
              }
              const buyHoldBonusShares = 5000 / currentPrices.SP500;
              console.log(`Adding ${buyHoldBonusShares} shares to buy-hold portfolio`);
              setBuyHoldShares(currentShares => currentShares + buyHoldBonusShares);
            }
          }

          if (nextMonth >= gameLength) {
            // Game complete
            setIsPlaying(false);
            setGameComplete(true);
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            
            // Navigate to results after a brief delay
            setTimeout(() => {
              navigateToResults();
            }, 2000);
            
            return prev;
          }
          
          // Update market data with animations
          if (gameMode === 'diversified') {
            const newPrices = {};
            const newChanges = {};
            
            Object.keys(gameData).forEach(symbol => {
              const newPrice = gameData[symbol][nextMonth].value;
              const oldPrice = gameData[symbol][nextMonth - 1].value;
              const change = ((newPrice - oldPrice) / oldPrice) * 100;
              
              newPrices[symbol] = newPrice;
              newChanges[symbol] = change;
              
              // Animate price change
              animatePriceChange(symbol, newPrice, oldPrice);
            });
            
            setCurrentPrices(newPrices);
            setPreviousPrices(prev => ({ ...prev, ...Object.fromEntries(
              Object.keys(gameData).map(symbol => [symbol, gameData[symbol][nextMonth - 1].value])
            )}));
            setMonthlyChanges(newChanges);
            
          } else {
            // Classic and speedrun modes
            const newPrice = gameData[nextMonth].value;
            const oldPrice = gameData[nextMonth - 1].value;
            const change = ((newPrice - oldPrice) / oldPrice) * 100;
            
            // Animate price change
            animatePriceChange('SP500', newPrice, oldPrice);
            
            setCurrentPrices({ SP500: newPrice });
            setPreviousPrices({ SP500: oldPrice });
            setMonthlyChanges({ SP500: change });
          }
          
          return nextMonth;
        });
      }, gameSpeed);
    });
  };

  const navigateToResults = () => {
    let finalPlayerValue, finalBuyHoldValue;
    
    if (gameMode === 'diversified') {
      // Calculate total portfolio values
      finalPlayerValue = Object.keys(portfolio).reduce((total, symbol) => {
        return total + (portfolio[symbol].shares * currentPrices[symbol]) + portfolio[symbol].cash;
      }, 0);
      
      finalBuyHoldValue = Object.keys(buyHoldPortfolio).reduce((total, symbol) => {
        return total + (buyHoldPortfolio[symbol].shares * currentPrices[symbol]);
      }, 0);
      
    } else {
      // Classic mode
      finalPlayerValue = (playerCash + (playerShares * currentPrices.SP500));
      finalBuyHoldValue = buyHoldShares * currentPrices.SP500;
    }
    
    const playerReturn = ((finalPlayerValue - 10000) / 10000) * 100;
    const buyHoldReturn = ((finalBuyHoldValue - 10000) / 10000) * 100;

    router.push({
      pathname: '/results',
      params: {
        playerValue: finalPlayerValue,
        buyHoldValue: finalBuyHoldValue,
        playerReturn: playerReturn,
        buyHoldReturn: buyHoldReturn,
        didWin: finalPlayerValue > finalBuyHoldValue,
        gameMode: gameMode,
        gameYears: gameYears,
        eventsTriggered: eventHistory.length
      }
    });
  };

  const pauseGame = () => {
    animateButtonPress(() => {
      setIsPaused(true);
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    });
  };

  const resumeGame = () => {
    animateButtonPress(() => {
      setIsPaused(false);
      startGame();
    });
  };

  const goToMenu = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setShowExitModal(true);
  };

  // Buy/sell functions for all modes
  const buyAll = () => {
    animateButtonPress(() => {
      if (gameMode === 'classic' || gameMode === 'speedrun') {
        // Classic and speedrun both use single S&P 500 stock
        if (!isInvested && playerCash > 0) {
          const sharesCanBuy = playerCash / currentPrices.SP500;
          setPlayerShares(sharesCanBuy);
          setPlayerCash(0);
          setIsInvested(true);
        }
      } else if (gameMode === 'diversified') {
        // For diversified mode, move all cash into stocks
        setPortfolio(currentPortfolio => {
          const updatedPortfolio = { ...currentPortfolio };
          Object.keys(updatedPortfolio).forEach(symbol => {
            const totalCash = updatedPortfolio[symbol].cash;
            if (totalCash > 0) {
              const additionalShares = totalCash / currentPrices[symbol];
              updatedPortfolio[symbol] = {
                shares: updatedPortfolio[symbol].shares + additionalShares,
                cash: 0
              };
            }
          });
          return updatedPortfolio;
        });
      }
    });
  };

  const sellAll = () => {
    animateButtonPress(() => {
      if (gameMode === 'classic' || gameMode === 'speedrun') {
        // Classic and speedrun both use single S&P 500 stock
        if (isInvested && playerShares > 0) {
          const cashFromSale = playerShares * currentPrices.SP500;
          setPlayerCash(cashFromSale);
          setPlayerShares(0);
          setIsInvested(false);
        }
      } else if (gameMode === 'diversified') {
        // For diversified mode, convert all shares to cash
        setPortfolio(currentPortfolio => {
          const updatedPortfolio = { ...currentPortfolio };
          Object.keys(updatedPortfolio).forEach(symbol => {
            const totalValue = updatedPortfolio[symbol].shares * currentPrices[symbol];
            updatedPortfolio[symbol] = {
              shares: 0,
              cash: updatedPortfolio[symbol].cash + totalValue
            };
          });
          return updatedPortfolio;
        });
      }
    });
  };

  // Check if user can buy/sell
  const canBuy = () => {
    if (gameMode === 'classic' || gameMode === 'speedrun') {
      return !isInvested && playerCash > 0;
    } else if (gameMode === 'diversified') {
      return Object.values(portfolio).some(stock => stock.cash > 0);
    }
    return false;
  };

  const canSell = () => {
    if (gameMode === 'classic' || gameMode === 'speedrun') {
      return isInvested && playerShares > 0;
    } else if (gameMode === 'diversified') {
      return Object.values(portfolio).some(stock => stock.shares > 0);
    }
    return false;
  };

  // Calculate current portfolio value
  const getCurrentPortfolioValue = () => {
    if (gameMode === 'diversified') {
      return Object.keys(portfolio).reduce((total, symbol) => {
        return total + (portfolio[symbol].shares * currentPrices[symbol]) + portfolio[symbol].cash;
      }, 0);
    } else {
      return isInvested ? playerShares * currentPrices.SP500 : playerCash;
    }
  };

  // Calculate buy-and-hold comparison
  const getBuyHoldValue = () => {
    if (gameMode === 'diversified') {
      return Object.keys(buyHoldPortfolio).reduce((total, symbol) => {
        return total + (buyHoldPortfolio[symbol].shares * currentPrices[symbol]);
      }, 0);
    } else {
      return buyHoldShares * currentPrices.SP500;
    }
  };

  // Format percentage
  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  // Generate a random month name to hide the actual date
  const getRandomMonthName = (monthIndex) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex % 12];
  };

  if (!gameData) {
    return (
      <LinearGradient colors={themeColors.background} style={gameStyles.container}>
        <Animated.View style={[gameStyles.loadingContainer, {
          transform: [{ scale: pulseAnim }]
        }]}>
          <Text style={gameStyles.loadingText}>Loading game data...</Text>
        </Animated.View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={themeColors.background} style={gameStyles.container}>
      <ScrollView style={gameStyles.content} showsVerticalScrollIndicator={false}>
        
        {/* Game Progress */}
        <View style={gameStyles.progressSection}>
          <Animated.Text style={[gameStyles.progressTitle, {
            transform: [{ scale: isPlaying ? pulseAnim : 1 }]
          }]}>
            Year {Math.floor(currentMonth / 12) + 1} of {gameYears}
          </Animated.Text>
          <Text style={gameStyles.progressSubtitle}>
            {getRandomMonthName(currentMonth)}
            {gameMode === 'speedrun' && ' • 2x Speed'}
          </Text>
          <View style={gameStyles.progressBar}>
            <Animated.View 
              style={[
                gameStyles.progressFill, 
                { 
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  })
                }
              ]} 
            />
          </View>
        </View>

        {/* Game Mode Badge */}
        <View style={gameStyles.modeSection}>
          <Text style={gameStyles.modeText}>
            {gameMode === 'classic' && '📈 Classic Mode'}
            {gameMode === 'diversified' && '📊 Diversified Mode'}
            {gameMode === 'speedrun' && '⚡ Speed Run Mode'}
            {hasEconomicEvents && ' • Economic Events'}
          </Text>
        </View>

        {/* Annual Bonus Notification */}
        {showBonusNotification && (
          <Animated.View style={[gameStyles.bonusNotification, {
            transform: [{ scale: pulseAnim }]
          }]}>
            <Ionicons name="gift" size={20} color="#38ef7d" />
            <Text style={gameStyles.bonusText}>
              💰 Annual Bonus: {formatCurrency(5000)} Added!
            </Text>
          </Animated.View>
        )}

        {/* Event History Counter */}
        {hasEconomicEvents && eventHistory.length > 0 && (
          <Animated.View style={[gameStyles.eventCounter, {
            transform: [{ scale: pulseAnim }]
          }]}>
            <Ionicons name="newspaper" size={16} color="#4facfe" />
            <Text style={gameStyles.eventCounterText}>
              {eventHistory.length} economic event{eventHistory.length !== 1 ? 's' : ''} occurred
            </Text>
          </Animated.View>
        )}

        {/* Market Data */}
        {gameMode === 'diversified' ? (
          <View style={gameStyles.stocksSection}>
            <Text style={gameStyles.sectionTitle}>Market Prices</Text>
            <View style={gameStyles.stocksGrid}>
              {Object.keys(stockMetadata).map(symbol => (
                <Animated.View 
                  key={symbol} 
                  style={[gameStyles.stockCard, {
                    transform: priceAnimations.current[symbol] ? [{
                      translateY: priceAnimations.current[symbol].interpolate({
                        inputRange: [-0.1, 0, 0.1],
                        outputRange: [5, 0, -5]
                      })
                    }] : []
                  }]}
                >
                  <View style={gameStyles.stockHeader}>
                    <Text style={gameStyles.stockSymbol}>{symbol}</Text>
                    <Text style={[
                      gameStyles.stockChange,
                      { color: (monthlyChanges[symbol] || 0) >= 0 ? '#38ef7d' : '#ff6b6b' }
                    ]}>
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
        ) : (
          <Animated.View style={[gameStyles.marketSection, {
            transform: priceAnimations.current.SP500 ? [{
              translateY: priceAnimations.current.SP500.interpolate({
                inputRange: [-0.1, 0, 0.1],
                outputRange: [5, 0, -5]
              })
            }] : []
          }]}>
            <Text style={gameStyles.sectionTitle}>S&P 500</Text>
            <Text style={gameStyles.marketPrice}>{formatCurrency(currentPrices.SP500 || 0)}</Text>
            <Text style={[
              gameStyles.marketChange,
              { color: (monthlyChanges.SP500 || 0) >= 0 ? '#38ef7d' : '#ff6b6b' }
            ]}>
              {formatPercentage(monthlyChanges.SP500 || 0)} this month
            </Text>
          </Animated.View>
        )}

        {/* Portfolio Summary */}
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

        {/* Action Buttons - NOW AVAILABLE FOR ALL MODES */}
        {isPlaying && (
          <View style={gameStyles.actionSection}>
            <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
              <Pressable 
                style={[
                  gameStyles.actionButton, 
                  gameStyles.buyButton,
                  { opacity: canBuy() ? 1 : 0.5 }
                ]}
                onPress={buyAll}
                disabled={!canBuy()}
              >
                <Ionicons name="trending-up" size={20} color="#fff" />
                <Text style={gameStyles.actionButtonText}>BUY ALL</Text>
              </Pressable>
            </Animated.View>
            
            <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
              <Pressable 
                style={[
                  gameStyles.actionButton, 
                  gameStyles.sellButton,
                  { opacity: canSell() ? 1 : 0.5 }
                ]}
                onPress={sellAll}
                disabled={!canSell()}
              >
                <Ionicons name="trending-down" size={20} color="#fff" />
                <Text style={gameStyles.actionButtonText}>SELL ALL</Text>
              </Pressable>
            </Animated.View>
          </View>
        )}

        {/* Game Controls */}
        <View style={gameStyles.controlSection}>
          {!isPlaying && !gameComplete && (
            <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
              <Pressable style={gameStyles.controlButton} onPress={startGame}>
                <Ionicons name="play" size={20} color="#fff" />
                <Text style={gameStyles.controlButtonText}>
                  {isPaused ? 'Resume' : 'Start Game'}
                </Text>
              </Pressable>
            </Animated.View>
          )}
          
          {isPlaying && (
            <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
              <Pressable style={gameStyles.controlButton} onPress={pauseGame}>
                <Ionicons name="pause" size={20} color="#fff" />
                <Text style={gameStyles.controlButtonText}>Pause</Text>
              </Pressable>
            </Animated.View>
          )}
          
          <Pressable style={gameStyles.menuButton} onPress={goToMenu}>
            <Ionicons name="home" size={20} color="#fff" />
            <Text style={gameStyles.menuButtonText}>Menu</Text>
          </Pressable>
        </View>

        {gameComplete && (
          <Animated.View style={[gameStyles.completeSection, {
            transform: [{ scale: pulseAnim }]
          }]}>
            <Text style={gameStyles.completeTitle}>Game Complete!</Text>
            <Text style={gameStyles.completeText}>
              Redirecting to results...
            </Text>
          </Animated.View>
        )}

      </ScrollView>
      
      {/* Custom Modal */}
      <CustomModal
        visible={showExitModal}
        type="warning"
        title="Return to Menu?"
        message="Are you sure you want to leave? Your current game progress will be lost."
        buttons={[
          { 
            text: "Cancel", 
            style: "cancel", 
            onPress: () => setShowExitModal(false) 
          },
          { 
            text: "Yes, Leave Game", 
            style: "destructive", 
            onPress: () => router.push('/') 
          }
        ]}
        onDismiss={() => setShowExitModal(false)}
      />
      
      {/* News Flash Overlay with improved positioning */}
      <NewsFlash 
        event={currentEvent}
        visible={showNewsFlash}
        onDismiss={dismissNewsFlash}
        onBuy={handleNewsFlashBuy}
        onSell={handleNewsFlashSell}
        canBuy={canBuy()}
        canSell={canSell()}
        gameMode={gameMode}
      />
    </LinearGradient>
  );
}