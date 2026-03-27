import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { colors, colorsDark, ThemeColors } from './colors';
import { fontFamily, fontSize, fontWeight, lineHeight } from './typography';
import { radius, spacing, touchTarget } from './spacing';
import { shadows, shadowsDark, ThemeShadows } from './shadows';

export type ColorScheme = 'light' | 'dark' | 'system';

interface Theme {
  colors: ThemeColors;
  shadows: ThemeShadows;
  spacing: typeof spacing;
  radius: typeof radius;
  touchTarget: typeof touchTarget;
  fontFamily: typeof fontFamily;
  fontSize: typeof fontSize;
  fontWeight: typeof fontWeight;
  lineHeight: typeof lineHeight;
  isDark: boolean;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<Theme | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  initialColorScheme?: ColorScheme;
}

export function ThemeProvider({ children, initialColorScheme = 'system' }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(initialColorScheme);

  const isDark = useMemo(() => {
    if (colorScheme === 'system') {
      return systemColorScheme === 'dark';
    }
    return colorScheme === 'dark';
  }, [colorScheme, systemColorScheme]);

  const themeColors = isDark ? colorsDark : colors;
  const themeShadows = isDark ? shadowsDark : shadows;

  const handleSetColorScheme = useCallback((scheme: ColorScheme) => {
    setColorScheme(scheme);
  }, []);

  const theme = useMemo<Theme>(
    () => ({
      colors: themeColors,
      shadows: themeShadows,
      spacing,
      radius,
      touchTarget,
      fontFamily,
      fontSize,
      fontWeight,
      lineHeight,
      isDark,
      colorScheme,
      setColorScheme: handleSetColorScheme,
    }),
    [themeColors, themeShadows, isDark, colorScheme, handleSetColorScheme],
  );

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return theme;
}
