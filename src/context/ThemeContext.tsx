import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { colors as lightColors } from '~/constants/colors';
import { storageHelper, StorageKeys } from '~/utils/storage';

// ─── Dark Theme Colors ─────────────────────────────────────
const darkColors = {
  primary: {
    main: '#0A7C50',
    dark: '#085D3C',
    light: '#0F9E64',
  },
  secondary: {
    main: '#FFD54F',
    dark: '#FFC107',
    light: '#FFE082',
  },
  background: {
    light: '#121212',
    dark: '#1E1E1E',
    darker: '#2C2C2C',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B0B0B0',
    disabled: '#666666',
  },
  border: {
    light: '#333333',
    main: '#555555',
    dark: '#777777',
  },
  success: {
    main: '#66BB6A',
    dark: '#4CAF50',
    light: '#81C784',
  },
  error: {
    main: '#EF5350',
    dark: '#E53935',
    light: '#EF9A9A',
  },
  warning: {
    main: '#FFA726',
    dark: '#FB8C00',
    light: '#FFCC80',
  },
  info: {
    main: '#42A5F5',
    dark: '#1E88E5',
    light: '#90CAF9',
  },
} as const;

// ─── Theme Type ────────────────────────────────────────────
export type Theme = 'light' | 'dark';
export type Colors = typeof lightColors;

interface ThemeContextValue {
  theme: Theme;
  colors: Colors;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// ─── Context ───────────────────────────────────────────────
const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────
interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('light');

  // Initialize theme from MMKV storage or system
  useEffect(() => {
    try {
      // Get theme from MMKV storage (synchronous)
      const storedTheme = storageHelper.getString(StorageKeys.THEME) as Theme | undefined;

      if (storedTheme === 'light' || storedTheme === 'dark') {
        setThemeState(storedTheme);
      } else {
        // Use system theme if no preference saved
        const systemTheme = Appearance.getColorScheme();
        setThemeState(systemTheme === 'dark' ? 'dark' : 'light');
      }
    } catch (error) {
      setThemeState('light');
    }
  }, []);

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(
      ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
        // Check if user has saved preference
        const storedTheme = storageHelper.getString(StorageKeys.THEME);

        // Only follow system if no preference saved
        if (!storedTheme && colorScheme) {
          setThemeState(colorScheme === 'dark' ? 'dark' : 'light');
        }
      }
    );

    return () => subscription.remove();
  }, []);

  /**
   * Set theme and save to MMKV storage
   */
  const setTheme = (newTheme: Theme) => {
    try {
      // Save to MMKV storage (synchronous)
      storageHelper.setString(StorageKeys.THEME, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  /**
   * Toggle between light and dark theme
   */
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Get colors based on current theme
  const pickedColors = theme === 'dark' ? darkColors : lightColors;

  const value: ThemeContextValue = {
    theme,
    colors: pickedColors as ThemeContextValue['colors'],
    isDark: theme === 'dark',
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ─── Hook ──────────────────────────────────────────────────
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}

/**
 * Optimized selectors untuk prevent unnecessary re-renders
 */
export const useThemeColors = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeColors must be used within ThemeProvider');
  }
  return context.colors;
};

export const useIsDark = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useIsDark must be used within ThemeProvider');
  }
  return context.isDark;
};

export const useThemeToggle = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeToggle must be used within ThemeProvider');
  }
  return context.toggleTheme;
};