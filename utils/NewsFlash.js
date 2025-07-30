// components/NewsFlash.js
// Animated news flash modal for economic events

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getSentimentColor, getSentimentIcon } from '../utils/economicEvents';

const NewsFlash = ({ event, onDismiss, visible }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && event) {
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
      ]).start();

      // Auto-dismiss after 4 seconds
      const timer = setTimeout(() => {
        dismissNews();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [visible, event]);

  const dismissNews = () => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: -100,
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
      onDismiss();
    });
  };

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
    >
      <Animated.View
        style={[
          styles.newsContainer,
          {
            transform: [{ translateY: slideAnim }],
            borderLeftColor: getSentimentColor(event.sentiment)
          }
        ]}
      >
        <Pressable style={styles.newsContent} onPress={dismissNews}>
          <View style={styles.newsHeader}>
            <View style={styles.newsIconContainer}>
              <Ionicons 
                name="newspaper" 
                size={16} 
                color="#4facfe" 
              />
              <Text style={styles.breakingText}>BREAKING</Text>
            </View>
            
            <View style={styles.sentimentContainer}>
              <Ionicons 
                name={getSentimentIcon(event.sentiment)} 
                size={16} 
                color={getSentimentColor(event.sentiment)} 
              />
            </View>
          </View>
          
          <Text style={styles.newsText}>
            {event.event}
          </Text>
          
          <View style={styles.newsFooter}>
            <Text style={styles.dismissText}>Tap to dismiss</Text>
          </View>
        </Pressable>
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 1000,
    paddingTop: 80,
  },
  newsContainer: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    marginHorizontal: 20,
    borderLeftWidth: 4,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  newsContent: {
    padding: 16,
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
    letterSpacing: 1,
  },
  sentimentContainer: {
    padding: 4,
  },
  newsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 22,
    marginBottom: 12,
  },
  newsFooter: {
    alignItems: 'center',
  },
  dismissText: {
    fontSize: 12,
    color: '#8e8e93',
    fontStyle: 'italic',
  },
};

export default NewsFlash;