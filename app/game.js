// app/game.js
// Fixed game screen with proper speed run mode and event handling

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

const debug = __DEV__ ? (tag, ...args) => console.log(tag, ...args) : () => {};

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

  const priceAnimations = useRef({});
  const portfolioValueAnim = useRef(new Animated.Value(0)).current;
  const buyHoldValueAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  const gameMode = params.mode || 'classic';
  const hasEconomicEvents = params.economicEvents === 'true';

  const gameSpeed = SPEEDS[gameMode] || SPEEDS.classic;
  const gameLength = DURATIONS[gameMode] || DURATIONS.classic;
  const gameYears = gameLength / 12;

  const [gameData, setGameData] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

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

  const animatePortfolioValue = useCallback((animatedValue, targetValue) => {
    // Use requestAnimationFrame to avoid render phase updates
    requestAnimationFrame(() => {
      Animated.spring(animatedValue, {
        toValue: targetValue,
        tension: 100,
        friction: 8,
        useNativeDriver: false,
      }).start();
    });
  }, []);

  const animatePriceChange = useCallback((symbol, newPrice, oldPrice) => {
    const change = newPrice - oldPrice;
    const direction = change >= 0 ? 1 : -1;
    if (priceAnimations.current[symbol]) {
      // Use requestAnimationFrame to avoid render phase updates
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
  }, []);

  const animateButtonPress = useCallback((callback) => {
    // Use requestAnimationFrame to avoid render phase updates
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
  }, [buttonScaleAnim]);

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

  // Main game loop
  useEffect(() => {
    if (!isPlaying || gameComplete || isNavigating) return;
    
    intervalRef.current = setInterval(() => {
      setCurrentMonth(prevMonth => {
        if (prevMonth >= gameLength - 1) {
          return prevMonth; // Don't increment past game end
        }
        return prevMonth + 1;
      });
    }, gameSpeed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, gameComplete, isNavigating, gameSpeed, gameLength]);

  // Update prices when month changes
  useEffect(() => {
    if (!gameData || currentMonth >= gameLength) return;
    
    const newPrices = {};
    if (gameMode === 'diversified') {
      symbols.forEach(sym => {
        const newPrice = gameData[sym][currentMonth].value;
        const oldPrice = currentMonth > 0 ? gameData[sym][currentMonth - 1].value : newPrice;
        newPrices[sym] = newPrice;
        animatePriceChange(sym, newPrice, oldPrice);
      });
    } else {
      const newPrice = gameData[currentMonth].value;
      const oldPrice = currentMonth > 0 ? gameData[currentMonth - 1].value : newPrice;
      newPrices.SP500 = newPrice;
      animatePriceChange('SP500', newPrice, oldPrice);
    }
    setCurrentPrices(newPrices);
  }, [currentMonth, gameData, gameMode, symbols, gameLength]);

  // Handle annual bonuses
  useEffect(() => {
    if (currentMonth > 0 && currentMonth % 12 === 0 && currentMonth < gameLength) {
      dispatchPortfolio({ type: 'ADD_ANNUAL_BONUS', prices: currentPrices });
      dispatchBuyHold({ type: 'ADD_ANNUAL_BONUS', prices: currentPrices });
      debug('annualBonus', currentMonth);
    }
  }, [currentMonth, currentPrices, gameLength]);

  // Handle economic events
  useEffect(() => {
    if (!eventEngineRef.current || !hasEconomicEvents || gameComplete || isNavigating) return;
    
    const event = eventEngineRef.current.checkForEvents(currentMonth);
    if (event) {
      const formatted = formatEventForDisplay(event);
      debug('event', formatted);
      setEventHistory(prev => [...prev, formatted]);
      setCurrentEvent(formatted);
      setShowNewsFlash(true);
      setIsPlaying(false); // Pause game for event
    }
  }, [currentMonth, hasEconomicEvents, gameComplete, isNavigating]);

  const navigateToResults = useCallback(() => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    setIsPlaying(false);
    
    const playerReturn = ((portfolioValue - INITIAL_CAPITAL) / INITIAL_CAPITAL) * 100;
    const buyHoldReturn = ((buyHoldValue - INITIAL_CAPITAL) / INITIAL_CAPITAL) * 100;
    
    navigationTimeoutRef.current = setTimeout(() => {
      router.push({
        pathname: '/results',
        params: {
          playerValue: portfolioValue,
          buyHoldValue,
          playerReturn,
          buyHoldReturn,
          didWin: portfolioValue > buyHoldValue,
          gameMode,
          gameYears,
          eventsTriggered: eventHistory.length,
        },
      });
    }, 1000);
  }, [portfolioValue, buyHoldValue, gameMode, gameYears, eventHistory.length, router, isNavigating]);

  // Handle game completion
  useEffect(() => {
    if (currentMonth >= gameLength && !gameComplete && !isNavigating) {
      setIsPlaying(false);
      setGameComplete(true);
      navigateToResults();
    }
  }, [currentMonth, gameLength, gameComplete, isNavigating, navigateToResults]);

  useEffect(() => {
    // Use requestAnimationFrame to defer animation start
    requestAnimationFrame(() => {
      animatePortfolioValue(portfolioValueAnim, portfolioValue);
    });
  }, [portfolioValue, animatePortfolioValue]);

  useEffect(() => {
    // Use requestAnimationFrame to defer animation start
    requestAnimationFrame(() => {
      animatePortfolioValue(buyHoldValueAnim, buyHoldValue);
    });
  }, [buyHoldValue, animatePortfolioValue]);

  useEffect(() => {
    // Use requestAnimationFrame to defer animation start
    requestAnimationFrame(() => {
      Animated.timing(progressAnim, {
        toValue: currentMonth / gameLength,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
  }, [currentMonth, gameLength, progressAnim]);

  useEffect(() => {
    if (!isPlaying) return;
    
    // Use a more stable animation loop
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
      pulseAnim.setValue(1); // Reset to default value
    };
  }, [isPlaying, pulseAnim]);

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
        <Animated.View style={[gameStyles.loadingContainer, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={gameStyles.loadingText}>Loading game data...</Text>
        </Animated.View>
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
          pulseAnim={pulseAnim}
          progressAnim={progressAnim}
          gameMode={gameMode}
        />

        <ModeBadge gameMode={gameMode} hasEconomicEvents={hasEconomicEvents} />

        {hasEconomicEvents && eventHistory.length > 0 && (
          <Animated.View style={[gameStyles.eventCounter, { transform: [{ scale: pulseAnim }] }]}>
            <Ionicons name="newspaper" size={16} color="#4facfe" />
            <Text style={gameStyles.eventCounterText}>
              {eventHistory.length} economic event{eventHistory.length !== 1 ? 's' : ''} occurred
            </Text>
          </Animated.View>
        )}

        <MarketData
          gameMode={gameMode}
          stockMetadata={stockMetadata}
          priceAnimations={priceAnimations}
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
          buttonScaleAnim={buttonScaleAnim}
        />

        <GameControls
          isPlaying={isPlaying}
          isPaused={isPaused}
          gameComplete={gameComplete}
          startGame={startGame}
          pauseGame={pauseGame}
          goToMenu={goToMenu}
          buttonScaleAnim={buttonScaleAnim}
        />

        {gameComplete && !isNavigating && (
          <Animated.View style={[gameStyles.completeSection, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={gameStyles.completeTitle}>Game Complete!</Text>
            <Text style={gameStyles.completeText}>Calculating results...</Text>
          </Animated.View>
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