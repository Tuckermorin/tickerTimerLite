// components/TradeForm.js
// Form component for setting up trading strategies

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const TradeForm = ({ onSubmit, initialStrategy = null }) => {
  const [strategy, setStrategy] = useState({
    action: initialStrategy?.action || 'buy',
    amount: initialStrategy?.amount?.toString() || '1000',
    timing: initialStrategy?.timing || 'first',
    frequency: initialStrategy?.frequency || 1,
  });

  const [errors, setErrors] = useState({});

  const timingOptions = [
    { value: 'first', label: 'First of Month' },
    { value: 'middle', label: 'Mid Month (15th)' },
    { value: 'last', label: 'End of Month' },
  ];

  const validateForm = () => {
    const newErrors = {};
    
    // Validate amount
    const amount = parseFloat(strategy.amount);
    if (isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    if (amount > 10000) {
      newErrors.amount = 'Amount cannot exceed $10,000';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const formattedStrategy = {
        ...strategy,
        amount: parseFloat(strategy.amount),
      };
      onSubmit(formattedStrategy);
    } else {
      Alert.alert('Validation Error', 'Please fix the errors before submitting.');
    }
  };

  const ActionButton = ({ action, label, icon }) => (
    <Pressable
      style={[
        styles.actionButton,
        strategy.action === action && styles.actionButtonActive
      ]}
      onPress={() => setStrategy({ ...strategy, action })}
    >
      <Ionicons 
        name={icon} 
        size={20} 
        color={strategy.action === action ? '#fff' : '#4facfe'} 
      />
      <Text style={[
        styles.actionButtonText,
        strategy.action === action && styles.actionButtonTextActive
      ]}>
        {label}
      </Text>
    </Pressable>
  );

  const TimingButton = ({ timing, label }) => (
    <Pressable
      style={[
        styles.timingButton,
        strategy.timing === timing && styles.timingButtonActive
      ]}
      onPress={() => setStrategy({ ...strategy, timing })}
    >
      <Text style={[
        styles.timingButtonText,
        strategy.timing === timing && styles.timingButtonTextActive
      ]}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <LinearGradient
      colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
      style={styles.container}
    >
      <Text style={styles.sectionTitle}>Trading Strategy</Text>
      
      {/* Action Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Action</Text>
        <View style={styles.actionContainer}>
          <ActionButton action="buy" label="Buy" icon="trending-up" />
          <ActionButton action="sell" label="Sell" icon="trending-down" />
        </View>
      </View>

      {/* Amount Input */}
      <View style={styles.section}>
        <Text style={styles.label}>Amount ($)</Text>
        <TextInput
          style={[styles.input, errors.amount && styles.inputError]}
          value={strategy.amount}
          onChangeText={(text) => setStrategy({ ...strategy, amount: text })}
          placeholder="Enter amount"
          keyboardType="numeric"
          placeholderTextColor="#8e8e93"
        />
        {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
      </View>

      {/* Timing Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Monthly Timing</Text>
        <View style={styles.timingContainer}>
          {timingOptions.map((option) => (
            <TimingButton
              key={option.value}
              timing={option.value}
              label={option.label}
            />
          ))}
        </View>
      </View>

      {/* Submit Button */}
      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <LinearGradient
          colors={['#4facfe', '#00f2fe']}
          style={styles.submitGradient}
        >
          <Ionicons name="play" size={20} color="#fff" />
          <Text style={styles.submitText}>Run Simulation</Text>
        </LinearGradient>
      </Pressable>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    fontWeight: '600',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4facfe',
    backgroundColor: 'transparent',
    gap: 8,
  },
  actionButtonActive: {
    backgroundColor: '#4facfe',
    borderColor: '#4facfe',
  },
  actionButtonText: {
    color: '#4facfe',
    fontWeight: '600',
    fontSize: 16,
  },
  actionButtonTextActive: {
    color: '#fff',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 5,
  },
  timingContainer: {
    gap: 8,
  },
  timingButton: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  timingButtonActive: {
    backgroundColor: 'rgba(79, 172, 254, 0.3)',
    borderColor: '#4facfe',
  },
  timingButtonText: {
    color: '#8e8e93',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  timingButtonTextActive: {
    color: '#4facfe',
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TradeForm;