/*
 * Material-UI Theme for the entire application
 */
import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  spacing: 4,
  typography: {
    fontFamily: ['Lato', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(
      ',',
    ),
    fontWeight: 400,
    h1: {
      fontFamily: ['Montserrat'].join(','),
      fontSize: '48px',
      fontWeight: 700,
      lineHeight: '63px',
    },
    h2: {
      fontFamily: 'Montserrat',
      fontSize: '36px',
      lineHeight: '44px',
      fontWeight: 700,
    },
    h3: {
      fontFamily: 'Montserrat',
      fontSize: '20px',
      lineHeight: '28px',
      fontWeight: 700,
    },
    h4: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
    },
    h5: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
    },
    h6: {
      fontFamily: 'Montserrat',
      fontWeight: 700,
    },
    subtitle1: {
      fontSize: 36,
      fontWeight: 700,
      color: '#474B4F',
    },
    subtitle2: {
      fontSize: 24,
      fontWeight: 700,
      color: '#474B4F',
    },
  },
  palette: {
    primary: {
      main: '#FFFFFF',
    },
    secondary: {
      main: '#61892F',
    },
    success: {
      main: '#86C232',
    },
    textPrimary: {
      main: '#373A3E',
    },
    textSecondary: {
      main: '#848484',
    },
    lightGreen: '#86C232',
  },
});

export default theme;
