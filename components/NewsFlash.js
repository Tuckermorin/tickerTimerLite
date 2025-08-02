// components/NewsFlash.js
// Interactive news flash with buy/sell actions - IMPROVED VERSION with consistent behavior

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getSentimentColor, getSentimentIcon } from '../utils/economicEvents';

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
          {/* Header */}
          <View style={styles.newsHeader}>
            <View style={styles.newsIconContainer}>
              <Ionicons 
                name="newspaper" 
                size={18} 
                color="#4facfe" 
              />
              <Text style={styles.breakingText}>BREAKING NEWS</Text>
            </View>
            
            <Pressable style={styles.closeButton} onPress={dismissNews}>
              <Ionicons name="close" size={20} color="#8e8e93" />
            </Pressable>
          </View>
          
          {/* Sentiment indicator */}
          <View style={styles.sentimentRow}>
            <Ionicons 
              name={getSentimentIcon(event?.sentiment || 'neutral')} 
              size={16} 
              color={getSentimentColor(event?.sentiment || 'neutral')} 
            />
            <Text style={[styles.sentimentText, { color: getSentimentColor(event?.sentiment || 'neutral') }]}>
              {event?.sentiment?.toUpperCase() || 'NEUTRAL'} IMPACT
            </Text>
          </View>
          
          {/* News Text */}
          <Text style={styles.newsText}>
            {event?.event || 'Loading news...'}
          </Text>
          
          {/* Action Question */}
          <Text style={styles.questionText}>
            How do you want to react to this news?
          </Text>
          
          {/* Action Buttons - Horizontal layout for better UX */}
          <View style={styles.actionButtons}>
            {canSell && (
              <Pressable style={[styles.actionButton, styles.sellButton]} onPress={handleSell}>
                <Ionicons name="trending-down" size={16} color="#fff" />
                <Text style={styles.buttonText}>{actionText.sell}</Text>
              </Pressable>
            )}
            
            <Pressable style={[styles.actionButton, styles.dismissButton]} onPress={dismissNews}>
              <Ionicons name="remove" size={16} color="#8e8e93" />
              <Text style={styles.dismissButtonText}>HOLD</Text>
            </Pressable>
            
            {canBuy && (
              <Pressable style={[styles.actionButton, styles.buyButton]} onPress={handleBuy}>
                <Ionicons name="trending-up" size={16} color="#fff" />
                <Text style={styles.buttonText}>{actionText.buy}</Text>
              </Pressable>
            )}
          </View>

          {/* Mode-specific info */}
          {gameMode === 'diversified' && (
            <View style={styles.modeInfo}>
              <Text style={styles.modeInfoText}>
                📊 Actions affect all 5 stocks in your portfolio
              </Text>
            </View>
          )}

          {gameMode === 'speedrun' && (
            <View style={styles.modeInfo}>
              <Text style={styles.modeInfoText}>
                ⚡ Speed Run: Quick decision needed!
              </Text>
            </View>
          )}

          {/* Auto-dismiss timer indicator */}
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              Auto-dismiss in {gameMode === 'speedrun' ? '5s' : '10s'}
            </Text>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 999, // Lower z-index so it doesn't block everything
    paddingTop: 80,
  },
  newsContainer: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    marginHorizontal: 20,
    borderLeftWidth: 4,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    maxWidth: '90%',
    width: '90%',
  },
  newsContent: {
    padding: 20,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  newsIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  breakingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4facfe',
    letterSpacing: 1.2,
  },
  closeButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  sentimentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  sentimentText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  newsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 14,
    color: '#8e8e93',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 4,
  },
  buyButton: {
    backgroundColor: '#38ef7d',
  },
  sellButton: {
    backgroundColor: '#ff6b6b',
  },
  dismissButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(142, 142, 147, 0.3)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dismissButtonText: {
    color: '#8e8e93',
    fontSize: 14,
    fontWeight: '600',
  },
  modeInfo: {
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.2)',
  },
  modeInfoText: {
    fontSize: 11,
    color: '#4facfe',
    textAlign: 'center',
    fontWeight: '500',
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  timerText: {
    fontSize: 10,
    color: '#8e8e93',
    fontStyle: 'italic',
  },
};

export default NewsFlash;