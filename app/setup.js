// app/setup.js
// Enhanced setup screen implementing Material Design 3 and Human Interface Guidelines

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

  const gameModes = [
    {
      id: 'classic',
      title: 'Classic Mode',
      subtitle: 'S&P 500 only, 20 years',
      description: 'Perfect for beginners learning market timing fundamentals',
      icon: 'trending-up',
      difficulty: 'Beginner Friendly',
      difficultyColor: '#38ef7d',
      estimatedTime: '10-15 min'
    },
    {
      id: 'diversified',
      title: 'Diversified Mode', 
      subtitle: '5 stocks + S&P 500, 20 years',
      description: 'Manage multiple investments with increased complexity',
      icon: 'pie-chart',
      difficulty: 'More Complex',
      difficultyColor: '#ffce54',
      estimatedTime: '15-20 min'
    },
    {
      id: 'speedrun',
      title: 'Speed Run',
      subtitle: 'S&P 500, 10 years, 2x speed',
      description: 'Quick challenge with time pressure and rapid decisions',
      icon: 'flash',
      difficulty: 'Time Pressure',
      difficultyColor: '#ff6b6b',
      estimatedTime: '5-8 min'
    }
  ];

  const handleStartGame = () => {
    router.push({
      pathname: '/game',
      params: {
        mode: selectedMode,
        economicEvents: economicEvents.toString(),
        newsFlashes: economicEvents.toString()
      }
    });
  };

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={setupStyles.container}>
      <ScrollView 
        style={setupStyles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={setupStyles.scrollContent}
      >
        
        {/* Header with improved typography hierarchy */}
        <View style={setupStyles.header}>
          <Text style={setupStyles.title}>Choose Your Challenge</Text>
          <Text style={setupStyles.subtitle}>
            Configure your market timing experience
          </Text>
        </View>

        {/* Game Modes with Material Design 3 card treatment */}
        <View style={setupStyles.section}>
          <Text style={setupStyles.sectionTitle}>Game Mode</Text>
          <Text style={setupStyles.sectionDescription}>
            Select the challenge that matches your experience level
          </Text>
          
          {gameModes.map((mode) => (
            <Pressable
              key={mode.id}
              style={[
                setupStyles.modeCard,
                selectedMode === mode.id && setupStyles.selectedModeCard
              ]}
              onPress={() => setSelectedMode(mode.id)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selectedMode === mode.id }}
              accessibilityLabel={`${mode.title}: ${mode.description}`}
            >
              {/* Mode icon with elevated treatment */}
              <View style={[
                setupStyles.modeIcon,
                selectedMode === mode.id && setupStyles.selectedModeIcon
              ]}>
                <Ionicons 
                  name={mode.icon} 
                  size={28} 
                  color={selectedMode === mode.id ? '#4facfe' : '#8e8e93'} 
                />
              </View>
              
              {/* Mode content with enhanced hierarchy */}
              <View style={setupStyles.modeContent}>
                <View style={setupStyles.modeHeader}>
                  <Text style={[
                    setupStyles.modeTitle,
                    selectedMode === mode.id && setupStyles.selectedModeTitle
                  ]}>
                    {mode.title}
                  </Text>
                  <View style={[
                    setupStyles.difficultyBadge,
                    { backgroundColor: mode.difficultyColor + '20', borderColor: mode.difficultyColor + '40' }
                  ]}>
                    <Text style={[setupStyles.difficultyText, { color: mode.difficultyColor }]}>
                      {mode.difficulty}
                    </Text>
                  </View>
                </View>
                
                <Text style={setupStyles.modeSubtitle}>{mode.subtitle}</Text>
                <Text style={setupStyles.modeDescription}>{mode.description}</Text>
                
                <View style={setupStyles.modeFooter}>
                  <View style={setupStyles.timeContainer}>
                    <Ionicons name="time-outline" size={14} color="#8e8e93" />
                    <Text style={setupStyles.timeText}>{mode.estimatedTime}</Text>
                  </View>
                </View>
              </View>
              
              {/* Radio button with Material Design 3 style */}
              <View style={setupStyles.modeSelector}>
                <View style={[
                  setupStyles.radioButton,
                  selectedMode === mode.id && setupStyles.selectedRadioButton
                ]}>
                  {selectedMode === mode.id && (
                    <View style={setupStyles.radioButtonInner} />
                  )}
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Optional Features with improved accessibility */}
        <View style={setupStyles.section}>
          <Text style={setupStyles.sectionTitle}>Optional Features</Text>
          <Text style={setupStyles.sectionDescription}>
            Enhance your experience with additional challenges
          </Text>
          
          {/* Economic Events Toggle with enhanced design */}
          <Pressable
            style={[
              setupStyles.optionCard,
              economicEvents && setupStyles.selectedOptionCard
            ]}
            onPress={() => setEconomicEvents(!economicEvents)}
            accessibilityRole="switch"
            accessibilityState={{ checked: economicEvents }}
            accessibilityLabel="Economic Events: Breaking news alerts during gameplay"
          >
            <View style={setupStyles.optionIconContainer}>
              <View style={[
                setupStyles.optionIcon,
                economicEvents && setupStyles.selectedOptionIcon
              ]}>
                <Ionicons 
                  name="newspaper-outline" 
                  size={24} 
                  color={economicEvents ? '#4facfe' : '#8e8e93'} 
                />
              </View>
            </View>
            
            <View style={setupStyles.optionContent}>
              <Text style={[
                setupStyles.optionTitle,
                economicEvents && setupStyles.selectedOptionTitle
              ]}>
                Economic Events
              </Text>
              <Text style={setupStyles.optionDescription}>
                Breaking news alerts with buy/sell decisions during gameplay
              </Text>
              <View style={setupStyles.optionBenefits}>
                <View style={setupStyles.benefitItem}>
                  <Ionicons name="checkmark" size={12} color="#38ef7d" />
                  <Text style={setupStyles.benefitText}>Realistic market conditions</Text>
                </View>
                <View style={setupStyles.benefitItem}>
                  <Ionicons name="checkmark" size={12} color="#38ef7d" />
                  <Text style={setupStyles.benefitText}>Enhanced challenge</Text>
                </View>
              </View>
            </View>
            
            {/* Material Design 3 toggle switch */}
            <View style={setupStyles.toggleContainer}>
              <View style={[
                setupStyles.toggle,
                economicEvents && setupStyles.toggleActive
              ]}>
                <View style={[
                  setupStyles.toggleButton,
                  economicEvents && setupStyles.toggleButtonActive
                ]} />
              </View>
            </View>
          </Pressable>
        </View>

        {/* Enhanced Start Button with better accessibility */}
        <Pressable 
          style={setupStyles.startButton} 
          onPress={handleStartGame}
          accessibilityRole="button"
          accessibilityLabel={`Start ${gameModes.find(m => m.id === selectedMode)?.title} game${economicEvents ? ' with economic events' : ''}`}
          accessibilityHint="Begins the market timing game with your selected settings"
        >
          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            style={setupStyles.startGradient}
          >
            <View style={setupStyles.startContent}>
              <Ionicons name="play" size={24} color="#fff" />
              <Text style={setupStyles.startText}>Start Game</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </View>
          </LinearGradient>
        </Pressable>

        {/* Game preview card */}
        <View style={setupStyles.previewCard}>
          <View style={setupStyles.previewHeader}>
            <Ionicons name="eye-outline" size={20} color="#4facfe" />
            <Text style={setupStyles.previewTitle}>What to Expect</Text>
          </View>
          <Text style={setupStyles.previewText}>
            You'll make monthly investment decisions using real historical market data. 
            Your goal is to outperform a simple buy-and-hold strategy through strategic timing.
          </Text>
        </View>

      </ScrollView>
    </LinearGradient>
  );
}