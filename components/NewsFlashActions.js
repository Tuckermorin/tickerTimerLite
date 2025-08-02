import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { newsFlashStyles as styles } from '../styles/newsFlashStyles';

const NewsFlashActions = ({ canBuy, canSell, onBuy, onSell, onDismiss, actionText, gameMode }) => (
  <>
    <View style={styles.actionButtons}>
      {canSell && (
        <Pressable style={[styles.actionButton, styles.sellButton]} onPress={onSell}>
          <Ionicons name="trending-down" size={16} color="#fff" />
          <Text style={styles.buttonText}>{actionText.sell}</Text>
        </Pressable>
      )}

      <Pressable style={[styles.actionButton, styles.dismissButton]} onPress={onDismiss}>
        <Ionicons name="remove" size={16} color="#8e8e93" />
        <Text style={styles.dismissButtonText}>HOLD</Text>
      </Pressable>

      {canBuy && (
        <Pressable style={[styles.actionButton, styles.buyButton]} onPress={onBuy}>
          <Ionicons name="trending-up" size={16} color="#fff" />
          <Text style={styles.buttonText}>{actionText.buy}</Text>
        </Pressable>
      )}
    </View>

    {gameMode === 'diversified' && (
      <View style={styles.modeInfo}>
        <Text style={styles.modeInfoText}>
          📊 Actions affect all 5 stocks in your portfolio
        </Text>
      </View>
    )}

    {gameMode === 'speedrun' && (
      <View style={styles.modeInfo}>
        <Text style={styles.modeInfoText}>
          ⚡ Speed Run: Quick decision needed!
        </Text>
      </View>
    )}

    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>
        Auto-dismiss in {gameMode === 'speedrun' ? '5s' : '10s'}
      </Text>
    </View>
  </>
);

export default NewsFlashActions;
