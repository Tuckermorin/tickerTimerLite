// app/index.js
// Enhanced home screen with settings integration and theme support

import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { homeStyles } from '../styles/homeStyles';
import { useSettings } from '../contexts/SettingsContext';

export default function Welcome() {
  const router = useRouter();
  const { settings, getThemeColors, formatCurrency } = useSettings();
  const themeColors = getThemeColors();
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnims = useRef([
    new Animated.Value(50),
    new Animated.Value(50),
    new Animated.Value(50),
    new Animated.Value(50),
  ]).current;

  useEffect(() => {
    // Staggered entrance animations following Material Design motion principles
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Stagger animation for sections with reduced timing for better perception
    const staggerDelay = 150;
    slideAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 500,
        delay: index * staggerDelay,
        useNativeDriver: true,
      }).start();
    });

    // Subtle pulse animation for CTA button
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
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

  const handleSettingsPress = () => {
    router.push('/settings');
  };

  return (
    <LinearGradient colors={themeColors.background} style={homeStyles.container}>
      <Animated.View style={[homeStyles.content, { opacity: fadeAnim }]}>
        
        {/* Settings Button */}
        <View style={homeStyles.settingsButtonContainer}>
          <Pressable 
            style={[homeStyles.settingsButton, settings.theme === 'light' && homeStyles.settingsButtonLight]} 
            onPress={handleSettingsPress}
            accessibilityRole="button"
            accessibilityLabel="Open settings"
          >
            <Ionicons name="settings-outline" size={24} color={settings.theme === 'light' ? '#495057' : '#8e8e93'} />
          </Pressable>
        </View>
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={homeStyles.scrollContent}
        >
          
          {/* Hero Section with Material Design 3 elevated surface */}
          <Animated.View style={[
            homeStyles.heroSection,
            { transform: [{ translateY: slideAnims[0] }] }
          ]}>
            <View style={homeStyles.heroIconContainer}>
              <View style={[homeStyles.heroIcon, settings.theme === 'light' && homeStyles.heroIconLight]}>
                <Ionicons name="trending-up" size={64} color="#4facfe" />
              </View>
              <View style={homeStyles.heroIconBadge}>
                <Ionicons name="flash" size={20} color="#fff" />
              </View>
            </View>
            
            {/* Enhanced typography hierarchy */}
            <Text style={[homeStyles.heroTitle, settings.theme === 'light' && homeStyles.heroTitleLight]} accessibilityLabel="app-title">
              Ticker Timer
            </Text>
            <Text style={[homeStyles.heroSubtitle, settings.theme === 'light' && homeStyles.heroSubtitleLight]} accessibilityLabel="app-subtitle">
              Can you beat the market by timing it?
            </Text>
            
            {/* Challenge card with elevated surface */}
            <View style={[homeStyles.challengeCard, settings.theme === 'light' && homeStyles.challengeCardLight]}>
              <View style={homeStyles.challengeIcon}>
                <Ionicons name="trophy-outline" size={24} color="#ff6b6b" />
              </View>
              <View style={homeStyles.challengeContent}>
                <Text style={[homeStyles.challengeLabel, settings.theme === 'light' && homeStyles.challengeLabelLight]}>The Ultimate Challenge</Text>
                <Text style={[homeStyles.challengeText, settings.theme === 'light' && homeStyles.challengeTextLight]}>
                  Most professionals can't do it. Can you?
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Stats section with improved visual hierarchy */}
          <Animated.View style={[
            homeStyles.statsSection,
            { transform: [{ translateY: slideAnims[1] }] }
          ]}>
            <View style={[homeStyles.statsContainer, settings.theme === 'light' && homeStyles.statsContainerLight]}>
              <View style={homeStyles.statCard}>
                <View style={homeStyles.statIconWrapper}>
                  <Ionicons name="calendar-outline" size={24} color="#4facfe" />
                </View>
                <Text style={[homeStyles.statNumber, settings.theme === 'light' && homeStyles.statNumberLight]}>20</Text>
                <Text style={[homeStyles.statLabel, settings.theme === 'light' && homeStyles.statLabelLight]}>Years</Text>
              </View>
              
              <View style={homeStyles.statDivider} />
              
              <View style={homeStyles.statCard}>
                <View style={homeStyles.statIconWrapper}>
                  <Ionicons name="flash-outline" size={24} color="#38ef7d" />
                </View>
                <Text style={[homeStyles.statNumber, settings.theme === 'light' && homeStyles.statNumberLight]}>Real</Text>
                <Text style={[homeStyles.statLabel, settings.theme === 'light' && homeStyles.statLabelLight]}>Data</Text>
              </View>
              
              <View style={homeStyles.statDivider} />
              
              <View style={homeStyles.statCard}>
                <View style={homeStyles.statIconWrapper}>
                  <Ionicons name="trending-up-outline" size={24} color="#ffce54" />
                </View>
                <Text style={[homeStyles.statNumber, settings.theme === 'light' && homeStyles.statNumberLight]}>Beat</Text>
                <Text style={[homeStyles.statLabel, settings.theme === 'light' && homeStyles.statLabelLight]}>Market</Text>
              </View>
            </View>
          </Animated.View>

          {/* How it works with Material Design cards */}
          <Animated.View style={[
            homeStyles.howItWorksSection,
            { transform: [{ translateY: slideAnims[2] }] }
          ]}>
            <Text style={[homeStyles.sectionTitle, settings.theme === 'light' && homeStyles.sectionTitleLight]}>How It Works</Text>
            <Text style={[homeStyles.sectionSubtitle, settings.theme === 'light' && homeStyles.sectionSubtitleLight]}>
              Follow these simple steps to start your market timing challenge
            </Text>
            
            <View style={homeStyles.stepsContainer}>
              {[
                {
                  number: '1',
                  icon: 'wallet-outline',
                  title: 'Start with ' + formatCurrency(10000),
                  description: 'Begin fully invested in the market',
                  color: '#4facfe'
                },
                {
                  number: '2', 
                  icon: 'time-outline',
                  title: 'Make Monthly Decisions',
                  description: 'Choose to stay invested or move to cash',
                  color: '#38ef7d'
                },
                {
                  number: '3',
                  icon: 'gift-outline', 
                  title: 'Get Annual Bonuses',
                  description: formatCurrency(5000) + ' every year to reinvest',
                  color: '#ffce54'
                },
                {
                  number: '4',
                  icon: 'trophy-outline',
                  title: 'Beat Buy & Hold',
                  description: 'Can you time better than holding?',
                  color: '#ff6b6b'
                }
              ].map((step, index) => (
                <View key={index} style={[homeStyles.stepCard, settings.theme === 'light' && homeStyles.stepCardLight]}>
                  <View style={[homeStyles.stepIconContainer, { backgroundColor: step.color + '20' }]}>
                    <View style={[homeStyles.stepNumber, { backgroundColor: step.color }]}>
                      <Text style={homeStyles.stepNumberText}>{step.number}</Text>
                    </View>
                    <Ionicons name={step.icon} size={24} color={step.color} />
                  </View>
                  <View style={homeStyles.stepContent}>
                    <Text style={[homeStyles.stepTitle, settings.theme === 'light' && homeStyles.stepTitleLight]}>{step.title}</Text>
                    <Text style={[homeStyles.stepDescription, settings.theme === 'light' && homeStyles.stepDescriptionLight]}>{step.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Enhanced fun fact section */}
          <Animated.View style={[
            homeStyles.funFactSection,
            { transform: [{ translateY: slideAnims[3] }] }
          ]}>
            <Text style={[homeStyles.sectionTitle, settings.theme === 'light' && homeStyles.sectionTitleLight]}>Did You Know?</Text>
            <View style={[homeStyles.factCard, settings.theme === 'light' && homeStyles.factCardLight]}>
              <View style={homeStyles.factIconContainer}>
                <Ionicons name="bar-chart" size={32} color="#ff6b6b" />
              </View>
              <View style={homeStyles.factContent}>
                <Text style={[homeStyles.factText, settings.theme === 'light' && homeStyles.factTextLight]}>
                  <Text style={homeStyles.factHighlight}>80%</Text> of professional fund managers 
                  fail to beat the market over long periods
                </Text>
                <Text style={[homeStyles.factSource, settings.theme === 'light' && homeStyles.factSourceLight]}>— Academic Research</Text>
              </View>
            </View>
          </Animated.View>

          {/* Enhanced CTA button with Material Design 3 principles */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Pressable 
              style={homeStyles.ctaButton} 
              onPress={handlePlayPress} 
              testID="start-challenge-button"
              accessibilityRole="button"
              accessibilityLabel="Start the market timing challenge"
              accessibilityHint="Navigates to game setup screen"
            >
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={homeStyles.ctaGradient}
              >
                <View style={homeStyles.ctaContent}>
                  <Ionicons name="play" size={24} color="#fff" />
                  <Text style={homeStyles.ctaText}>Start the Challenge</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </View>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Disclaimer with improved readability */}
          <View style={homeStyles.disclaimerSection}>
            <View style={[homeStyles.disclaimerCard, settings.theme === 'light' && homeStyles.disclaimerCardLight]}>
              <Ionicons name="information-circle-outline" size={16} color={settings.theme === 'light' ? '#6c757d' : '#8e8e93'} />
              <Text style={[homeStyles.disclaimerText, settings.theme === 'light' && homeStyles.disclaimerTextLight]}>
                Educational simulation using real historical data. 
                Past performance doesn't predict future results.
              </Text>
            </View>
          </View>

        </ScrollView>
      </Animated.View>
    </LinearGradient>
  );
}