import '../style.css';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import log from 'loglevel';
import Layout from '../components/Layout';
import LayoutMobile from '../components/LayoutMobile';
import LayoutMobileB from '../components/LayoutMobileB';
import { MapContextProvider } from '../mapContext';
import appTheme from '../theme';

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  // eslint-disable-next-line global-require
  require('../mocks');
}

let muiCache;

// eslint-disable-next-line no-return-assign
export const createMuiCache = () =>
  (muiCache = createCache({
    key: 'mui',
    prepend: true,
  }));

function TreetrackerApp({ Component, pageProps }) {
  const isDesktop = useMediaQuery(appTheme.breakpoints.up('sm'));
  log.warn('app: isDesktop: ', isDesktop);
  // log.warn('app: component: ', Component);
  log.warn('app: component: isBLayout', Component.isBLayout);
  return (
    <CacheProvider value={muiCache ?? createMuiCache()}>
      <ThemeProvider theme={appTheme}>
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
      </ThemeProvider>
    </CacheProvider>
  );
}

export default TreetrackerApp;
