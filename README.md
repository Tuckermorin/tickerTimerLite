# Ticker Timer Lite

Ticker Timer Lite is a React Native game built with the Expo framework. It challenges players to try timing the market over a simulated 30‑year period of S&P 500 data. Each month you decide whether to stay invested or move to cash and see if you can outperform a simple buy‑and‑hold strategy.

## WireFrames
https://www.figma.com/board/UunpFWt3aMnydAG7T36VbH/Untitled?node-id=0-1&t=0pErmHhtkLGr4dc2-1

## Features
- Historical S&P 500 data from 1974–2025 with random 30‑year segments
- Interactive gameplay with monthly decisions and yearly cash bonuses
- Results screen comparing your performance to buy‑and‑hold
- Written with Expo Router for easy navigation
- Jest tests using `@testing-library/react-native`

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```
   This runs `expo start` and you can open the app on iOS, Android or web.
3. Run the test suite:
   ```bash
   npm test
   ```

## Project Structure
- `app/` – React Native screens such as `index.js`, `game.js` and `results.js`
- `styles/` – StyleSheets for the screens
- `utils/` – Historical data and helpers
- `__tests__/` – Jest tests for each screen
- `App.js` and `app.json` – Expo configuration

## Sample Code
Below is an excerpt from the home screen that describes the game:
```jsx
<Text style={homeStyles.title} accessibilityLabel="app-title">Ticker Timer</Text>
<Text style={homeStyles.subtitle} accessibilityLabel="app-subtitle">A game that sees if you can beat the market by timing it</Text>
```

Another snippet shows the progress indicator during gameplay:
```jsx
<Text style={gameStyles.progressTitle}>
  Year {Math.floor(currentMonth / 12) + 1} of 30
</Text>
```

The historical data helper function randomly selects a 30‑year range:
```js
export const getRandomPeriod = () => {
  const maxStartIndex = fullHistoricalData.length - 360; // 30 years * 12 months
  const startIndex = Math.floor(Math.random() * maxStartIndex);
  const selectedData = fullHistoricalData.slice(startIndex, startIndex + 360);
  return selectedData.reverse(); // Reverse to go chronologically
};
```

# Design Implementation - Material Design 3 & Human Interface Guidelines

This document outlines the specific design improvements implemented in the Ticker Timer Lite app based on **Material Design 3** and **Apple's Human Interface Guidelines**.

## Overview

The app has been enhanced to follow modern design principles that prioritize accessibility, visual hierarchy, and user experience. The implementation focuses on creating a cohesive, intuitive interface that works well across different devices while maintaining brand identity.

## Material Design 3 Implementation

### 1. **Typography Scale**
- **Implementation**: Adopted Material 3's semantic typography scale
- **Specific Changes**:
  - Display Large (48px) for hero titles
  - Headline Large (32px) for main page titles  
  - Title Large (20px) for section headers
  - Body Large (16px) for primary content
  - Label Medium (12px) for supporting text
- **Benefits**: Creates clear visual hierarchy and improves readability across all screen sizes

### 2. **Elevated Surfaces & Depth**
- **Implementation**: Applied Material 3's elevation system with subtle shadows and tinted surfaces
- **Specific Changes**:
  - Level 1 elevation for cards and options (1px shadow, 0.05 opacity)
  - Level 2 elevation for selected states (2px shadow, 0.1 opacity)  
  - Level 3 elevation for primary actions (4px shadow, 0.3 opacity)
  - Surface tinting with brand colors at 4-8% opacity
- **Benefits**: Creates visual depth without overwhelming users, guides attention to interactive elements

### 3. **Color System & Accessibility**
- **Implementation**: Used Material 3's color roles and tonal palettes
- **Specific Changes**:
  - Primary colors: #4facfe (main actions, selected states)
  - Surface variants: rgba(255,255,255,0.04-0.08) for card backgrounds
  - On-surface colors: #fff for primary text, #8e8e93 for secondary
  - Sufficient contrast ratios (4.5:1 minimum) for accessibility compliance
- **Benefits**: Ensures readability and accessibility while maintaining visual appeal

### 4. **Shape & Corner Radius**
- **Implementation**: Consistent corner radius system following Material 3 guidelines
- **Specific Changes**:
  - 20px radius for primary buttons and hero elements
  - 16px radius for cards and major containers
  - 12-14px radius for smaller components and icons
  - 8px radius for badges and micro-interactions
- **Benefits**: Creates cohesive visual language and modern aesthetic

## Human Interface Guidelines Implementation

### 1. **Touch Targets & Spacing**
- **Implementation**: Followed HIG's 44pt minimum touch target guideline
- **Specific Changes**:
  - Buttons minimum 56px height (converted from 44pt)
  - Interactive elements minimum 48x48px touch area
  - Adequate spacing between clickable elements (minimum 8px gaps)
  - Proper padding in cards (16-20px) for comfortable interaction
- **Benefits**: Improves usability and reduces interaction errors

### 2. **Accessibility Features**
- **Implementation**: Enhanced accessibility following HIG standards
- **Specific Changes**:
  - `accessibilityRole` and `accessibilityLabel` for all interactive elements
  - `accessibilityState` for toggles and selections
  - `accessibilityHint` for complex actions
  - High contrast text (minimum 4.5:1 ratio)
  - Support for Dynamic Type scaling
- **Benefits**: Makes app usable for people with disabilities and assistive technologies

### 3. **Visual Hierarchy & Information Architecture**
- **Implementation**: Clear information prioritization following HIG principles
- **Specific Changes**:
  - Primary content prominently displayed
  - Secondary information properly de-emphasized
  - Logical reading flow with proper spacing
  - Consistent navigation patterns
  - Progressive disclosure of complex information
- **Benefits**: Reduces cognitive load and improves user comprehension

### 4. **Motion & Animation Principles**
- **Implementation**: Meaningful animations that enhance understanding
- **Specific Changes**:
  - Reduced motion timing (150-500ms) for better perception
  - Staggered entrance animations (150ms delays)
  - Subtle pulse animations (2000ms cycles) for calls-to-action
  - Easing curves that feel natural and responsive
- **Benefits**: Guides user attention and provides feedback without being distracting

## Enhanced Components

### Home Screen Improvements
- **Hero Section**: Elevated icon container with badge, improved typography scale
- **Stats Cards**: Surface treatment with proper elevation and icon integration
- **Step Cards**: Sequential numbering with color-coded icons and enhanced descriptions
- **CTA Button**: Prominent gradient with adequate touch target and accessibility labels

### Setup Screen Improvements  
- **Mode Cards**: Expanded content with difficulty badges, time estimates, and better descriptions
- **Toggle Switch**: Material 3 compliant design with proper states and animations
- **Radio Buttons**: Enhanced visual feedback with inner indicators
- **Option Cards**: Benefit lists and improved visual hierarchy

### Cross-Platform Benefits
- **Consistency**: Unified design language across all screens
- **Scalability**: Components that work across different screen sizes
- **Maintainability**: Clear design tokens and reusable patterns
- **Future-Proofing**: Modern design principles that will age well

## Accessibility Compliance

The implementation ensures compliance with:
- **WCAG 2.1 AA** standards for web accessibility
- **Section 508** compliance for federal accessibility requirements  
- **Apple's Accessibility Guidelines** for iOS apps
- **Material Design Accessibility** standards

### Specific Accessibility Features:
- Minimum 11pt text size (converted to 14px)
- 4.5:1 contrast ratios for normal text
- 3:1 contrast ratios for large text
- Proper semantic markup with accessibility roles
- Support for screen readers and assistive technologies
- Keyboard navigation support
- Touch target sizing for motor accessibility

## Performance Impact

The design improvements maintain optimal performance through:
- **Efficient Animations**: Using native driver for transform animations
- **Optimized Renders**: Minimal re-renders through proper React patterns
- **Asset Optimization**: Vector icons and gradient overlays instead of image assets
- **Memory Management**: Proper cleanup of animation listeners

## Conclusion

These design improvements create a more professional, accessible, and user-friendly experience while maintaining the app's core functionality. The implementation follows industry best practices from both Google's Material Design and Apple's Human Interface Guidelines, ensuring the app feels familiar and intuitive to users from both ecosystems.

The enhanced design system provides a solid foundation for future development and ensures the app can scale gracefully as new features are added.

## License
This project is provided for educational purposes and has no specific license.

