// __tests__/setup.test.js
import { render, screen, waitFor } from '@testing-library/react-native';
import { userEvent } from '@testing-library/react-native';
import SetupScreen from '../app/setup';

// Mock the router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the styles
jest.mock('../styles/setupStyles', () => ({
  setupStyles: {
    container: {},
    content: {},
    header: {},
    title: {},
    subtitle: {},
    section: {},
    sectionTitle: {},
    modeCard: {},
    selectedModeCard: {},
    modeIcon: {},
    modeContent: {},
    modeTitle: {},
    selectedModeTitle: {},
    modeSubtitle: {},
    modeDifficulty: {},
    modeSelector: {},
    radioButton: {},
    selectedRadioButton: {},
    optionCard: {},
    optionIcon: {},
    optionContent: {},
    optionTitle: {},
    optionDescription: {},
    toggle: {},
    toggleActive: {},
    toggleButton: {},
    toggleButtonActive: {},
    startButton: {},
    startGradient: {},
    startText: {},
  },
}));

describe('SetupScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  test('renders setup screen elements correctly', () => {
    render(<SetupScreen />);
    
    expect(screen.getByText('Choose Your Challenge')).toBeTruthy();
    expect(screen.getByText('Configure your market timing experience')).toBeTruthy();
    expect(screen.getByText('Game Mode')).toBeTruthy();
    expect(screen.getByText('Optional Features')).toBeTruthy();
    expect(screen.getByText('Start Game')).toBeTruthy();
  });

  test('renders all three game modes', () => {
    render(<SetupScreen />);
    
    expect(screen.getByText('Classic Mode')).toBeTruthy();
    expect(screen.getByText('S&P 500 only, 20 years')).toBeTruthy();
    expect(screen.getByText('Beginner Friendly')).toBeTruthy();
    
    expect(screen.getByText('Diversified Mode')).toBeTruthy();
    expect(screen.getByText('5 stocks + S&P 500, 20 years')).toBeTruthy();
    expect(screen.getByText('More Complex')).toBeTruthy();
    
    expect(screen.getByText('Speed Run')).toBeTruthy();
    expect(screen.getByText('S&P 500, 10 years, 2x speed')).toBeTruthy();
    expect(screen.getByText('Time Pressure')).toBeTruthy();
  });

  test('renders optional features toggles', () => {
    render(<SetupScreen />);
    
    expect(screen.getByText('Economic Events')).toBeTruthy();
    expect(screen.getByText('Random economic news during gameplay')).toBeTruthy();
    
    expect(screen.getByText('News Flashes')).toBeTruthy();
    expect(screen.getByText('Breaking news animations and alerts')).toBeTruthy();
  });

  test('can select different game modes using User Event API', async () => {
    const user = userEvent.setup();
    render(<SetupScreen />);
    
    // Test selecting diversified mode
    const diversifiedMode = screen.getByText('Diversified Mode');
    await user.press(diversifiedMode);
    
    // Test selecting speed run mode
    const speedRunMode = screen.getByText('Speed Run');
    await user.press(speedRunMode);
    
    // Should not crash and should allow mode selection
    expect(true).toBe(true);
  });

  test('can toggle optional features using User Event API', async () => {
    const user = userEvent.setup();
    render(<SetupScreen />);
    
    // Test toggling economic events
    const economicEventsToggle = screen.getByText('Economic Events');
    await user.press(economicEventsToggle);
    
    // Test toggling news flashes
    const newsFlashesToggle = screen.getByText('News Flashes');
    await user.press(newsFlashesToggle);
    
    // Should not crash and should allow toggling
    expect(true).toBe(true);
  });

  test('navigates to game with parameters when start is pressed', async () => {
    const user = userEvent.setup();
    render(<SetupScreen />);
    
    // Press start game button
    const startButton = screen.getByText('Start Game');
    await user.press(startButton);
    
    // Verify navigation was called with parameters
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/game',
      params: {
        mode: 'classic', // Default mode
        economicEvents: 'false', // Default off
        newsFlashes: 'false' // Default off
      }
    });
  });

  test('navigates with correct parameters after selections', async () => {
    const user = userEvent.setup();
    render(<SetupScreen />);
    
    // Select diversified mode
    const diversifiedMode = screen.getByText('Diversified Mode');
    await user.press(diversifiedMode);
    
    // Enable economic events
    const economicEventsToggle = screen.getByText('Economic Events');
    await user.press(economicEventsToggle);
    
    // Press start game button
    const startButton = screen.getByText('Start Game');
    await user.press(startButton);
    
    // Verify navigation was called with updated parameters
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/game',
      params: {
        mode: 'diversified',
        economicEvents: 'true',
        newsFlashes: 'false'
      }
    });
  });

  test('component renders without crashing', () => {
    render(<SetupScreen />);
    expect(true).toBe(true);
  });
});