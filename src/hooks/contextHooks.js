import { useContext } from 'react';
import { PlaygroundContext } from '../context/playgroundContext';
import { CustomThemeContext } from '../context/themeContext';

// Return colorMode and theme from them context
export function useCustomThemeContext() {
  return useContext(CustomThemeContext);
}

// Return Playground context data

export const usePlaygroundTheme = () => {
  const { theme, setTheme } = useContext(PlaygroundContext);
  return [theme, setTheme];
};

export const usePlaygroundThemeType = () => {
  const { themeType, setThemeType } = useContext(PlaygroundContext);
  return [themeType, setThemeType];
};

export const usePlaygroundFonts = () => {
  const { fonts, setFonts } = useContext(PlaygroundContext);
  return [fonts, setFonts];
};

export const usePlaygroundUtils = () => {
  const { resetTheme, getPropByPath, setPropByPath } =
    useContext(PlaygroundContext);
  return { resetTheme, getPropByPath, setPropByPath };
};
