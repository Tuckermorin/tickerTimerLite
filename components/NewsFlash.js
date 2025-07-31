// components/NewsFlash.js
// Interactive news flash with buy/sell actions

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getSentimentColor, getSentimentIcon } from '../utils/economicEvents';

const NewsFlash = ({ event, onDismiss, onBuy, onSell, canBuy, canSell, visible }) => {
  const slideAnim = useRef(new Animated.Value(-200)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  console.log('NewsFlash render - Props:', { 
    visible, 
    hasEvent: !!event, 
    eventText: event?.event,
    canBuy,
    canSell 
  });

  useEffect(() => {
    console.log('NewsFlash useEffect triggered:', { visible, event });
    
    if (visible && event) {
      console.log('Starting news flash animation');
      
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

      return () => {
        console.log('Cleaning up news flash animations');
        pulse.stop();
      };
    } else if (!visible) {
      console.log('Resetting animations - not visible');
      slideAnim.setValue(-200);
      opacityAnim.setValue(0);
    }
  }, [visible, event]);

  const dismissNews = () => {
    console.log('Dismissing news via animation');
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
  };

  const handleBuy = () => {
    console.log('User chose to buy');
    dismissNews();
    setTimeout(() => {
      console.log('Executing buy action');
      onBuy();
    }, 300); // Delay to allow animation to complete
  };

  const handleSell = () => {
    console.log('User chose to sell');
    dismissNews();
    setTimeout(() => {
      console.log('Executing sell action');
      onSell();
    }, 300); // Delay to allow animation to complete
  };

  // Always render the container, but control visibility
  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: visible && event ? opacityAnim : 0,
          pointerEvents: visible && event ? 'auto' : 'none'
        }
      ]}
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
            
            <View style={styles.sentimentContainer}>
              <Ionicons 
                name={getSentimentIcon(event?.sentiment || 'neutral')} 
                size={18} 
                color={getSentimentColor(event?.sentiment || 'neutral')} 
              />
            </View>
          </View>
          
          {/* News Text */}
          <Text style={styles.newsText}>
            {event?.event || 'Loading news...'}
          </Text>
          
          {/* Action Question */}
          <Text style={styles.questionText}>
            How do you want to react to this news?
          </Text>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {canSell && (
              <Pressable style={styles.actionButton} onPress={handleSell}>
                <LinearGradient
                  colors={['#ff6b6b', '#ff5252']}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="trending-down" size={16} color="#fff" />
                  <Text style={styles.buttonText}>SELL ALL</Text>
                </LinearGradient>
              </Pressable>
            )}
            
            {canBuy && (
              <Pressable style={styles.actionButton} onPress={handleBuy}>
                <LinearGradient
                  colors={['#38ef7d', '#4caf50']}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="trending-up" size={16} color="#fff" />
                  <Text style={styles.buttonText}>BUY ALL</Text>
                </LinearGradient>
              </Pressable>
            )}
            
            <Pressable style={styles.dismissButton} onPress={dismissNews}>
              <Text style={styles.dismissButtonText}>NO ACTION</Text>
            </Pressable>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: 20,
  },
  newsContainer: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    borderLeftWidth: 4,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    maxWidth: '100%',
    width: '100%',
  },
  newsContent: {
    padding: 24,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  newsIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  breakingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4facfe',
    letterSpacing: 1.2,
  },
  sentimentContainer: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  newsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 26,
    marginBottom: 20,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dismissButton: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    marginTop: 8,
  },
  dismissButtonText: {
    color: '#8e8e93',
    fontSize: 14,
    fontWeight: '600',
  },
};

export default NewsFlash;