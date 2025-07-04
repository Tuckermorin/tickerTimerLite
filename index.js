// app/index.js
// Welcome screen with game introduction

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Welcome() {
  const router = useRouter();

  const handlePlayPress = () => {
    router.push('/game');
  };

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="trending-up" size={64} color="#4facfe" />
          <Text style={styles.title}>Market Timer</Text>
          <Text style={styles.subtitle}>Can you beat the market?</Text>
        </View>

        {/* Game Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Your Mission</Text>
          <Text style={styles.description}>
            Travel back to 1990 and make monthly buy/sell decisions on the S&P 500. 
            Your goal: Build a bigger portfolio than simply buying and holding for 30 years.
          </Text>
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎮 How It Works</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Ionicons name="calendar" size={20} color="#4facfe" />
              <Text style={styles.bulletText}>
                Experience real monthly S&P 500 data from 1990-2019
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Ionicons name="cash" size={20} color="#4facfe" />
              <Text style={styles.bulletText}>
                Start with $10,000 to invest
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Ionicons name="trending-up" size={20} color="#4facfe" />
              <Text style={styles.bulletText}>
                Each month, see the price change and decide: Buy, Sell, or Hold
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Ionicons name="trophy" size={20} color="#4facfe" />
              <Text style={styles.bulletText}>
                Compare your final portfolio to a buy-and-hold strategy
              </Text>
            </View>
          </View>
        </View>

        {/* Challenge */}
        <View style={styles.challengeSection}>
          <Text style={styles.challengeTitle}>💡 The Challenge</Text>
          <Text style={styles.challengeText}>
            Market timing seems easy in hindsight, but can you do it in real-time? 
            Most professional investors can't beat the market consistently. 
            Will you be different?
          </Text>
        </View>

        {/* Stats Preview */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>📊 What You'll Experience</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>30</Text>
              <Text style={styles.statLabel}>Years</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>360</Text>
              <Text style={styles.statLabel}>Decisions</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>1,000%+</Text>
              <Text style={styles.statLabel}>Market Growth</Text>
            </View>
          </View>
        </View>

        {/* Play Button */}
        <Pressable style={styles.playButton} onPress={handlePlayPress}>
          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            style={styles.playGradient}
          >
            <Ionicons name="play" size={28} color="#fff" />
            <Text style={styles.playText}>Start the Challenge</Text>
          </LinearGradient>
        </Pressable>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            📚 Educational simulation using historical data. 
            Past performance doesn't predict future results.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#8e8e93',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#8e8e93',
    lineHeight: 24,
  },
  bulletList: {
    gap: 12,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    color: '#8e8e93',
    lineHeight: 22,
  },
  challengeSection: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 12,
  },
  challengeText: {
    fontSize: 16,
    color: '#8e8e93',
    lineHeight: 24,
  },
  statsSection: {
    marginBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4facfe',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8e8e93',
    textAlign: 'center',
  },
  playButton: {
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  playGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  playText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  disclaimer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#8e8e93',
    textAlign: 'center',
    lineHeight: 18,
  },
});