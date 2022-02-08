// eslint-disable-next-line import/extensions
import '../style.css';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
// import { ThemeProvider } from '@mui/material/styles';
import { useMediaQuery, useTheme } from '@mui/material';
import log from 'loglevel';
import Layout from '../components/Layout';
import LayoutMobile from '../components/LayoutMobile';
import LayoutMobileB from '../components/LayoutMobileB';
import { CustomThemeProvider } from '../context/themeContext';
import { MapContextProvider } from '../mapContext';

let muiCache;

// eslint-disable-next-line no-return-assign
export const createMuiCache = () =>
  (muiCache = createCache({
    key: 'mui',
    prepend: true,
  }));

function TreetrackerApp({ Component, pageProps }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  log.warn('app: isDesktop: ', isDesktop);
  log.warn('app: component: ', Component);
  log.warn('app: component: isBLayout', Component.isBLayout);
  return (
    <CacheProvider value={muiCache ?? createMuiCache()}>
      <CustomThemeProvider>
        <MapContextProvider>
          {isDesktop && (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
          {!isDesktop && !Component.isBLayout && (
            <LayoutMobile>
              <Component {...pageProps} />
            </LayoutMobile>
          )}
          {!isDesktop && Component.isBLayout && (
            <LayoutMobileB>
              <Component {...pageProps} />
            </LayoutMobileB>
          )}
        </MapContextProvider>
      </CustomThemeProvider>
    </CacheProvider>
  );
}

export default TreetrackerApp;
