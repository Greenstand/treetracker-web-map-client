/*
 * Material-UI Theme for the entire application
 */
import {createMuiTheme} from "@material-ui/core/styles";

const PRIMARY = "#8bc34a"
const SECONDARY = "#ffca28"

const theme = createMuiTheme({
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
