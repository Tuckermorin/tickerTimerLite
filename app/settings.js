// app/settings.js
// Settings screen with currency and theme options

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { settingsStyles } from '../styles/settingsStyles';
import { useSettings } from '../contexts/SettingsContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnims = useRef([
    new Animated.Value(50),
    new Animated.Value(50),
    new Animated.Value(50),
  ]).current;

  useEffect(() => {
    // Staggered entrance animations
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    const staggerDelay = 150;
    slideAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 500,
        delay: index * staggerDelay,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const handleCurrencyChange = (currency) => {
    const newSettings = { ...localSettings, currency };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
  };

  const handleThemeChange = (theme) => {
    const newSettings = { ...localSettings, theme };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
  };

  const currencyOptions = [
    {
      id: 'USD',
      name: 'US Dollar',
      symbol: '$',
      icon: 'logo-usd',
      description: 'United States Dollar'
    },
    {
      id: 'EUR',
      name: 'Euro',
      symbol: '€',
      icon: 'card-outline',
      description: 'European Union Euro'
    }
  ];

  const themeOptions = [
    {
      id: 'dark',
      name: 'Dark Mode',
      icon: 'moon',
      description: 'Dark background with light text'
    },
    {
      id: 'light',
      name: 'Light Mode',
      icon: 'sunny',
      description: 'Light background with dark text'
    }
  ];

  return (
    <LinearGradient 
      colors={localSettings.theme === 'dark' ? ['#1a1a2e', '#16213e'] : ['#f8f9fa', '#e9ecef']} 
      style={settingsStyles.container}
    >
      <Animated.View style={[settingsStyles.content, { opacity: fadeAnim }]}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={settingsStyles.scrollContent}
        >
          
          {/* Header */}
          <Animated.View style={[
            settingsStyles.header,
            { transform: [{ translateY: slideAnims[0] }] }
          ]}>
            <View style={settingsStyles.headerIconContainer}>
              <View style={[settingsStyles.headerIcon, localSettings.theme === 'light' && settingsStyles.headerIconLight]}>
                <Ionicons name="settings" size={32} color="#4facfe" />
              </View>
            </View>
            <Text style={[settingsStyles.title, localSettings.theme === 'light' && settingsStyles.titleLight]}>
              Settings
            </Text>
            <Text style={[settingsStyles.subtitle, localSettings.theme === 'light' && settingsStyles.subtitleLight]}>
              Customize your app experience
            </Text>
          </Animated.View>

          {/* Currency Settings */}
          <Animated.View style={[
            settingsStyles.section,
            { transform: [{ translateY: slideAnims[1] }] }
          ]}>
            <Text style={[settingsStyles.sectionTitle, localSettings.theme === 'light' && settingsStyles.sectionTitleLight]}>
              Currency
            </Text>
            <Text style={[settingsStyles.sectionDescription, localSettings.theme === 'light' && settingsStyles.sectionDescriptionLight]}>
              Choose your preferred currency for displaying values
            </Text>
            
            {currencyOptions.map((option) => (
              <Pressable
                key={option.id}
                style={[
                  settingsStyles.optionCard,
                  localSettings.currency === option.id && settingsStyles.selectedOptionCard,
                  localSettings.theme === 'light' && settingsStyles.optionCardLight,
                  localSettings.currency === option.id && localSettings.theme === 'light' && settingsStyles.selectedOptionCardLight
                ]}
                onPress={() => handleCurrencyChange(option.id)}
                accessibilityRole="radio"
                accessibilityState={{ checked: localSettings.currency === option.id }}
                accessibilityLabel={`${option.name}: ${option.description}`}
              >
                <View style={settingsStyles.optionIconContainer}>
                  <View style={[
                    settingsStyles.optionIcon,
                    localSettings.currency === option.id && settingsStyles.selectedOptionIcon,
                    localSettings.theme === 'light' && settingsStyles.optionIconLight,
                    localSettings.currency === option.id && localSettings.theme === 'light' && settingsStyles.selectedOptionIconLight
                  ]}>
                    <Ionicons 
                      name={option.icon} 
                      size={24} 
                      color={localSettings.currency === option.id ? '#4facfe' : (localSettings.theme === 'light' ? '#6c757d' : '#8e8e93')} 
                    />
                  </View>
                </View>
                
                <View style={settingsStyles.optionContent}>
                  <View style={settingsStyles.optionHeader}>
                    <Text style={[
                      settingsStyles.optionTitle,
                      localSettings.currency === option.id && settingsStyles.selectedOptionTitle,
                      localSettings.theme === 'light' && settingsStyles.optionTitleLight,
                      localSettings.currency === option.id && localSettings.theme === 'light' && settingsStyles.selectedOptionTitleLight
                    ]}>
                      {option.name}
                    </Text>
                    <View style={settingsStyles.currencySymbol}>
                      <Text style={[
                        settingsStyles.symbolText,
                        localSettings.theme === 'light' && settingsStyles.symbolTextLight
                      ]}>
                        {option.symbol}
                      </Text>
                    </View>
                  </View>
                  <Text style={[
                    settingsStyles.optionDescription,
                    localSettings.theme === 'light' && settingsStyles.optionDescriptionLight
                  ]}>
                    {option.description}
                  </Text>
                </View>
                
                <View style={settingsStyles.radioContainer}>
                  <View style={[
                    settingsStyles.radioButton,
                    localSettings.currency === option.id && settingsStyles.selectedRadioButton,
                    localSettings.theme === 'light' && settingsStyles.radioButtonLight,
                    localSettings.currency === option.id && localSettings.theme === 'light' && settingsStyles.selectedRadioButtonLight
                  ]}>
                    {localSettings.currency === option.id && (
                      <View style={settingsStyles.radioButtonInner} />
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </Animated.View>

          {/* Theme Settings */}
          <Animated.View style={[
            settingsStyles.section,
            { transform: [{ translateY: slideAnims[2] }] }
          ]}>
            <Text style={[settingsStyles.sectionTitle, localSettings.theme === 'light' && settingsStyles.sectionTitleLight]}>
              Appearance
            </Text>
            <Text style={[settingsStyles.sectionDescription, localSettings.theme === 'light' && settingsStyles.sectionDescriptionLight]}>
              Choose between light and dark mode
            </Text>
            
            {themeOptions.map((option) => (
              <Pressable
                key={option.id}
                style={[
                  settingsStyles.optionCard,
                  localSettings.theme === option.id && settingsStyles.selectedOptionCard,
                  localSettings.theme === 'light' && settingsStyles.optionCardLight,
                  localSettings.theme === option.id && localSettings.theme === 'light' && settingsStyles.selectedOptionCardLight
                ]}
                onPress={() => handleThemeChange(option.id)}
                accessibilityRole="radio"
                accessibilityState={{ checked: localSettings.theme === option.id }}
                accessibilityLabel={`${option.name}: ${option.description}`}
              >
                <View style={settingsStyles.optionIconContainer}>
                  <View style={[
                    settingsStyles.optionIcon,
                    localSettings.theme === option.id && settingsStyles.selectedOptionIcon,
                    localSettings.theme === 'light' && settingsStyles.optionIconLight,
                    localSettings.theme === option.id && localSettings.theme === 'light' && settingsStyles.selectedOptionIconLight
                  ]}>
                    <Ionicons 
                      name={option.icon} 
                      size={24} 
                      color={localSettings.theme === option.id ? '#4facfe' : (localSettings.theme === 'light' ? '#6c757d' : '#8e8e93')} 
                    />
                  </View>
                </View>
                
                <View style={settingsStyles.optionContent}>
                  <Text style={[
                    settingsStyles.optionTitle,
                    localSettings.theme === option.id && settingsStyles.selectedOptionTitle,
                    localSettings.theme === 'light' && settingsStyles.optionTitleLight,
                    localSettings.theme === option.id && localSettings.theme === 'light' && settingsStyles.selectedOptionTitleLight
                  ]}>
                    {option.name}
                  </Text>
                  <Text style={[
                    settingsStyles.optionDescription,
                    localSettings.theme === 'light' && settingsStyles.optionDescriptionLight
                  ]}>
                    {option.description}
                  </Text>
                </View>
                
                <View style={settingsStyles.radioContainer}>
                  <View style={[
                    settingsStyles.radioButton,
                    localSettings.theme === option.id && settingsStyles.selectedRadioButton,
                    localSettings.theme === 'light' && settingsStyles.radioButtonLight,
                    localSettings.theme === option.id && localSettings.theme === 'light' && settingsStyles.selectedRadioButtonLight
                  ]}>
                    {localSettings.theme === option.id && (
                      <View style={settingsStyles.radioButtonInner} />
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </Animated.View>

          {/* Preview Card */}
          <View style={[
            settingsStyles.previewCard,
            localSettings.theme === 'light' && settingsStyles.previewCardLight
          ]}>
            <View style={settingsStyles.previewHeader}>
              <Ionicons name="eye-outline" size={20} color="#4facfe" />
              <Text style={[
                settingsStyles.previewTitle,
                localSettings.theme === 'light' && settingsStyles.previewTitleLight
              ]}>
                Preview
              </Text>
            </View>
            <Text style={[
              settingsStyles.previewText,
              localSettings.theme === 'light' && settingsStyles.previewTextLight
            ]}>
              Portfolio value: {localSettings.currency === 'EUR' ? '€' : '$'}15,420
            </Text>
            <Text style={[
              settingsStyles.previewSubtext,
              localSettings.theme === 'light' && settingsStyles.previewSubtextLight
            ]}>
              Settings will apply to all screens in the app
            </Text>
          </View>

        </ScrollView>
      </Animated.View>
    </LinearGradient>
  );
}