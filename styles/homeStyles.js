// styles/homeStyles.js
// Enhanced styles implementing Material Design 3 and Human Interface Guidelines

import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  
  // Hero Section - Material Design 3 elevated surfaces
  heroSection: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 32,
  },
  heroIconContainer: {
    position: 'relative',
    marginBottom: 24,
    // Material Design 3 elevation level 2
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 20, // Material Design 3 corner radius
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.2)',
  },
  heroIconBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1a1a2e',
  },
  
  // Typography - Enhanced hierarchy following Material Design 3
  heroTitle: {
    fontSize: 48, // Display Large in Material 3
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 20, // Title Large in Material 3
    fontWeight: '400',
    color: '#8e8e93',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 28,
    maxWidth: width * 0.8,
  },
  
  // Challenge card with Material Design 3 surface treatment
  challengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.08)', // Material 3 surface tint
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
    // Material Design 3 elevation level 1
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
    maxWidth: width * 0.9,
    minHeight: 64, // Material 3 minimum touch target
  },
  challengeIcon: {
    marginRight: 12,
  },
  challengeContent: {
    flex: 1,
  },
  challengeLabel: {
    fontSize: 14, // Label Large in Material 3
    fontWeight: '600',
    color: '#ff6b6b',
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  challengeText: {
    fontSize: 16, // Body Large in Material 3
    fontWeight: '400',
    color: '#8e8e93',
    lineHeight: 22,
  },

  // Stats section with improved spacing and hierarchy
  statsSection: {
    marginBottom: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    // Material Design 3 elevation level 1
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
    minHeight: 90,
    paddingHorizontal: 2, // Reduced padding for more space
  },
  statIconWrapper: {
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 18, // Further reduced from 20 for better fit
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: -0.3, // Tighter letter spacing
    textAlign: 'center',
    lineHeight: 20, // Explicit line height
  },
  statLabel: {
    fontSize: 10, // Further reduced from 11 for better fit
    fontWeight: '500',
    color: '#8e8e93',
    textTransform: 'uppercase',
    letterSpacing: 0.2, // Reduced letter spacing
    textAlign: 'center',
    lineHeight: 12,
    flexWrap: 'wrap', // Allow text wrapping if needed
  },
  statDivider: {
    width: 1,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 12, // Reduced from 16 for more space
  },

  // How it works section with Material Design 3 cards
  howItWorksSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 28, // Headline Small in Material 3
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 16, // Body Large in Material 3
    fontWeight: '400',
    color: '#8e8e93',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    maxWidth: width * 0.85,
    alignSelf: 'center',
  },
  stepsContainer: {
    gap: 16,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    minHeight: 72, // Adequate touch target
    // Material Design 3 elevation level 1
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 1,
  },
  stepIconContainer: {
    position: 'relative',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderRadius: 16,
  },
  stepNumber: {
    position: 'absolute',
    top: -4,
    left: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16, // Title Medium in Material 3
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: 0.1,
  },
  stepDescription: {
    fontSize: 14, // Body Medium in Material 3
    fontWeight: '400',
    color: '#8e8e93',
    lineHeight: 20,
  },

  // Fun fact section with enhanced visual treatment
  funFactSection: {
    marginBottom: 40,
  },
  factCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.06)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
    gap: 16,
    // Material Design 3 elevation level 1
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  factIconContainer: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  factContent: {
    flex: 1,
  },
  factText: {
    fontSize: 16, // Body Large in Material 3
    fontWeight: '400',
    color: '#8e8e93',
    lineHeight: 24,
    marginBottom: 4,
  },
  factHighlight: {
    fontSize: 20, // Title Medium in Material 3
    fontWeight: '700',
    color: '#ff6b6b',
  },
  factSource: {
    fontSize: 12, // Label Small in Material 3
    fontWeight: '500',
    color: '#8e8e93',
    fontStyle: 'italic',
    opacity: 0.7,
  },

  // Enhanced CTA button with Material Design 3 principles
  ctaButton: {
    marginBottom: 32,
    borderRadius: 20, // Material 3 corner radius
    overflow: 'hidden',
    // Material Design 3 elevation level 3
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  ctaGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    minHeight: 56, // Material 3 minimum button height
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  ctaText: {
    color: '#fff',
    fontSize: 18, // Title Medium in Material 3
    fontWeight: '600',
    letterSpacing: 0.1,
  },

  // Disclaimer with improved accessibility
  disclaimerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 8,
    maxWidth: width * 0.9,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12, // Label Large in Material 3
    fontWeight: '400',
    color: '#8e8e93',
    textAlign: 'left',
    lineHeight: 18,
    opacity: 0.8,
  },

  // Legacy styles for backwards compatibility
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
    lineHeight: 26,
  },
  section: {
    marginBottom: 30,
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
  playButton: {
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
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
    opacity: 0.8,
  },
});