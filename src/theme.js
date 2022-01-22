/*
 * Material-UI Theme for the entire application
 */
import { createTheme } from '@mui/material/styles';

const colorTheme = createTheme({
  spacing: 4,
  palette: {
    background: {
      greenGradient:
        'linear-gradient(291.29deg, rgba(134, 194, 50, 0.65) 14.04%, rgba(134, 194, 50, 0.4) 86%, rgba(134, 194, 50, 0.45) 86%)',
      greenOrangeLightGr:
        'linear-gradient(291.56deg, rgba(255, 122, 0, 0.4) 0%, rgba(117, 185, 38, 0.15) 98.94%)',
      greenOrangeLightGrInverse:
        'linear-gradient(111.41deg, rgba(255, 122, 0, 0.15) 1.62%, rgba(117, 185, 38, 0.4) 98.96%)',
      OrangeGreenGradient:
        'linear-gradient(90.06deg, rgba(255, 165, 0, 0.45) 0.79%, rgba(117, 185, 38, 0.45) 49.97%, rgba(96, 137, 47, 0.6) 99.95%)',
      OrangeGreenGradientDark:
        'linear-gradient(90deg, rgba(255, 165, 0, 0.225) 0%, rgba(255, 122, 0, 0.2625) 48.96%, rgba(134, 194, 64, 0.45) 100%)',
    },
    primary: {
      main: '#61892F',
    },
    secondary: {
      main: '#86C232',
      contrastText: '#fff',
    },
    textPrimary: {
      main: '#474B4F',
    },
    textSecondary: {
      main: '#222629',
    },
    textAlternative: {
      main: '#373A3E',
    },
    textLight: {
      main: '#6B6E70',
    },
  },
});

const theme = createTheme(colorTheme, {
  typography: {
    fontFamily: ['Lato', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(
      ',',letterSpacing: 0,
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
      fontWeight: 600,
      [colorTheme.breakpoints.down('md')]: {
        lineHeight: '30px',
        fontSize: '24px',
      },
    },
    h3: {
      fontFamily: 'Montserrat',
      fontSize: '32px',
      lineHeight: '28px',
      fontWeight: 600,
      [colorTheme.breakpoints.down('md')]: {
        fontSize: '16px',
      },
    },
    h4: {
      fontFamily: 'Montserrat',
      fontSize: '28px',
      fontWeight: 700,
      [colorTheme.breakpoints.down('md')]: {
        fontSize: '20px',
      },
    },
    h5: {
      fontSize: '20px',
      fontWeight: 700,
      [colorTheme.breakpoints.down('md')]: {
        fontSize: '16px',
      },
    },
    h6: {
      fontSize: '16px',
      fontWeight: 700,
    },
    body1: {
      letterSpacing: '0.04em',
      [colorTheme.breakpoints.down('md')]: {
        fontSize: '14px',
      },
    },
  },
});

export default theme;
