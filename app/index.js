// app/index.js
// Gamified welcome screen with enhanced organization

import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { homeStyles } from '../styles/homeStyles';

export default function Welcome() {
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnims = useRef([
    new Animated.Value(50),
    new Animated.Value(50),
    new Animated.Value(50),
    new Animated.Value(50),
  ]).current;

  useEffect(() => {
    // Fade in the whole screen
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Stagger animation for sections
    const staggerDelay = 200;
    slideAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 600,
        delay: index * staggerDelay,
        useNativeDriver: true,
      }).start();
    });

    // Start pulse animation for play button
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
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

    return () => pulse.stop();
  }, []);

  const handlePlayPress = () => {
    router.push('/setup');
  };

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={homeStyles.container}>
      <Animated.View style={[homeStyles.content, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* Hero Section */}
          <Animated.View style={[
            homeStyles.heroSection,
            { transform: [{ translateY: slideAnims[0] }] }
          ]}>
            <View style={homeStyles.heroIcon}>
              <Ionicons name="trending-up" size={80} color="#4facfe" />
              <View style={homeStyles.heroIconBadge}>
                <Ionicons name="flash" size={24} color="#fff" />
              </View>
            </View>
            <Text style={homeStyles.heroTitle} accessibilityLabel="app-title">
              Ticker Timer
            </Text>
            <Text style={homeStyles.heroSubtitle} accessibilityLabel="app-subtitle">
              Can you beat the market by timing it?
            </Text>
            <View style={homeStyles.heroChallenge}>
              <Text style={homeStyles.challengeLabel}>⚡ The Ultimate Challenge</Text>
              <Text style={homeStyles.challengeText}>
                Most professionals can't do it. Can you?
              </Text>
            </View>
          </Animated.View>

          {/* Quick Stats */}
          <Animated.View style={[
            homeStyles.quickStats,
            { transform: [{ translateY: slideAnims[1] }] }
          ]}>
            <View style={homeStyles.statItem}>
              <Text style={homeStyles.statNumber}>20</Text>
              <Text style={homeStyles.statLabel}>Years</Text>
              <Ionicons name="calendar" size={20} color="#4facfe" />
            </View>
            <View style={homeStyles.statDivider} />
            <View style={homeStyles.statItem}>
              <Text style={homeStyles.statNumber}>240</Text>
              <Text style={homeStyles.statLabel}>Decisions</Text>
              <Ionicons name="analytics" size={20} color="#38ef7d" />
            </View>
            <View style={homeStyles.statDivider} />
            <View style={homeStyles.statItem}>
              <Text style={homeStyles.statNumber}>~500%</Text>
              <Text style={homeStyles.statLabel}>Growth</Text>
              <Ionicons name="trophy" size={20} color="#ffce54" />
            </View>
          </Animated.View>

          {/* Game Modes Preview */}
          <Animated.View style={[
            homeStyles.modesSection,
            { transform: [{ translateY: slideAnims[2] }] }
          ]}>
            <Text style={homeStyles.sectionTitle}>🎮 Choose Your Challenge</Text>
            
            <View style={homeStyles.modeCard}>
              <View style={homeStyles.modeIcon}>
                <Ionicons name="trending-up" size={24} color="#4facfe" />
              </View>
              <View style={homeStyles.modeContent}>
                <Text style={homeStyles.modeTitle}>Classic Mode</Text>
                <Text style={homeStyles.modeDescription}>S&P 500 • Perfect for beginners</Text>
              </View>
              <View style={homeStyles.modeBadge}>
                <Text style={homeStyles.badgeText}>EASY</Text>
              </View>
            </View>

            <View style={homeStyles.modeCard}>
              <View style={homeStyles.modeIcon}>
                <Ionicons name="pie-chart" size={24} color="#38ef7d" />
              </View>
              <View style={homeStyles.modeContent}>
                <Text style={homeStyles.modeTitle}>Diversified Mode</Text>
                <Text style={homeStyles.modeDescription}>5 Real Stocks • More complex</Text>
              </View>
              <View style={[homeStyles.modeBadge, { backgroundColor: 'rgba(56, 239, 125, 0.2)' }]}>
                <Text style={[homeStyles.badgeText, { color: '#38ef7d' }]}>HARD</Text>
              </View>
            </View>

            <View style={homeStyles.modeCard}>
              <View style={homeStyles.modeIcon}>
                <Ionicons name="flash" size={24} color="#ffce54" />
              </View>
              <View style={homeStyles.modeContent}>
                <Text style={homeStyles.modeTitle}>Speed Run</Text>
                <Text style={homeStyles.modeDescription}>10 Years • 2x Speed • Time pressure</Text>
              </View>
              <View style={[homeStyles.modeBadge, { backgroundColor: 'rgba(255, 206, 84, 0.2)' }]}>
                <Text style={[homeStyles.badgeText, { color: '#ffce54' }]}>FAST</Text>
              </View>
            </View>
          </Animated.View>

          {/* How It Works */}
          <Animated.View style={[
            homeStyles.howItWorksSection,
            { transform: [{ translateY: slideAnims[3] }] }
          ]}>
            <Text style={homeStyles.sectionTitle}>💡 How It Works</Text>
            
            <View style={homeStyles.stepContainer}>
              <View style={homeStyles.step}>
                <View style={homeStyles.stepNumber}>
                  <Text style={homeStyles.stepNumberText}>1</Text>
                </View>
                <View style={homeStyles.stepContent}>
                  <Text style={homeStyles.stepTitle}>Start with $10,000</Text>
                  <Text style={homeStyles.stepDescription}>Fully invested in the market</Text>
                </View>
              </View>

              <View style={homeStyles.step}>
                <View style={homeStyles.stepNumber}>
                  <Text style={homeStyles.stepNumberText}>2</Text>
                </View>
                <View style={homeStyles.stepContent}>
                  <Text style={homeStyles.stepTitle}>Make Monthly Decisions</Text>
                  <Text style={homeStyles.stepDescription}>Stay invested or move to cash</Text>
                </View>
              </View>

              <View style={homeStyles.step}>
                <View style={homeStyles.stepNumber}>
                  <Text style={homeStyles.stepNumberText}>3</Text>
                </View>
                <View style={homeStyles.stepContent}>
                  <Text style={homeStyles.stepTitle}>Get Annual Bonuses</Text>
                  <Text style={homeStyles.stepDescription}>$5,000 every year to invest</Text>
                </View>
              </View>

              <View style={homeStyles.step}>
                <View style={homeStyles.stepNumber}>
                  <Text style={homeStyles.stepNumberText}>4</Text>
                </View>
                <View style={homeStyles.stepContent}>
                  <Text style={homeStyles.stepTitle}>Beat Buy & Hold</Text>
                  <Text style={homeStyles.stepDescription}>Can you time better than holding?</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Fun Facts */}
          <View style={homeStyles.funFactsSection}>
            <Text style={homeStyles.sectionTitle}>🤯 Did You Know?</Text>
            <View style={homeStyles.factCard}>
              <Ionicons name="bar-chart" size={32} color="#ff6b6b" />
              <Text style={homeStyles.factText}>
                <Text style={homeStyles.factHighlight}>80%</Text> of professional fund managers 
                fail to beat the market over long periods
              </Text>
            </View>
          </View>

          {/* Play Button */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Pressable 
              style={homeStyles.playButton} 
              onPress={handlePlayPress} 
              testID="start-challenge-button"
            >
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={homeStyles.playGradient}
              >
                <Ionicons name="play" size={32} color="#fff" />
                <Text style={homeStyles.playText}>Start the Challenge</Text>
                <Ionicons name="arrow-forward" size={24} color="#fff" />
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Disclaimer */}
          <View style={homeStyles.disclaimer}>
            <Text style={homeStyles.disclaimerText}>
              📚 Educational simulation using real historical data. 
              Past performance doesn't predict future results.
            </Text>
          </View>

        </ScrollView>
      </Animated.View>
    </LinearGradient>
  );
}