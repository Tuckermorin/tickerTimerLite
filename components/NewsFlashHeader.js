import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getSentimentColor, getSentimentIcon } from '../utils/economicEvents';
import { newsFlashStyles as styles } from '../styles/newsFlashStyles';

const NewsFlashHeader = ({ event, onClose }) => (
  <>
    <View style={styles.newsHeader}>
      <View style={styles.newsIconContainer}>
        <Ionicons name="newspaper" size={18} color="#4facfe" />
        <Text style={styles.breakingText}>BREAKING NEWS</Text>
      </View>
      <Pressable style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={20} color="#8e8e93" />
      </Pressable>
    </View>

    <View style={styles.sentimentRow}>
      <Ionicons
        name={getSentimentIcon(event?.sentiment || 'neutral')}
        size={16}
        color={getSentimentColor(event?.sentiment || 'neutral')}
      />
      <Text
        style={[
          styles.sentimentText,
          { color: getSentimentColor(event?.sentiment || 'neutral') },
        ]}
      >
        {event?.sentiment?.toUpperCase() || 'NEUTRAL'} IMPACT
      </Text>
    </View>

    <Text style={styles.newsText}>{event?.event || 'Loading news...'}</Text>

    <Text style={styles.questionText}>
      How do you want to react to this news?
    </Text>
  </>
);

export default NewsFlashHeader;
