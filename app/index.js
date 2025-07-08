// app/index.js
// Welcome screen with game introduction

import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { homeStyles } from '../styles/homeStyles';

export default function Welcome() {
  const router = useRouter();

  const handlePlayPress = () => {
    router.push('/game');
  };

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={homeStyles.container}>
      <ScrollView style={homeStyles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={homeStyles.header}>
          <Ionicons name="trending-up" size={64} color="#4facfe" />
          <Text style={homeStyles.title} accessibilityLabel="app-title">Ticker Timer</Text>
          <Text style={homeStyles.subtitle} accessibilityLabel="app-subtitle">A game that sees if you can beat the market by timing it</Text>
        </View>

        {/* Game Description */}
        <View style={homeStyles.section}>
          <Text style={homeStyles.sectionTitle}>🎯 Your Mission</Text>
          <Text style={homeStyles.description}>
            You start with $10,000 invested in the S&P 500. Over the course of a simulated 30 years, 
            you'll see if you can beat the market by buying and selling at the right moments. 
            Can you time the market better than just holding?
          </Text>
        </View>

        {/* How It Works */}
        <View style={homeStyles.section}>
          <Text style={homeStyles.sectionTitle}>🎮 How to Play</Text>
          <View style={homeStyles.bulletList}>
            <View style={homeStyles.bulletItem}>
              <Ionicons name="calendar" size={20} color="#4facfe" />
              <Text style={homeStyles.bulletText}>
                Experience real S&P 500 data from a random 30-year period
              </Text>
            </View>
            <View style={homeStyles.bulletItem}>
              <Ionicons name="cash" size={20} color="#4facfe" />
              <Text style={homeStyles.bulletText}>
                Start with $10,000 fully invested in the market
              </Text>
            </View>
            <View style={homeStyles.bulletItem}>
              <Ionicons name="trending-up" size={20} color="#4facfe" />
              <Text style={homeStyles.bulletText}>
                Each month, decide to stay invested or sell everything to cash
              </Text>
            </View>
            <View style={homeStyles.bulletItem}>
              <Ionicons name="stopwatch" size={20} color="#4facfe" />
              <Text style={homeStyles.bulletText}>
                Watch 30 years unfold in just 30 seconds (1 second per month)
              </Text>
            </View>
            <View style={homeStyles.bulletItem}>
              <Ionicons name="trophy" size={20} color="#4facfe" />
              <Text style={homeStyles.bulletText}>
                Beat the market by ending with more money than buy-and-hold
              </Text>
            </View>
          </View>
        </View>

        {/* Challenge */}
        <View style={homeStyles.challengeSection}>
          <Text style={homeStyles.challengeTitle}>💡 The Challenge</Text>
          <Text style={homeStyles.challengeText}>
            Market timing seems easy in hindsight, but can you do it in real-time? 
            Most professional investors can't beat a simple buy-and-hold strategy. 
            Will you be different?
          </Text>
        </View>

        {/* Stats Preview */}
        <View style={homeStyles.statsSection}>
          <Text style={homeStyles.sectionTitle}>📊 What You'll Experience</Text>
          <View style={homeStyles.statsGrid}>
            <View style={homeStyles.statCard}>
              <Text style={homeStyles.statNumber}>30</Text>
              <Text style={homeStyles.statLabel}>Years</Text>
            </View>
            <View style={homeStyles.statCard}>
              <Text style={homeStyles.statNumber}>360</Text>
              <Text style={homeStyles.statLabel}>Decisions</Text>
            </View>
            <View style={homeStyles.statCard}>
              <Text style={homeStyles.statNumber}>~1000%</Text>
              <Text style={homeStyles.statLabel}>Market Growth</Text>
            </View>
          </View>
        </View>

        {/* Play Button */}
        <Pressable style={homeStyles.playButton} onPress={handlePlayPress} testID="start-challenge-button">
          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            style={homeStyles.playGradient}
          >
            <Ionicons name="play" size={28} color="#fff" />
            <Text style={homeStyles.playText}>Start the Challenge</Text>
          </LinearGradient>
        </Pressable>

        {/* Disclaimer */}
        <View style={homeStyles.disclaimer}>
          <Text style={homeStyles.disclaimerText}>
            📚 Educational simulation using historical data. 
            Past performance doesn't predict future results.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}