import { render, screen } from '@testing-library/react-native';
import TradingScreen from '../app/trading';

describe('TradingScreen', () => {
  test('renders trading screen loading state', () => {
    render(<TradingScreen />);
    
    // Test that the component renders and shows loading state
    expect(screen.getByText('Loading trading data...')).toBeTruthy();
  });

  test('component renders without crashing', () => {
    render(<TradingScreen />);
    // If render doesn't throw an error, the test passes
    expect(true).toBe(true);
  });
});