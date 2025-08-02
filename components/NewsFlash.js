// components/NewsFlash.js
// Interactive news flash with buy/sell actions - IMPROVED VERSION with consistent behavior

import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { getSentimentColor } from '../utils/economicEvents';
import { newsFlashStyles as styles } from '../styles/newsFlashStyles';
import NewsFlashHeader from './NewsFlashHeader';
import NewsFlashActions from './NewsFlashActions';

const NewsFlash = ({ event, onDismiss, onBuy, onSell, canBuy, canSell, visible, gameMode }) => {
  const slideAnim = useRef(new Animated.Value(-200)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timeoutRef = useRef(null);

  // Get mode-specific timeout duration
  const getTimeoutDuration = () => {
    if (gameMode === 'speedrun') return 5000; // 5 seconds for speedrun
    return 10000; // 10 seconds for other modes
  };

  console.log('NewsFlash render - Props:', {
    visible,
    hasEvent: !!event,
    eventText: event?.event,
    canBuy,
    canSell,
    gameMode
  });

  useEffect(() => {
    console.log('NewsFlash useEffect triggered:', { visible, event });

    if (visible && event) {
      console.log('Starting news flash animation');

      // Defer animations to prevent render phase updates
      requestAnimationFrame(() => {
        // Slide in animation
        Animated.parallel([
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start(() => {
          console.log('News flash animation completed');
        });

        // Pulse animation for attention
        const pulse = Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.02,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
          ])
        );
        pulse.start();

        // Auto-dismiss after mode-specific timeout
        const timeoutDuration = getTimeoutDuration();
        timeoutRef.current = setTimeout(() => {
          console.log(`Auto-dismissing news flash after ${timeoutDuration}ms`);
          dismissNews();
        }, timeoutDuration);

        return () => {
          console.log('Cleaning up news flash animations');
          pulse.stop();
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        };
      });
    } else if (!visible) {
      console.log('Resetting animations - not visible');
      // Defer value resets to avoid scheduling updates during render
      requestAnimationFrame(() => {
        slideAnim.setValue(-200);
        opacityAnim.setValue(0);
      });
    }
  }, [visible, event]);

  const dismissNews = () => {
    console.log('Dismissing news via animation');

    // Defer animation to prevent render phase updates
    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: -200,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start(() => {
        console.log('Dismiss animation complete, calling onDismiss');
        onDismiss();
      });
    });
  };

  const handleBuy = () => {
    console.log('User chose to buy');
    onBuy();
    dismissNews();
  };

  const handleSell = () => {
    console.log('User chose to sell');
    onSell();
    dismissNews();
  };

  // Get mode-specific action text
  const getActionText = () => {
    if (gameMode === 'diversified') {
      return {
        buy: 'BUY ALL STOCKS',
        sell: 'SELL ALL STOCKS'
      };
    }
    return {
      buy: 'BUY ALL',
      sell: 'SELL ALL'
    };
  };

  const actionText = getActionText();

  // Don't render anything if not visible or no event
  if (!visible || !event) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: opacityAnim,
        }
      ]}
      pointerEvents="box-none" // This allows touches to pass through to underlying components
    >
      <Animated.View
        style={[
          styles.newsContainer,
          {
            transform: [
              { translateY: slideAnim },
              { scale: pulseAnim }
            ],
            borderLeftColor: getSentimentColor(event?.sentiment || 'neutral')
          }
        ]}
        pointerEvents="auto" // But this container should capture touches
      >
        <View style={styles.newsContent}>
          <NewsFlashHeader event={event} onClose={dismissNews} />
          <NewsFlashActions
            canBuy={canBuy}
            canSell={canSell}
            onBuy={handleBuy}
            onSell={handleSell}
            onDismiss={dismissNews}
            actionText={actionText}
            gameMode={gameMode}
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default NewsFlash;
