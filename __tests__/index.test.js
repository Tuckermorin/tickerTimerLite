import { render, screen } from '@testing-library/react-native';
import { userEvent } from '@testing-library/react-native';
import HomeScreen from '../index';

// Mock the router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  test('renders home screen elements correctly using getByText', () => {
    render(<HomeScreen />);
    
    // Test the actual text that exists in your component
    expect(screen.getByText('Market Timer')).toBeTruthy();
    expect(screen.getByText('Can you beat the market?')).toBeTruthy();
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
    const existingElement = screen.queryByText('Market Timer');
    const nonExistentElement = screen.queryByText('This text does not exist');
    
    expect(existingElement).toBeTruthy();
    expect(nonExistentElement).toBeNull();
  });

  test('navigates to game screen when start button is pressed using User Event API', async () => {
    const user = userEvent.setup();
    render(<HomeScreen />);
    
    // Test User Event API - realistic button press
    const startButton = screen.getByTestId('start-challenge-button');
    await user.press(startButton);
    
    // Verify navigation was called
    expect(mockPush).toHaveBeenCalledWith('/game');
  });

  test('renders key sections using getByText', () => {
    render(<HomeScreen />);
    
    expect(screen.getByText('🎮 How It Works')).toBeTruthy();
    expect(screen.getByText('💡 The Challenge')).toBeTruthy();
    expect(screen.getByText('📊 What You\'ll Experience')).toBeTruthy();
  });
});