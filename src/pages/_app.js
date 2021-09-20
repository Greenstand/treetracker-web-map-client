import '../style.css';
import Layout from '../components/Layout';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const PRIMARY = '#8bc34a';
const SECONDARY = '#ffca28';
const theme = createMuiTheme({
  spacing: 4,
  typography: {
    fontFamily: ['Roboto', 'Lato', 'Helvetica', 'Arial', 'sans-serif'].join(
      ',',
    ),
  },
  palette: {
    primary: {
      main: PRIMARY,
    },
    secondary: {
      main: SECONDARY,
    },
  },
});

function TreetrackerApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default TreetrackerApp;
