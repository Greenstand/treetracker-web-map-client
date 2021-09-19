/*
 * Material-UI Theme for the entire application
 */
import {createTheme} from "@material-ui/core/styles";

const PRIMARY = "#8bc34a"
const SECONDARY = "#ffca28"

const theme = createTheme({
  spacing		: 4,
  typography		: {
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
      main: PRIMARY,
    },
    secondary: {
      main: SECONDARY,
    }
  },
});

export default theme;
