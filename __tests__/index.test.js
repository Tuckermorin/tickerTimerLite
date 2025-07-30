// __tests__/index.test.js
import { render, screen, waitFor } from '@testing-library/react-native';
import { userEvent } from '@testing-library/react-native';
import HomeScreen from '../app/index';

// Mock the router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the styles
jest.mock('../styles/homeStyles', () => ({
  homeStyles: {
    container: {},
    content: {},
    header: {},
    title: {},
    subtitle: {},
    section: {},
    sectionTitle: {},
    description: {},
    bulletList: {},
    bulletItem: {},
    bulletText: {},
    challengeSection: {},
    challengeTitle: {},
    challengeText: {},
    statsSection: {},
    statsGrid: {},
    statCard: {},
    statNumber: {},
    statLabel: {},
    playButton: {},
    playGradient: {},
    playText: {},
    disclaimer: {},
    disclaimerText: {},
  },
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  test('renders home screen elements correctly using getByText', () => {
    render(<HomeScreen />);
    
    // Test the actual text that exists in your component
    expect(screen.getByText('Ticker Timer')).toBeTruthy();
    expect(screen.getByText('A game that sees if you can beat the market by timing it')).toBeTruthy();
    expect(screen.getByText('🎯 Your Mission')).toBeTruthy();
    expect(screen.getByText('Start the Challenge')).toBeTruthy();
  });

  test('finds button using getByTestId query method', () => {
    render(<HomeScreen />);
    
    // Test using getByTestId query method
    const startButton = screen.getByTestId('start-challenge-button');
    expect(startButton).toBeTruthy();
  });

  test('finds elements using getByLabelText query method', () => {
    render(<HomeScreen />);

    // Test using getByLabelText query method (accessibility labels)
    const title = screen.getByLabelText('app-title');
    const subtitle = screen.getByLabelText('app-subtitle');

    expect(title).toBeTruthy();
    expect(subtitle).toBeTruthy();
  });

  test('checks for optional elements using queryByText query method', () => {
    render(<HomeScreen />);
    
    // Test using queryByText query method (returns null if not found, doesn't throw)
    const existingElement = screen.queryByText('Ticker Timer');
    const nonExistentElement = screen.queryByText('This text does not exist');
    
    expect(existingElement).toBeTruthy();
    expect(nonExistentElement).toBeNull();
  });

  test('navigates to setup screen when start button is pressed using User Event API', async () => {
    const user = userEvent.setup();
    render(<HomeScreen />);
    
    // Test User Event API - realistic button press
    const startButton = screen.getByTestId('start-challenge-button');
    await user.press(startButton);
    
    // Verify navigation was called to setup instead of game
    expect(mockPush).toHaveBeenCalledWith('/setup');
  });

  test('renders key sections using getByText and findByText', async () => {
    render(<HomeScreen />);
    
    expect(screen.getByText('🎮 How to Play')).toBeTruthy();
    expect(screen.getByText('💡 The Challenge')).toBeTruthy();
    expect(screen.getByText('📊 What You\'ll Experience')).toBeTruthy();
    
    // Test findByText (async query)
    const missionSection = await screen.findByText('🎯 Your Mission');
    expect(missionSection).toBeTruthy();
  });

  test('displays updated game duration and stats', () => {
    render(<HomeScreen />);
    
    // Check for updated 20-year content instead of 30-year
    expect(screen.getByText(/20 years/)).toBeTruthy();
    expect(screen.getByText('20')).toBeTruthy(); // Years stat
    expect(screen.getByText('240')).toBeTruthy(); // Decisions stat
    expect(screen.getByText('~500%')).toBeTruthy(); // Market growth stat
  });
});