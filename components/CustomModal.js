// components/CustomModal.js
// Custom modal component to replace alerts

import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const CustomModal = ({ 
  visible, 
  title, 
  message, 
  buttons, 
  onDismiss,
  type = 'default' // 'default', 'warning', 'success', 'error'
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getIconAndColor = () => {
    switch (type) {
      case 'warning':
        return { icon: 'warning', color: '#ffce54' };
      case 'success':
        return { icon: 'checkmark-circle', color: '#38ef7d' };
      case 'error':
        return { icon: 'close-circle', color: '#ff6b6b' };
      default:
        return { icon: 'information-circle', color: '#4facfe' };
    }
  };

  const { icon, color } = getIconAndColor();

  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
      <Animated.View 
        style={[
          styles.modalContainer,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <View style={styles.header}>
          <Ionicons name={icon} size={32} color={color} />
          <Text style={styles.title}>{title}</Text>
        </View>
        
        <Text style={styles.message}>{message}</Text>
        
        <View style={styles.buttonContainer}>
          {buttons.map((button, index) => (
            <Pressable
              key={index}
              style={[
                styles.button,
                button.style === 'destructive' && styles.destructiveButton,
                button.style === 'cancel' && styles.cancelButton,
                index === buttons.length - 1 && styles.primaryButton
              ]}
              onPress={() => {
                if (button.onPress) button.onPress();
                if (onDismiss) onDismiss();
              }}
            >
              {button.style === 'destructive' ? (
                <Text style={styles.destructiveButtonText}>{button.text}</Text>
              ) : button.style === 'cancel' ? (
                <Text style={styles.cancelButtonText}>{button.text}</Text>
              ) : (
                <LinearGradient
                  colors={['#4facfe', '#00f2fe']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.primaryButtonText}>{button.text}</Text>
                </LinearGradient>
              )}
            </Pressable>
          ))}
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
    zIndex: 2000,
  },
  modalContainer: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    marginHorizontal: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#8e8e93',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  primaryButton: {
    // Gradient applied via LinearGradient
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    alignItems: 'center',
  },
  destructiveButton: {
    backgroundColor: 'rgba(255,107,107,0.2)',
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
  buttonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#8e8e93',
    fontSize: 16,
    fontWeight: '600',
  },
  destructiveButtonText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: 'bold',
  },
};

export default CustomModal;