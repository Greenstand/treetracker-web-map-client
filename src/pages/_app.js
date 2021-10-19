import '../style.css';

import { ThemeProvider } from '@material-ui/core/styles';

import Layout from '../components/Layout';
import { MapContextProvider } from '../mapContext';
import appTheme from '../theme';

function TreetrackerApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={appTheme}>
      <MapContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MapContextProvider>
    </ThemeProvider>
  );
}

export default TreetrackerApp;
