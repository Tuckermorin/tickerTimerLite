# Ticker Timer Lite

Ticker Timer Lite is a React Native game built with the Expo framework. It challenges players to try timing the market over a simulated 30‑year period of S&P 500 data. Each month you decide whether to stay invested or move to cash and see if you can outperform a simple buy‑and‑hold strategy.

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

## License
This project is provided for educational purposes and has no specific license.

