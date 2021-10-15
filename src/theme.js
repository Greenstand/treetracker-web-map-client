/*
 * Material-UI Theme for the entire application
 */
import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  spacing: 4,
  typography: {
    fontFamily: ['Roboto', 'Lato', 'Helvetica', 'Arial', 'sans-serif'].join(
      ',',
    ),
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
