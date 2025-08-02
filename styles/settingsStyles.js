// styles/settingsStyles.js
// Enhanced settings styles implementing Material Design 3 and Human Interface Guidelines

import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const settingsStyles = StyleSheet.create({
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
  headerIconContainer: {
    marginBottom: 16,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.2)',
    // Material Design 3 elevation level 1
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  headerIconLight: {
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    borderColor: 'rgba(79, 172, 254, 0.3)',
  },
  title: {
    fontSize: 32, // Headline Large in Material 3
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  titleLight: {
    color: '#212529',
  },
  subtitle: {
    fontSize: 16, // Body Large in Material 3
    fontWeight: '400',
    color: '#8e8e93',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width * 0.8,
  },
  subtitleLight: {
    color: '#6c757d',
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
  sectionTitleLight: {
    color: '#212529',
  },
  sectionDescription: {
    fontSize: 14, // Body Medium in Material 3
    fontWeight: '400',
    color: '#8e8e93',
    lineHeight: 20,
    marginBottom: 20,
    opacity: 0.9,
  },
  sectionDescriptionLight: {
    color: '#6c757d',
  },
  
  // Option cards with Material Design 3 elevated surfaces
  optionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.08)',
    minHeight: 80,
    // Material Design 3 elevation level 1
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  optionCardLight: {
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOptionCard: {
    borderColor: '#4facfe',
    backgroundColor: 'rgba(79, 172, 254, 0.08)',
    // Material Design 3 elevation level 2
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedOptionCardLight: {
    borderColor: '#4facfe',
    backgroundColor: 'rgba(79, 172, 254, 0.05)',
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Option icon with enhanced visual treatment
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
  optionIconLight: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderColor: 'rgba(0,0,0,0.08)',
  },
  selectedOptionIcon: {
    backgroundColor: 'rgba(79, 172, 254, 0.15)',
    borderColor: 'rgba(79, 172, 254, 0.3)',
  },
  selectedOptionIconLight: {
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    borderColor: 'rgba(79, 172, 254, 0.3)',
  },
  
  // Option content with better hierarchy
  optionContent: {
    flex: 1,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  optionTitle: {
    fontSize: 16, // Title Medium in Material 3
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.1,
    flex: 1,
  },
  optionTitleLight: {
    color: '#212529',
  },
  selectedOptionTitle: {
    color: '#4facfe',
  },
  selectedOptionTitleLight: {
    color: '#4facfe',
  },
  currencySymbol: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  symbolText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  symbolTextLight: {
    color: '#495057',
  },
  optionDescription: {
    fontSize: 14, // Body Medium in Material 3
    fontWeight: '400',
    color: '#8e8e93',
    lineHeight: 20,
  },
  optionDescriptionLight: {
    color: '#6c757d',
  },
  
  // Radio button with Material Design 3 styling
  radioContainer: {
    marginLeft: 16,
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
  radioButtonLight: {
    borderColor: '#6c757d',
  },
  selectedRadioButton: {
    borderColor: '#4facfe',
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
  },
  selectedRadioButtonLight: {
    borderColor: '#4facfe',
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4facfe',
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
  previewCardLight: {
    backgroundColor: 'rgba(79, 172, 254, 0.05)',
    borderColor: 'rgba(79, 172, 254, 0.2)',
    shadowColor: '#4facfe',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  previewTitleLight: {
    color: '#4facfe',
  },
  previewText: {
    fontSize: 18, // Title Medium in Material 3
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  previewTextLight: {
    color: '#212529',
  },
  previewSubtext: {
    fontSize: 14, // Body Medium in Material 3
    fontWeight: '400',
    color: '#8e8e93',
    lineHeight: 20,
    opacity: 0.8,
  },
  previewSubtextLight: {
    color: '#6c757d',
  },
});