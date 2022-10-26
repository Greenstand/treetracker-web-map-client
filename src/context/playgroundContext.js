import React, { useEffect, createContext, useState, useCallback } from 'react';
import { buildTheme } from './themeContext';
import { useLocalStorage } from '../hooks/globalHooks';
import { predefinedFonts } from '../models/themePlaygroundOptions';
import * as utils from '../models/utils';

const getInitialTheme = () => {
  // init default theme
  const lightTheme = buildTheme('light');
  const darkTheme = buildTheme('dark');
  const initialTheme = {
    ...lightTheme,
    components: {
      dark: darkTheme.components,
      light: lightTheme.components,
    },
    palette: {
      dark: darkTheme.palette,
      light: lightTheme.palette,
    },
    fonts: { ...predefinedFonts },
  };
  return initialTheme;
};

export const PlaygroundContext = createContext({});

export function PlaygroundProvider({ children }) {
  const [themeType, setThemeType] = useLocalStorage('theme', 'light');
  const [themeObject, setThemeObject] = useLocalStorage(
    'themeObject',
    undefined,
  );
  const [fonts, setFonts] = useState(() => predefinedFonts);
  const [theme, setTheme] = useState(getInitialTheme());

  useEffect(() => {
    if (themeObject === undefined) return;
    // set theme for customization to the saved theme
    setTheme((prevTheme) => ({
      ...prevTheme,
      ...themeObject,
    }));

    if (!themeObject.fonts) return;
    const fontArr = utils.convertFontObjToFontArr(themeObject.fonts);
    utils.loadFonts(fontArr).then((fontsLoaded) => {
      if (!fontsLoaded) return;
      setFonts((prevFonts) => ({
        ...prevFonts,
        ...themeObject.fonts,
      }));
    });
  }, []);

  useEffect(() => {
    setTheme((prevTheme) => ({
      ...prevTheme,
      fonts: { ...fonts },
    }));
  }, [fonts]);

  const resetTheme = () => {
    setTheme(getInitialTheme());
    setFonts(predefinedFonts);
  };

  /**
   * set mui theme prop by path
   *
   * @param {string} propPath - path to the prop
   * @param {string|number} value - new value of the prop
   *
   * @example
   * setPropByPath('palette.primary.main', '#FFFF33')
   *
   * @returns the new theme
   */
  const setPropByPath = (propPath, value) => {
    const updatedTheme = utils.setPropByPath(propPath, value, theme);
    setTheme((prevTheme) => ({
        ...prevTheme,
        ...updatedTheme,
      }));
    return updatedTheme;
  };

  /**
   * get mui theme prop by path
   *
   * @param {string} propPath - path to the prop
   *
   * @example
   * // returns #FFFF33
   * getPropByPath('palette.primary.main')
   *
   * @example
   * // returns { main: xxx, light: xxx, dark: xxx }
   * getPropByPath('palette.primary')
   */
  const getPropByPath = useCallback(
    (propPath) => utils.getPropByPath(propPath, theme),
    [theme],
  );

  const contextValue = React.useMemo(
    () => ({
      theme,
      setTheme,
      themeType,
      setThemeType,
      fonts,
      setFonts,
      resetTheme,
      getPropByPath,
      setPropByPath,
    }),
    [
      theme,
      setTheme,
      themeType,
      setThemeType,
      fonts,
      setFonts,
      resetTheme,
      getPropByPath,
      setPropByPath,
    ],
  );

  return (
    <PlaygroundContext.Provider value={contextValue}>
      {children}
    </PlaygroundContext.Provider>
  );
}
