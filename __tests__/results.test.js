import { render, screen } from '@testing-library/react-native';
import ResultsScreen from '../app/results';

describe('ResultsScreen', () => {
  test('renders results screen loading state', () => {
    render(<ResultsScreen />);
    
    // Test that the component renders and shows loading state
    expect(screen.getByText('Loading results...')).toBeTruthy();
  });

  test('component renders without crashing', () => {
    render(<ResultsScreen />);
    // If render doesn't throw an error, the test passes
    expect(true).toBe(true);
  });
});