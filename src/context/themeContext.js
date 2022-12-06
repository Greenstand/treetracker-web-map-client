import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import log from 'loglevel';
import React from 'react';
import { useLocalStorage } from '../hooks/globalHooks';
import { loadFonts, convertFontObjToFontArr } from '../models/utils';

export const CustomThemeContext = React.createContext({
  toggleColorMode: () => {},
});

export function buildTheme(theMode) {
  const getDesign = (themeMode) => ({
    spacing: 4,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            '&.MuiButton-outlined': {
              ...(themeMode === 'light'
                ? {}
                : {
                    color: '#eee',
                  }),
            },
            '&.Mui-disabled': {
              ...(themeMode === 'light'
                ? {}
                : {
                    color: '#eee',
                    backgroundColor: '#1d1d1d',
                    opacity: 0.75,
                  }),
            },
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          primary: {
            ...(themeMode === 'light'
              ? {
                  backgroundColor: '#fff',
                  color: '#1d1d1d',
                }
              : {
                  backgroundColor: '#333',
                  color: '#eee',
                }),
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            ...(themeMode === 'light'
              ? {
                  borderColor: '#E5E5E5',
                }
              : {
                  borderColor: '#878585',
                }),
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            ...(themeMode === 'light'
              ? {
                  color: '#474B4F',
                }
              : {
                  color: '#fff',
                }),
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            ...(themeMode === 'light'
              ? {
                  color: '#222629',
                }
              : {
                  color: '#eee',
                }),
          },
        },
      },
    },
    palette: {
      background: {
        ...(themeMode === 'light'
          ? {
              //  paper: '#fff',
              paperDark: '#6B6E70',
              avatar: '#FFFFFF',
            }
          : {
              default: '#333',
              // paper: '#333',
              paper: '#4a4747',
              paperDark: '#6B6E70',
              avatar: '#4A4747',
            }),
        greenGradient:
          'linear-gradient(291.29deg, rgba(134, 194, 50, 0.65) 14.04%, rgba(134, 194, 50, 0.4) 86%, rgba(134, 194, 50, 0.45) 86%)',
        // greenOrangeLightGr:
        //   'linear-gradient(291.56deg, rgba(255, 122, 0, 0.4) 0%, rgba(117, 185, 38, 0.15) 98.94%)',
        // greenOrangeLightGrInverse:
        //   'linear-gradient(111.41deg, rgba(255, 122, 0, 0.15) 1.62%, rgba(117, 185, 38, 0.4) 98.96%)',
        OrangeGreenGradient:
          themeMode === 'light'
            ? 'linear-gradient(90.06deg, rgba(255, 165, 0, 0.45) 0.79%, rgba(117, 185, 38, 0.45) 49.97%, rgba(96, 137, 47, 0.6) 99.95%)'
            : 'linear-gradient(90deg, rgba(255, 165, 0, 0.225) 0%, rgba(255, 122, 0, 0.2625) 48.96%, rgba(134, 194, 64, 0.45) 100%)',
      },
      primary: {
        ...(themeMode === 'light'
          ? {
              main: '#61892F',
            }
          : {
              main: '#76B024',
            }),
      },
      primaryLight: {
        ...(themeMode === 'light'
          ? {
              main: '#86C232',
            }
          : {
              main: '#86C232',
            }),
      },
      secondary: {
        ...(themeMode === 'light'
          ? {
              main: '#FF7A00',
              // contrastText: '#222629',
            }
          : {
              main: '#FF7A00',
              // contrastText: '#222629',
            }),
      },
      secondaryLight: {
        ...(themeMode === 'light'
          ? {
              main: '#FFA500',
              // contrastText: '#222629',
            }
          : {
              main: '#FFA500',
              // contrastText: '#222629',
            }),
      },
      // a color that do not have primary color (like the branding green color)
      // can be used in place like the `back` button on the corner
      notImportant: {
        ...(themeMode === 'light'
          ? {
              main: '#6B6E70',
            }
          : {
              main: '#a5a8a9',
            }),
      },
      // a light orange color, used in some components as background color
      greyLight: {
        ...(themeMode === 'light'
          ? {
              main: '#6B6E70',
              contrastText: '#fff',
            }
          : {
              main: '#6B6E70',
              contrastText: '#fff',
            }),
      },
      darkGrey: {
        ...(themeMode === 'light'
          ? {
              main: '#474B4F',
              contrastText: '#474B4F',
            }
          : {
              main: '#474B4F',
              contrastText: '#474B4F',
            }),
      },
      nearBlack: {
        ...(themeMode === 'light'
          ? {
              main: '#222629',
              contrastText: '#474B4F',
            }
          : {
              main: '#222629',
              contrastText: '#474B4F',
            }),
      },
      // Changes text color based on theme
      text: {
        ...(themeMode === 'light'
          ? {
              primary: '#474B4F',
              primaryReverse: '#eee',
              disabled: '#6B6E70',
              secondary: '#222629',
              text1: '#222629',
              text2: 'rgba(88, 91, 93, 0.6)',
            }
          : {
              primary: '#eee',
              primaryReverse: '#fff',
              disabled: '#eee',
              secondary: '#eee',
              text1: '#222629',
              text2: 'rgb(221 229 234 / 60%)',
            }),
      },
    },
  });

  const colorTheme = createTheme(getDesign(theMode));

  const theme = createTheme(colorTheme, {
    palette: {
      mode: theMode,
    },
    typography: {
      fontFamily: ['Lato', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(
        ',',
      ),
      fontWeight: 400,
      h1: {
        fontFamily: ['Montserrat'].join(','),
        fontSize: '48px',
        fontWeight: 600,
        lineHeight: '63px',
        [colorTheme.breakpoints.down('md')]: {
          lineHeight: '32px',
          fontSize: '32px',
        },
      },
      h2: {
        fontFamily: 'Montserrat',
        fontSize: '36px',
        lineHeight: '44px',
        fontWeight: 700,
        letterSpacing: 0,
        [colorTheme.breakpoints.down('md')]: {
          lineHeight: '29.26px',
          fontSize: '24px',
        },
      },
      h3: {
        fontFamily: 'Montserrat',
        fontSize: '32px',
        lineHeight: '39px',
        fontWeight: 600,
        [colorTheme.breakpoints.down('md')]: {
          fontSize: '20px',
          lineHeight: '24px',
        },
      },
      h4: {
        fontFamily: 'Montserrat',
        fontSize: '28px',
        fontWeight: 600,
        lineHeight: '33.6px',
        letterSpacing: 0,
        [colorTheme.breakpoints.down('md')]: {
          fontSize: '20px',
          lineHeight: '24px',
        },
      },
      h5: {
        fontFamily: 'Montserrat',
        fontSize: '20px',
        fontWeight: 700,
        lineHeight: '24px',
        letterSpacing: '0.02em',
        [colorTheme.breakpoints.down('md')]: {
          fontSize: '16px',
          lineHeight: '19.5px',
        },
      },
      h6: {
        fontFamily: 'Lato',
        fontSize: '16px',
        fontWeight: 700,
        lineHeight: '19px',
        letterSpacing: '0.02em',
      },
      body1: {
        fontFamily: 'Lato',
        fontSize: '16px',
        lineHeight: '19.2px',
        letterSpacing: '0.04em',
        [colorTheme.breakpoints.down('md')]: {
          fontSize: '12px',
          lineHeight: '14.4px',
        },
      },
      body2: {
        fontFamily: 'Lato',
        fontSize: '20px',
        lineHeight: '28px',
        letterSpacing: '0.04em',
        [colorTheme.breakpoints.down('md')]: {
          fontSize: '16px',
          lineHeight: '23.2px',
          letterSpacing: '0.02em',
        },
      },
      caption: {
        fontFamily: 'Lato',
        fontSize: '12px',
        lineHeight: '14.4px',
        letterSpacing: '0.04em',
      },
    },
  });

  return theme;
}

const defaultLightTheme = buildTheme('light');
const defaultDarkTheme = buildTheme('dark');

export function CustomThemeProvider({ children }) {
  const [mode, setMode] = useLocalStorage('theme', 'light');
  const [theme, setTheme] = React.useState(
    mode === 'light' ? defaultLightTheme : defaultDarkTheme,
  );
  const [themeObject, setThemeObject] = useLocalStorage('themeObject', null);
  const [fonts, setFonts] = React.useState([]);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const createThemeFromThemeObject = () =>
    createTheme({
      ...themeObject,
      palette: themeObject.palette[mode],
      components: themeObject.components[mode],
      spacing: theme.spacing,
    });

  function loadThemeFromServer() {
    const url = `${process.env.NEXT_PUBLIC_CONFIG_API}/organizations/1/theme`;
    axios.get(url).then((response) => {
      log.warn('loaded theme from server:', response);
      /**
       * !! should store the theme from server to the themeObject state !!
       * themeObject is used for customization has light/dark version
       * theme is the actual theme
       */
      setTheme(createTheme(response.data.theme));
    });
  }

  React.useEffect(() => {
    if (themeObject) {
      setTheme(createThemeFromThemeObject());

      // get fonts array from the themeObject and load them
      const fontArr = convertFontObjToFontArr(themeObject.fonts);
      loadFonts(fontArr).then((fontsLoaded) => {
        log.warn('custom fonts loaded:', fontsLoaded);
      });
      setFonts(fontArr);
    }
    if (process.env.NEXT_PUBLIC_CONFIG_API) {
      log.warn('to load theme from server');
      loadThemeFromServer();
    } else {
      log.warn(
        "There isn't setting's for config api, do not load theme from server",
      );
    }

    const handlePreviewEvent = (e) => {
      setThemeObject(e.detail.theme);
    };

    window.addEventListener(
      'playground:theme-update',
      handlePreviewEvent,
      false,
    );

    return () => {
      // remove event listener on unmount
      window.removeEventListener('playground:theme-update', handlePreviewEvent);
    };
  }, []);

  React.useEffect(() => {
    // set the theme to correct mode when the mode changes
    // if there is no custom theme set it to the default
    if (!themeObject) {
      setTheme(mode === 'light' ? defaultLightTheme : defaultDarkTheme);
    } else {
      setTheme(createThemeFromThemeObject());
    }
  }, [mode]);

  React.useEffect(() => {
    if (!themeObject) return;
    setTheme(() => {
      // create the new theme
      const newTheme = createThemeFromThemeObject();

      // create the font array from the new theme and check if there are changes
      // TODO: should find better method to check for changes
      const fontArr = convertFontObjToFontArr(newTheme.fonts);
      if (fontArr.join('-') === fonts.join('-')) return newTheme;

      loadFonts(fontArr).then((fontsLoaded) => {
        log.warn('custom fonts loaded:', fontsLoaded);
      });
      setFonts(fontArr);
      return newTheme;
    });
  }, [themeObject]);

  React.useEffect(() => {
    log.warn('theme changed', theme);
  }, [theme]);

  const value = React.useMemo(
    () => ({
      colorMode,
      theme,
    }),
    [colorMode, theme],
  );

  return (
    <CustomThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CustomThemeContext.Provider>
  );
}
