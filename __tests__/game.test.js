// __tests__/game.test.js
import { render, screen, waitFor } from '@testing-library/react-native';
import { userEvent } from '@testing-library/react-native';
import GameScreen from '../app/game';

// Mock the router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useLocalSearchParams: () => ({
    mode: 'classic',
    economicEvents: 'false',
    newsFlashes: 'false'
  }),
}));

// Mock the styles
jest.mock('../styles/gameStyles', () => ({
  gameStyles: {
    container: {},
    content: {},
    loadingContainer: {},
    loadingText: {},
    progressSection: {},
    progressTitle: {},
    progressSubtitle: {},
    progressBar: {},
    progressFill: {},
    modeSection: {},
    modeText: {},
    marketSection: {},
    sectionTitle: {},
    marketPrice: {},
    marketChange: {},
    portfolioSection: {},
    portfolioGrid: {},
    portfolioCard: {},
    portfolioLabel: {},
    portfolioValue: {},
    portfolioPosition: {},
    portfolioDetails: {},
    portfolioDetail: {},
    actionSection: {},
    actionButton: {},
    buyButton: {},
    sellButton: {},
    actionButtonText: {},
    controlSection: {},
    controlButton: {},
    controlButtonText: {},
    menuButton: {},
    menuButtonText: {},
    completeSection: {},
    completeTitle: {},
    completeText: {},
  },
}));

// Mock the historical data
jest.mock('../utils/fullHistoricalData', () => ({
  getRandomPeriod: () => [
    { date: "1990-01-01", value: 100 },
    { date: "1990-02-01", value: 105 },
    { date: "1990-03-01", value: 110 },
    { date: "1990-04-01", value: 115 },
    { date: "1990-05-01", value: 120 },
  ]
}));

describe('GameScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  test('renders game screen elements correctly using getByText', async () => {
    render(<GameScreen />);
    
    // Wait for game to initialize
    await waitFor(() => {
      expect(screen.getByText(/Year 1 of 20/)).toBeTruthy(); // Updated for 20 years
    });
    
    expect(screen.getByText('S&P 500')).toBeTruthy();
    expect(screen.getByText('Your Portfolio')).toBeTruthy();
    expect(screen.getByText('Start Game')).toBeTruthy();
  });

  test('displays classic mode badge', async () => {
    render(<GameScreen />);
    
    await waitFor(() => {
      expect(screen.getByText('📈 Classic Mode')).toBeTruthy();
    });
  });

  test('finds elements using queryByText method', () => {
    render(<GameScreen />);
    
    // Test using queryByText (returns null if not found, doesn't throw)
    const existingElement = screen.queryByText('S&P 500');
    const nonExistentElement = screen.queryByText('This element does not exist');
    
    expect(existingElement).toBeTruthy();
    expect(nonExistentElement).toBeNull();
  });

  test('user can interact with start game button using User Event API', async () => {
    const user = userEvent.setup();
    render(<GameScreen />);
    
    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Start Game')).toBeTruthy();
    });
    
    const startButton = screen.getByText('Start Game');
    await user.press(startButton);
    
    // After starting, should show pause button
    await waitFor(() => {
      expect(screen.queryByText('Pause')).toBeTruthy();
    });
  });

  test('displays correct year range for classic mode', async () => {
    render(<GameScreen />);
    
    await waitFor(() => {
      // Should show 20 years instead of 30
      expect(screen.getByText(/Year 1 of 20/)).toBeTruthy();
    });
  });

  test('component renders without crashing', () => {
    render(<GameScreen />);
    expect(true).toBe(true);
  });
});

// Test with different mode parameters
describe('GameScreen with Speed Run Mode', () => {
  beforeEach(() => {
    mockPush.mockClear();
    
    // Mock speed run mode parameters
    jest.doMock('expo-router', () => ({
      useRouter: () => ({
        push: mockPush,
      }),
      useLocalSearchParams: () => ({
        mode: 'speedrun',
        economicEvents: 'false',
        newsFlashes: 'false'
      }),
    }));
  });

  test('displays speed run mode elements', async () => {
    render(<GameScreen />);
    
    await waitFor(() => {
      expect(screen.getByText(/Year 1 of 10/)).toBeTruthy(); // 10 years for speed run
      expect(screen.getByText('⚡ Speed Run Mode')).toBeTruthy();
      expect(screen.getByText(/2x Speed/)).toBeTruthy();
    });
  });
});