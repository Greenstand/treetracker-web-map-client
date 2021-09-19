/*
 * Material-UI Theme for the entire application
 */
import {createTheme} from '@material-ui/core/styles';

const theme = createTheme({
  spacing: 4,
  typography: {
    fontFamily: [
      'Roboto',
      'Lato',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
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
      main: '#848484'
    },
    lightGreen: '#86C232',
  },
});

export default theme;
