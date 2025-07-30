// app/setup.js
// Game setup and mode selection screen

import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { setupStyles } from '../styles/setupStyles';

export default function SetupScreen() {
  const router = useRouter();
  
  const [selectedMode, setSelectedMode] = useState('classic');
  const [economicEvents, setEconomicEvents] = useState(false);
  const [newsFlashes, setNewsFlashes] = useState(false);

  const gameModes = [
    {
      id: 'classic',
      title: 'Classic Mode',
      subtitle: 'S&P 500 only, 20 years',
      icon: 'trending-up',
      difficulty: 'Beginner Friendly'
    },
    {
      id: 'diversified',
      title: 'Diversified Mode',
      subtitle: '5 stocks + S&P 500, 20 years',
      icon: 'pie-chart',
      difficulty: 'More Complex'
    },
    {
      id: 'speedrun',
      title: 'Speed Run',
      subtitle: 'S&P 500, 10 years, 2x speed',
      icon: 'flash',
      difficulty: 'Time Pressure'
    }
  ];

  const handleStartGame = () => {
    router.push({
      pathname: '/game',
      params: {
        mode: selectedMode,
        economicEvents: economicEvents.toString(),
        newsFlashes: newsFlashes.toString()
      }
    });
  };

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={setupStyles.container}>
      <ScrollView style={setupStyles.content} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={setupStyles.header}>
          <Text style={setupStyles.title}>Choose Your Challenge</Text>
          <Text style={setupStyles.subtitle}>
            Configure your market timing experience
          </Text>
        </View>

        {/* Game Modes */}
        <View style={setupStyles.section}>
          <Text style={setupStyles.sectionTitle}>Game Mode</Text>
          
          {gameModes.map((mode) => (
            <Pressable
              key={mode.id}
              style={[
                setupStyles.modeCard,
                selectedMode === mode.id && setupStyles.selectedModeCard
              ]}
              onPress={() => setSelectedMode(mode.id)}
            >
              <View style={setupStyles.modeIcon}>
                <Ionicons 
                  name={mode.icon} 
                  size={24} 
                  color={selectedMode === mode.id ? '#4facfe' : '#8e8e93'} 
                />
              </View>
              
              <View style={setupStyles.modeContent}>
                <Text style={[
                  setupStyles.modeTitle,
                  selectedMode === mode.id && setupStyles.selectedModeTitle
                ]}>
                  {mode.title}
                </Text>
                <Text style={setupStyles.modeSubtitle}>{mode.subtitle}</Text>
                <Text style={setupStyles.modeDifficulty}>{mode.difficulty}</Text>
              </View>
              
              <View style={setupStyles.modeSelector}>
                <View style={[
                  setupStyles.radioButton,
                  selectedMode === mode.id && setupStyles.selectedRadioButton
                ]} />
              </View>
            </Pressable>
          ))}
        </View>

        {/* Optional Features */}
        <View style={setupStyles.section}>
          <Text style={setupStyles.sectionTitle}>Optional Features</Text>
          
          {/* Economic Events Toggle */}
          <Pressable
            style={setupStyles.optionCard}
            onPress={() => setEconomicEvents(!economicEvents)}
          >
            <View style={setupStyles.optionIcon}>
              <Ionicons 
                name="newspaper" 
                size={20} 
                color={economicEvents ? '#4facfe' : '#8e8e93'} 
              />
            </View>
            
            <View style={setupStyles.optionContent}>
              <Text style={setupStyles.optionTitle}>Economic Events</Text>
              <Text style={setupStyles.optionDescription}>
                Random economic news during gameplay
              </Text>
            </View>
            
            <View style={[
              setupStyles.toggle,
              economicEvents && setupStyles.toggleActive
            ]}>
              <View style={[
                setupStyles.toggleButton,
                economicEvents && setupStyles.toggleButtonActive
              ]} />
            </View>
          </Pressable>

          {/* News Flashes Toggle */}
          <Pressable
            style={setupStyles.optionCard}
            onPress={() => setNewsFlashes(!newsFlashes)}
          >
            <View style={setupStyles.optionIcon}>
              <Ionicons 
                name="flash" 
                size={20} 
                color={newsFlashes ? '#4facfe' : '#8e8e93'} 
              />
            </View>
            
            <View style={setupStyles.optionContent}>
              <Text style={setupStyles.optionTitle}>News Flashes</Text>
              <Text style={setupStyles.optionDescription}>
                Breaking news animations and alerts
              </Text>
            </View>
            
            <View style={[
              setupStyles.toggle,
              newsFlashes && setupStyles.toggleActive
            ]}>
              <View style={[
                setupStyles.toggleButton,
                newsFlashes && setupStyles.toggleButtonActive
              ]} />
            </View>
          </Pressable>
        </View>

        {/* Start Button */}
        <Pressable style={setupStyles.startButton} onPress={handleStartGame}>
          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            style={setupStyles.startGradient}
          >
            <Ionicons name="play" size={24} color="#fff" />
            <Text style={setupStyles.startText}>Start Game</Text>
          </LinearGradient>
        </Pressable>

      </ScrollView>
    </LinearGradient>
  );
}