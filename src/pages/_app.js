import '../style.css';
import Layout from '../components/Layout';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import appTheme from "../theme";

function TreetrackerApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={appTheme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default TreetrackerApp;
