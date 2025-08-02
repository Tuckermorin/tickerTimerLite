// app/game.js
// Fixed game screen with improved speed mode navigation and race condition handling

import React, { useState, useEffect, useRef, useReducer, useMemo, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { gameStyles } from '../styles/gameStyles';
import { getRandomPeriod } from '../utils/fullHistoricalData';
import { getRandomMultiStockPeriod, stockMetadata } from '../utils/stockData';
import { createEventEngine, formatEventForDisplay } from '../utils/eventEngine';
import NewsFlash from '../components/NewsFlash';
import CustomModal from '../components/CustomModal';
import { useSettings } from '../contexts/SettingsContext';
import GameProgress from '../components/GameProgress';
import MarketData from '../components/MarketData';
import PortfolioSummary from '../components/PortfolioSummary';
import ActionButtons from '../components/ActionButtons';
import GameControls from '../components/GameControls';
import ModeBadge from '../components/ModeBadge';
import { INITIAL_CAPITAL, ANNUAL_BONUS, SPEEDS, DURATIONS } from '../utils/constants';

const debug = __DEV__ ? (tag, ...args) => console.log(`[Game] ${tag}:`, ...args) : () => {};

function portfolioReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return action.payload;
    case 'BUY_ALL': {
      const updated = {};
      Object.keys(state).forEach(sym => {
        const { cash, shares } = state[sym];
        const price = action.prices[sym];
        updated[sym] = cash > 0 ? { shares: shares + cash / price, cash: 0 } : state[sym];
      });
      return { ...state, ...updated };
    }
    case 'SELL_ALL': {
      const updated = {};
      Object.keys(state).forEach(sym => {
        const { cash, shares } = state[sym];
        const price = action.prices[sym];
        updated[sym] = shares > 0 ? { shares: 0, cash: cash + shares * price } : state[sym];
      });
      return { ...state, ...updated };
    }
    case 'ADD_ANNUAL_BONUS': {
      const symbols = Object.keys(state);
      const perSymbol = ANNUAL_BONUS / symbols.length;
      const updated = {};
      symbols.forEach(sym => {
        const { cash, shares } = state[sym];
        const price = action.prices[sym];
        updated[sym] = shares > 0
          ? { shares: shares + perSymbol / price, cash }
          : { shares, cash: cash + perSymbol };
      });
      return { ...state, ...updated };
    }
    default:
      return state;
  }
}

function buyHoldReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return action.payload;
    case 'ADD_ANNUAL_BONUS': {
      const symbols = Object.keys(state);
      const perSymbol = ANNUAL_BONUS / symbols.length;
      const updated = {};
      symbols.forEach(sym => {
        const price = action.prices[sym];
        updated[sym] = { shares: state[sym].shares + perSymbol / price };
      });
      return { ...state, ...updated };
    }
    default:
      return state;
  }
}

export default function GameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { settings, formatCurrency, getThemeColors } = useSettings();
  const themeColors = getThemeColors();

  const intervalRef = useRef(null);
  const eventEngineRef = useRef(null);
  const navigationTimeoutRef = useRef(null);

  // Simplified animation refs - reduce animations in speed mode
  const priceAnimations = useRef({});
  const portfolioValueAnim = useRef(new Animated.Value(0)).current;
  const buyHoldValueAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  // Static values for speed mode
  const staticPulseValue = 1;
  const staticButtonScale = 1;

  const gameMode = params.mode || 'classic';
  const hasEconomicEvents = params.economicEvents === 'true';

  const gameSpeed = SPEEDS[gameMode] || SPEEDS.classic;
  const gameLength = DURATIONS[gameMode] || DURATIONS.classic;
  const gameYears = gameLength / 12;

  // Determine if we should reduce animations for performance
  const isSpeedMode = gameMode === 'speedrun';

  const [gameData, setGameData] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const [currentEvent, setCurrentEvent] = useState(null);
  const [showNewsFlash, setShowNewsFlash] = useState(false);
  const [eventHistory, setEventHistory] = useState([]);
  const [showExitModal, setShowExitModal] = useState(false);

  const [portfolio, dispatchPortfolio] = useReducer(portfolioReducer, {});
  const [buyHoldPortfolio, dispatchBuyHold] = useReducer(buyHoldReducer, {});
  const [currentPrices, setCurrentPrices] = useState({});

  const symbols = useMemo(() => (
    gameMode === 'diversified' ? Object.keys(stockMetadata) : ['SP500']
  ), [gameMode]);

  const monthlyChanges = useMemo(() => {
    if (!gameData || currentMonth === 0) return {};
    if (gameMode === 'diversified') {
      const changes = {};
      symbols.forEach(sym => {
        const newPrice = gameData[sym][currentMonth].value;
        const oldPrice = gameData[sym][currentMonth - 1].value;
        changes[sym] = ((newPrice - oldPrice) / oldPrice) * 100;
      });
      return changes;
    } else {
      const newPrice = gameData[currentMonth].value;
      const oldPrice = gameData[currentMonth - 1].value;
      return { SP500: ((newPrice - oldPrice) / oldPrice) * 100 };
    }
  }, [currentMonth, gameData, gameMode, symbols]);

  const portfolioValue = useMemo(() => {
    return Object.keys(portfolio).reduce((total, sym) => {
      const price = currentPrices[sym] || 0;
      const { shares = 0, cash = 0 } = portfolio[sym] || {};
      return total + shares * price + cash;
    }, 0);
  }, [portfolio, currentPrices]);

  const buyHoldValue = useMemo(() => {
    return Object.keys(buyHoldPortfolio).reduce((total, sym) => {
      const price = currentPrices[sym] || 0;
      const { shares = 0 } = buyHoldPortfolio[sym] || {};
      return total + shares * price;
    }, 0);
  }, [buyHoldPortfolio, currentPrices]);

  const canBuy = useMemo(() => {
    return Object.values(portfolio).some(p => p.cash > 0);
  }, [portfolio]);

  const canSell = useMemo(() => {
    return Object.values(portfolio).some(p => p.shares > 0);
  }, [portfolio]);

  const getCurrentPortfolioValue = useCallback(() => portfolioValue, [portfolioValue]);
  const getBuyHoldValue = useCallback(() => buyHoldValue, [buyHoldValue]);

  // Optimized animation function - skip animations in speed mode
  const animatePortfolioValue = useCallback((animatedValue, targetValue) => {
    if (isSpeedMode) {
      // Skip animations in speed mode to prevent performance issues
      animatedValue.setValue(targetValue);
      return;
    }
    
    requestAnimationFrame(() => {
      Animated.spring(animatedValue, {
        toValue: targetValue,
        tension: 100,
        friction: 8,
        useNativeDriver: false,
      }).start();
    });
  }, [isSpeedMode]);

  // Simplified price animation - skip in speed mode
  const animatePriceChange = useCallback((symbol, newPrice, oldPrice) => {
    if (isSpeedMode) return; // Skip price animations in speed mode
    
    const change = newPrice - oldPrice;
    const direction = change >= 0 ? 1 : -1;
    if (priceAnimations.current[symbol]) {
      requestAnimationFrame(() => {
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
      });
    }
  }, [isSpeedMode]);

  // Simplified button animation
  const animateButtonPress = useCallback((callback) => {
    if (isSpeedMode) {
      // Skip button animations in speed mode
      callback && callback();
      return;
    }
    
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
      ]).start(() => callback && callback());
    });
  }, [buttonScaleAnim, isSpeedMode]);

  const initDataAndEngine = useCallback((mode, hasEvents) => {
    if (mode === 'diversified') {
      const data = getRandomMultiStockPeriod(mode);
      const engine = hasEvents ? createEventEngine(data.SP500, mode, hasEvents) : null;
      return { gameData: data, engine };
    } else {
      const data = getRandomPeriod(mode);
      const engine = hasEvents ? createEventEngine(data, mode, hasEvents) : null;
      return { gameData: data, engine };
    }
  }, []);

  const initPortfolios = useCallback((data, mode) => {
    if (mode === 'diversified') {
      const perSymbol = INITIAL_CAPITAL / symbols.length;
      const portfolioState = {};
      const buyHoldState = {};
      const prices = {};
      symbols.forEach(sym => {
        const startPrice = data[sym][0].value;
        const shares = perSymbol / startPrice;
        portfolioState[sym] = { shares, cash: 0 };
        buyHoldState[sym] = { shares };
        prices[sym] = startPrice;
      });
      return { portfolioState, buyHoldState, currentPrices: prices };
    } else {
      const startPrice = data[0].value;
      const shares = INITIAL_CAPITAL / startPrice;
      const portfolioState = { SP500: { shares, cash: 0 } };
      const buyHoldState = { SP500: { shares } };
      const prices = { SP500: startPrice };
      return { portfolioState, buyHoldState, currentPrices: prices };
    }
  }, [symbols]);

  const resetUiState = useCallback(() => {
    setCurrentMonth(0);
    setIsPlaying(false);
    setIsPaused(false);
    setGameComplete(false);
    setGameStarted(false);
    setCurrentEvent(null);
    setShowNewsFlash(false);
    setEventHistory([]);
    setIsNavigating(false);
  }, []);

  const initializeGame = useCallback(() => {
    debug('init');
    const { gameData: data, engine } = initDataAndEngine(gameMode, hasEconomicEvents);
    setGameData(data);
    eventEngineRef.current = engine;
    const { portfolioState, buyHoldState, currentPrices: prices } = initPortfolios(data, gameMode);
    dispatchPortfolio({ type: 'INIT', payload: portfolioState });
    dispatchBuyHold({ type: 'INIT', payload: buyHoldState });
    setCurrentPrices(prices);
    resetUiState();
  }, [gameMode, hasEconomicEvents, initDataAndEngine, initPortfolios, resetUiState]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Optimized game loop - batch updates in speed mode
  useEffect(() => {
    if (!isPlaying || gameComplete || isNavigating) return;
    
    intervalRef.current = setInterval(() => {
      setCurrentMonth(prevMonth => {
        const nextMonth = prevMonth + 1;
        debug('monthTick', { prevMonth, nextMonth, gameLength });
        
        // Check if game should end
        if (nextMonth >= gameLength) {
          debug('gameEnding', { nextMonth, gameLength });
          return prevMonth; // Don't increment past game end
        }
        return nextMonth;
      });
    }, gameSpeed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, gameComplete, isNavigating, gameSpeed, gameLength]);

  // Optimized price updates - batch in speed mode
  useEffect(() => {
    if (!gameData || currentMonth >= gameLength) return;
    
    const newPrices = {};
    if (gameMode === 'diversified') {
      symbols.forEach(sym => {
        const newPrice = gameData[sym][currentMonth].value;
        const oldPrice = currentMonth > 0 ? gameData[sym][currentMonth - 1].value : newPrice;
        newPrices[sym] = newPrice;
        if (!isSpeedMode) {
          animatePriceChange(sym, newPrice, oldPrice);
        }
      });
    } else {
      const newPrice = gameData[currentMonth].value;
      const oldPrice = currentMonth > 0 ? gameData[currentMonth - 1].value : newPrice;
      newPrices.SP500 = newPrice;
      if (!isSpeedMode) {
        animatePriceChange('SP500', newPrice, oldPrice);
      }
    }
    
    // Batch price update
    setCurrentPrices(newPrices);
  }, [currentMonth, gameData, gameMode, symbols, gameLength, isSpeedMode, animatePriceChange]);

  // Handle annual bonuses
  useEffect(() => {
    if (currentMonth > 0 && currentMonth % 12 === 0 && currentMonth < gameLength) {
      dispatchPortfolio({ type: 'ADD_ANNUAL_BONUS', prices: currentPrices });
      dispatchBuyHold({ type: 'ADD_ANNUAL_BONUS', prices: currentPrices });
      debug('annualBonus', currentMonth);
    }
  }, [currentMonth, currentPrices, gameLength]);

  // Handle economic events - always pause for events
  useEffect(() => {
    if (!eventEngineRef.current || !hasEconomicEvents || gameComplete || isNavigating) return;
    
    const event = eventEngineRef.current.checkForEvents(currentMonth);
    if (event) {
      const formatted = formatEventForDisplay(event);
      debug('event', formatted);
      setEventHistory(prev => [...prev, formatted]);
      setCurrentEvent(formatted);
      setShowNewsFlash(true);
      setIsPlaying(false); // Always pause game for events
    }
  }, [currentMonth, hasEconomicEvents, gameComplete, isNavigating]);

  // FIXED: Improved navigation to results with better race condition handling
  const navigateToResults = useCallback(() => {
    if (isNavigating) {
      debug('Navigation blocked - already navigating');
      return;
    }
    
    debug('navigateToResults called', { 
      portfolioValue, 
      buyHoldValue, 
      gameMode, 
      gameYears,
      currentMonth,
      gameLength
    });
    
    setIsNavigating(true);
    
    const playerReturn = ((portfolioValue - INITIAL_CAPITAL) / INITIAL_CAPITAL) * 100;
    const buyHoldReturn = ((buyHoldValue - INITIAL_CAPITAL) / INITIAL_CAPITAL) * 100;
    
    const navigateParams = {
      pathname: '/results',
      params: {
        playerValue: portfolioValue.toFixed(2),
        buyHoldValue: buyHoldValue.toFixed(2),
        playerReturn: playerReturn.toFixed(2),
        buyHoldReturn: buyHoldReturn.toFixed(2),
        didWin: (portfolioValue > buyHoldValue).toString(),
        gameMode,
        gameYears: gameYears.toString(),
        eventsTriggered: eventHistory.length.toString(),
      },
    };
    
    debug('Navigation params:', navigateParams);
    
    // FIXED: Add a small delay for speed run mode to ensure state is settled
    const delay = isSpeedMode ? 100 : 0;
    
    navigationTimeoutRef.current = setTimeout(() => {
      router.push(navigateParams);
    }, delay);
    
  }, [portfolioValue, buyHoldValue, gameMode, gameYears, eventHistory.length, router, isNavigating, isSpeedMode, currentMonth, gameLength]);

  // FIXED: Improved game completion detection with better state handling
  useEffect(() => {
    debug('gameCompletionCheck', { 
      currentMonth, 
      gameLength, 
      gameComplete, 
      isNavigating,
      condition: currentMonth >= gameLength
    });
    
    if (currentMonth >= gameLength && !gameComplete && !isNavigating) {
      debug('gameCompleting', { currentMonth, gameLength });
      
      // Stop the game loop immediately
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      setIsPlaying(false);
      setGameComplete(true);
      
      // FIXED: For speed mode, add a small delay to ensure all state updates complete
      const delay = isSpeedMode ? 200 : 100;
      
      setTimeout(() => {
        if (!isNavigating) { // Double-check to prevent duplicate navigation
          navigateToResults();
        }
      }, delay);
    }
  }, [currentMonth, gameLength, gameComplete, isNavigating, navigateToResults, isSpeedMode]);

  // Simplified portfolio value animations
  useEffect(() => {
    animatePortfolioValue(portfolioValueAnim, portfolioValue);
  }, [portfolioValue, animatePortfolioValue]);

  useEffect(() => {
    animatePortfolioValue(buyHoldValueAnim, buyHoldValue);
  }, [buyHoldValue, animatePortfolioValue]);

  // Simplified progress animation
  useEffect(() => {
    if (isSpeedMode) {
      progressAnim.setValue(currentMonth / gameLength);
      return;
    }
    
    requestAnimationFrame(() => {
      Animated.timing(progressAnim, {
        toValue: currentMonth / gameLength,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
  }, [currentMonth, gameLength, progressAnim, isSpeedMode]);

  // Simplified pulse animation - skip in speed mode
  useEffect(() => {
    if (!isPlaying || isSpeedMode) return;
    
    const startPulseAnimation = () => {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { 
            toValue: 1.05, 
            duration: 1000, 
            useNativeDriver: true 
          }),
          Animated.timing(pulseAnim, { 
            toValue: 1, 
            duration: 1000, 
            useNativeDriver: true 
          }),
        ])
      );
      pulse.start();
      return pulse;
    };

    const pulseAnimation = startPulseAnimation();
    return () => {
      pulseAnimation.stop();
      pulseAnim.setValue(1);
    };
  }, [isPlaying, pulseAnim, isSpeedMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  const startGame = () => {
    debug('startGame');
    if (!gameData || gameComplete || isNavigating) return;
    animateButtonPress(() => {
      setIsPlaying(true);
      setIsPaused(false);
      setGameStarted(true);
    });
  };

  const pauseGame = () => {
    debug('pauseGame');
    if (gameComplete || isNavigating) return;
    animateButtonPress(() => {
      setIsPlaying(false);
      setIsPaused(true);
    });
  };

  const goToMenu = () => {
    setShowExitModal(true);
  };

  const buyAll = () => {
    debug('buyAll');
    animateButtonPress(() => dispatchPortfolio({ type: 'BUY_ALL', prices: currentPrices }));
  };

  const sellAll = () => {
    debug('sellAll');
    animateButtonPress(() => dispatchPortfolio({ type: 'SELL_ALL', prices: currentPrices }));
  };

  const dismissNewsFlash = () => {
    setShowNewsFlash(false);
    setCurrentEvent(null);
    // Always resume game after dismissing news flash if it was playing before
    if (!isPaused && !gameComplete && !isNavigating) {
      setIsPlaying(true);
    }
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

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
        <View style={[
          gameStyles.loadingContainer, 
          isSpeedMode ? {} : { transform: [{ scale: pulseAnim }] }
        ]}>
          <Text style={gameStyles.loadingText}>Loading game data...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={themeColors.background} style={gameStyles.container}>
      <ScrollView style={gameStyles.content} showsVerticalScrollIndicator={false}>
        <GameProgress
          currentMonth={currentMonth}
          gameYears={gameYears}
          monthName={getRandomMonthName(currentMonth)}
          isPlaying={isPlaying}
          pulseAnim={isSpeedMode ? staticPulseValue : pulseAnim}
          progressAnim={progressAnim}
          gameMode={gameMode}
        />

        <ModeBadge gameMode={gameMode} hasEconomicEvents={hasEconomicEvents} />

        {hasEconomicEvents && eventHistory.length > 0 && (
          <View style={[
            gameStyles.eventCounter, 
            isSpeedMode ? {} : { transform: [{ scale: pulseAnim }] }
          ]}>
            <Ionicons name="newspaper" size={16} color="#4facfe" />
            <Text style={gameStyles.eventCounterText}>
              {eventHistory.length} economic event{eventHistory.length !== 1 ? 's' : ''} occurred
            </Text>
          </View>
        )}

        <MarketData
          gameMode={gameMode}
          stockMetadata={stockMetadata}
          priceAnimations={isSpeedMode ? { current: {} } : priceAnimations}
          monthlyChanges={monthlyChanges}
          currentPrices={currentPrices}
          formatPercentage={formatPercentage}
          formatCurrency={formatCurrency}
        />

        <PortfolioSummary
          formatCurrency={formatCurrency}
          getCurrentPortfolioValue={getCurrentPortfolioValue}
          getBuyHoldValue={getBuyHoldValue}
        />

        <ActionButtons
          isPlaying={isPlaying}
          canBuy={canBuy}
          canSell={canSell}
          buyAll={buyAll}
          sellAll={sellAll}
          buttonScaleAnim={isSpeedMode ? staticButtonScale : buttonScaleAnim}
          gameStarted={gameStarted}
        />

        <GameControls
          isPlaying={isPlaying}
          isPaused={isPaused}
          gameComplete={gameComplete}
          startGame={startGame}
          pauseGame={pauseGame}
          goToMenu={goToMenu}
          buttonScaleAnim={isSpeedMode ? staticButtonScale : buttonScaleAnim}
        />

        {gameComplete && !isNavigating && (
          <View style={[
            gameStyles.completeSection, 
            isSpeedMode ? {} : { transform: [{ scale: pulseAnim }] }
          ]}>
            <Text style={gameStyles.completeTitle}>Game Complete!</Text>
            <Text style={gameStyles.completeText}>Calculating results...</Text>
          </View>
        )}
      </ScrollView>

      <CustomModal
        visible={showExitModal}
        type="warning"
        title="Return to Menu?"
        message="Are you sure you want to leave? Your current game progress will be lost."
        buttons={[
          { text: 'Cancel', style: 'cancel', onPress: () => setShowExitModal(false) },
          { text: 'Yes, Leave Game', style: 'destructive', onPress: () => router.push('/') },
        ]}
        onDismiss={() => setShowExitModal(false)}
      />

      <NewsFlash
        event={currentEvent}
        visible={showNewsFlash}
        onDismiss={dismissNewsFlash}
        onBuy={buyAll}
        onSell={sellAll}
        canBuy={canBuy}
        canSell={canSell}
        gameMode={gameMode}
      />
    </LinearGradient>
  );
}