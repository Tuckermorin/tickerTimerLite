// styles/setupStyles.js
// Enhanced setup styles implementing Material Design 3 and Human Interface Guidelines

import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const setupStyles = StyleSheet.create({
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
  
  // Header with Material Design 3 typography scale
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  title: {
    fontSize: 32, // Headline Large in Material 3
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 16, // Body Large in Material 3
    fontWeight: '400',
    color: '#8e8e93',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width * 0.8,
  },
  
  // Section styling with improved hierarchy
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22, // Headline Small in Material 3
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  sectionDescription: {
    fontSize: 14, // Body Medium in Material 3
    fontWeight: '400',
    color: '#8e8e93',
    lineHeight: 20,
    marginBottom: 20,
    opacity: 0.9,
  },
  
  // Mode cards with Material Design 3 elevated surfaces
  modeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 16, // Reduced from 20 for more space
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.08)',
    minHeight: 110, // Reduced from 120 for better proportions
    // Material Design 3 elevation level 1
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  selectedModeCard: {
    borderColor: '#4facfe',
    backgroundColor: 'rgba(79, 172, 254, 0.08)',
    // Material Design 3 elevation level 2
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  // Mode icon with enhanced visual treatment
  modeIcon: {
    width: 52, // Reduced from 56 for better proportions
    height: 52,
    borderRadius: 14, // Adjusted proportionally
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14, // Reduced from 16
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flexShrink: 0, // Prevent shrinking
  },
  selectedModeIcon: {
    backgroundColor: 'rgba(79, 172, 254, 0.15)',
    borderColor: 'rgba(79, 172, 254, 0.3)',
  },
  
  // Mode content with improved typography
  modeContent: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingRight: 8, // Add padding to prevent text overflow
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
    flexWrap: 'wrap', // Allow wrapping if needed
  },
  modeTitle: {
    fontSize: 16, // Reduced from 18 for better fit
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.1,
    flex: 1,
    flexShrink: 1, // Allow shrinking if needed
  },
  selectedModeTitle: {
    color: '#4facfe',
  },
  difficultyBadge: {
    paddingHorizontal: 6, // Reduced padding
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    flexShrink: 0, // Prevent shrinking
  },
  difficultyText: {
    fontSize: 10, // Reduced from 11 for better fit
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  modeSubtitle: {
    fontSize: 13, // Reduced from 14 for better fit
    fontWeight: '500',
    color: '#8e8e93',
    marginBottom: 6,
    lineHeight: 18,
  },
  modeDescription: {
    fontSize: 12, // Reduced from 13 for better fit
    fontWeight: '400',
    color: '#8e8e93',
    lineHeight: 16,
    marginBottom: 10,
    opacity: 0.8,
  },
  modeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12, // Label Medium in Material 3
    fontWeight: '500',
    color: '#8e8e93',
    opacity: 0.7,
  },
  
  // Radio button with Material Design 3 styling
  modeSelector: {
    marginLeft: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8e8e93',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  selectedRadioButton: {
    borderColor: '#4facfe',
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4facfe',
  },
  
  // Option cards with enhanced design
  optionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    minHeight: 80,
    // Material Design 3 elevation level 1
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  selectedOptionCard: {
    borderColor: '#4facfe',
    backgroundColor: 'rgba(79, 172, 254, 0.06)',
    // Material Design 3 elevation level 2
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  
  // Option icon with enhanced styling
  optionIconContainer: {
    marginRight: 16,
    alignSelf: 'flex-start',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  selectedOptionIcon: {
    backgroundColor: 'rgba(79, 172, 254, 0.15)',
    borderColor: 'rgba(79, 172, 254, 0.3)',
  },
  
  // Option content with better hierarchy
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16, // Title Medium in Material 3
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: 0.1,
  },
  selectedOptionTitle: {
    color: '#4facfe',
  },
  optionDescription: {
    fontSize: 14, // Body Medium in Material 3
    fontWeight: '400',
    color: '#8e8e93',
    lineHeight: 20,
    marginBottom: 8,
  },
  optionBenefits: {
    gap: 4,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  benefitText: {
    fontSize: 12, // Label Medium in Material 3
    fontWeight: '500',
    color: '#8e8e93',
    opacity: 0.8,
  },
  
  // Toggle switch with Material Design 3 styling
  toggleContainer: {
    marginLeft: 16,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  toggle: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  toggleActive: {
    backgroundColor: '#4facfe',
    borderColor: '#4facfe',
  },
  toggleButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    // Material Design 3 elevation level 1
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  toggleButtonActive: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
  },
  
  // Start button with enhanced styling
  startButton: {
    marginTop: 8,
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
    // Material Design 3 elevation level 3
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    minHeight: 56, // Material 3 minimum button height
  },
  startContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  startText: {
    color: '#fff',
    fontSize: 18, // Title Medium in Material 3
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  
  // Preview card with Material Design 3 treatment
  previewCard: {
    backgroundColor: 'rgba(79, 172, 254, 0.06)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.2)',
    // Material Design 3 elevation level 1
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  previewTitle: {
    fontSize: 16, // Title Medium in Material 3
    fontWeight: '600',
    color: '#4facfe',
    letterSpacing: 0.1,
  },
  previewText: {
    fontSize: 14, // Body Medium in Material 3
    fontWeight: '400',
    color: '#8e8e93',
    lineHeight: 20,
    opacity: 0.9,
  },
});