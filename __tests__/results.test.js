// __tests__/results.test.js
import { render, screen, waitFor } from '@testing-library/react-native';
import { userEvent } from '@testing-library/react-native';
import ResultsScreen from '../app/results';

// Mock the router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useLocalSearchParams: () => ({}),
}));

// Mock the styles
jest.mock('../styles/resultsStyles', () => ({
  resultsStyles: {
    container: {},
    content: {},
    header: {},
    title: {},
    subtitle: {},
    resultsSection: {},
    sectionTitle: {},
    resultCard: {},
    resultHeader: {},
    resultLabel: {},
    resultValue: {},
    resultReturn: {},
    resultDetail: {},
    differenceCard: {},
    differenceLabel: {},
    differenceValue: {},
    differencePercent: {},
    statsSection: {},
    statsGrid: {},
    statItem: {},
    statNumber: {},
    statLabel: {},
    factSection: {},
    factTitle: {},
    factText: {},
    actionSection: {},
    playAgainButton: {},
    playAgainGradient: {},
    playAgainText: {},
    homeButton: {},
    homeButtonText: {},
  },
}));

describe('ResultsScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  test('renders results screen elements correctly using getByText', async () => {
    render(<ResultsScreen />);
    
    // Wait for component to load and check main elements
    await waitFor(() => {
      expect(screen.getByText('Market Wins This Time')).toBeTruthy();
    });
    
    expect(screen.getByText('Final Results')).toBeTruthy();
    expect(screen.getByText('Your Strategy')).toBeTruthy();
    expect(screen.getByText('Buy & Hold')).toBeTruthy();
    expect(screen.getByText('Play Again')).toBeTruthy();
  });

  test('navigates to game when play again is pressed using User Event API', async () => {
    const user = userEvent.setup();
    render(<ResultsScreen />);
    
    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Play Again')).toBeTruthy();
    });
    
    const playAgainButton = screen.getByText('Play Again');
    await user.press(playAgainButton);
    
    // Verify navigation was called
    expect(mockPush).toHaveBeenCalledWith('/game');
  });

  test('navigates home when home button is pressed using User Event API', async () => {
    const user = userEvent.setup();
    render(<ResultsScreen />);
    
    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Home')).toBeTruthy();
    });
    
    const homeButton = screen.getByText('Home');
    await user.press(homeButton);
    
    // Verify navigation was called
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  test('displays game statistics using queryByText', () => {
    render(<ResultsScreen />);
    
    // Test using queryByText method
    const gameStats = screen.queryByText('Game Stats');
    const years = screen.queryByText('Years');
    const trades = screen.queryByText('Trades');
    const started = screen.queryByText('Started');
    
    expect(gameStats).toBeTruthy();
    expect(years).toBeTruthy();
    expect(trades).toBeTruthy();
    expect(started).toBeTruthy();
  });

  test('shows fun fact section using findByText', async () => {
    render(<ResultsScreen />);
    
    // Test findByText async query
    const funFact = await screen.findByText('💡 Fun Fact');
    expect(funFact).toBeTruthy();
    
    // Should show educational content
    const factText = screen.queryByText(/professional fund managers/);
    expect(factText).toBeTruthy();
  });

  test('component renders without crashing', () => {
    render(<ResultsScreen />);
    expect(true).toBe(true);
  });
});