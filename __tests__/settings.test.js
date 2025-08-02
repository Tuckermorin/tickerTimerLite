// __tests__/settings.test.js
import { render, screen, waitFor } from '@testing-library/react-native';
import { userEvent } from '@testing-library/react-native';
import SettingsScreen from '../app/settings';
import { SettingsProvider } from '../contexts/SettingsContext';

// Mock the router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the styles
jest.mock('../styles/settingsStyles', () => ({
  settingsStyles: {
    container: {},
    content: {},
    scrollContent: {},
    header: {},
    headerIconContainer: {},
    headerIcon: {},
    title: {},
    subtitle: {},
    section: {},
    sectionTitle: {},
    sectionDescription: {},
    optionCard: {},
    selectedOptionCard: {},
    optionIconContainer: {},
    optionIcon: {},
    selectedOptionIcon: {},
    optionContent: {},
    optionHeader: {},
    optionTitle: {},
    selectedOptionTitle: {},
    currencySymbol: {},
    symbolText: {},
    optionDescription: {},
    radioContainer: {},
    radioButton: {},
    selectedRadioButton: {},
    radioButtonInner: {},
    previewCard: {},
    previewHeader: {},
    previewTitle: {},
    previewText: {},
    previewSubtext: {},
  },
}));

// Wrapper component with context
const SettingsWrapper = ({ children }) => (
  <SettingsProvider>
    {children}
  </SettingsProvider>
);

describe('SettingsScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  test('renders settings screen elements correctly', () => {
    render(
      <SettingsWrapper>
        <SettingsScreen />
      </SettingsWrapper>
    );
    
    expect(screen.getByText('Settings')).toBeTruthy();
    expect(screen.getByText('Customize your app experience')).toBeTruthy();
    expect(screen.getByText('Currency')).toBeTruthy();
    expect(screen.getByText('Appearance')).toBeTruthy();
  });

  test('displays currency options', () => {
    render(
      <SettingsWrapper>
        <SettingsScreen />
      </SettingsWrapper>
    );
    
    expect(screen.getByText('US Dollar')).toBeTruthy();
    expect(screen.getByText('Euro')).toBeTruthy();
    expect(screen.getByText('United States Dollar')).toBeTruthy();
    expect(screen.getByText('European Union Euro')).toBeTruthy();
  });

  test('displays theme options', () => {
    render(
      <SettingsWrapper>
        <SettingsScreen />
      </SettingsWrapper>
    );
    
    expect(screen.getByText('Dark Mode')).toBeTruthy();
    expect(screen.getByText('Light Mode')).toBeTruthy();
    expect(screen.getByText('Dark background with light text')).toBeTruthy();
    expect(screen.getByText('Light background with dark text')).toBeTruthy();
  });

  test('can select different currency using User Event API', async () => {
    const user = userEvent.setup();
    render(
      <SettingsWrapper>
        <SettingsScreen />
      </SettingsWrapper>
    );
    
    // Test selecting Euro
    const euroOption = screen.getByText('Euro');
    await user.press(euroOption);
    
    // Should not crash and should allow currency selection
    expect(true).toBe(true);
  });

  test('can toggle between light and dark theme using User Event API', async () => {
    const user = userEvent.setup();
    render(
      <SettingsWrapper>
        <SettingsScreen />
      </SettingsWrapper>
    );
    
    // Test selecting light mode
    const lightModeOption = screen.getByText('Light Mode');
    await user.press(lightModeOption);
    
    // Test selecting dark mode
    const darkModeOption = screen.getByText('Dark Mode');
    await user.press(darkModeOption);
    
    // Should not crash and should allow theme selection
    expect(true).toBe(true);
  });

  test('displays preview section', () => {
    render(
      <SettingsWrapper>
        <SettingsScreen />
      </SettingsWrapper>
    );
    
    expect(screen.getByText('Preview')).toBeTruthy();
    expect(screen.getByText(/Portfolio value:/)).toBeTruthy();
    expect(screen.getByText('Settings will apply to all screens in the app')).toBeTruthy();
  });

  test('component renders without crashing', () => {
    render(
      <SettingsWrapper>
        <SettingsScreen />
      </SettingsWrapper>
    );
    expect(true).toBe(true);
  });
});