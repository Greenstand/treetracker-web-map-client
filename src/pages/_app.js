import '../style.css';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useMediaQuery, useTheme } from '@mui/material';
import log from 'loglevel';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import LayoutEmbed from '../components/LayoutEmbed';
import LayoutMobile from '../components/LayoutMobile';
import LayoutMobileB from '../components/LayoutMobileB';
import LayoutMobileC from '../components/LayoutMobileC';
import { DrawerProvider } from '../context/DrawerContext';
import { CustomThemeProvider } from '../context/themeContext';
import useEmbed from '../hooks/useEmbed';
import { MapContextProvider } from '../mapContext';

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  log.warn('Mocking API calls with msw');
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
  const theme = useTheme();
  const nextExtraIsDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  const nextExtraIsEmbed = useEmbed();
  log.warn('app: isDesktop: ', nextExtraIsDesktop);
  log.warn('app: component: ', Component);
  // log.warn('app: component: ', Component);
  log.warn('app: component: isBLayout', Component.isBLayout);
  const router = useRouter();
  log.warn('router:', router);
  const nextExtraKeyword = router.query.keyword;

  const extraProps = {
    nextExtraIsEmbed,
    nextExtraIsDesktop,
    nextExtraKeyword,
  };
  return (
    <CacheProvider value={muiCache ?? createMuiCache()}>
      <CustomThemeProvider>
        <DrawerProvider>
          <MapContextProvider>
            {nextExtraIsDesktop && !nextExtraIsEmbed && (
              <Layout>
                <Component {...pageProps} {...extraProps} />
              </Layout>
            )}
            {nextExtraIsDesktop && nextExtraIsEmbed && (
              <LayoutEmbed isFloatingDisabled={Component.isFloatingDisabled}>
                <Component {...pageProps} {...extraProps} />
              </LayoutEmbed>
            )}
            {!nextExtraIsDesktop && Component.isBLayout && (
              <LayoutMobileB>
                <Component {...pageProps} {...extraProps} />
              </LayoutMobileB>
            )}
            {!nextExtraIsDesktop && Component.isCLayout && (
              <LayoutMobileC>
                <Component {...pageProps} {...extraProps} />
              </LayoutMobileC>
            )}
            {!nextExtraIsDesktop &&
              !Component.isBLayout &&
              !Component.isCLayout && (
                <LayoutMobile>
                  <Component {...pageProps} {...extraProps} />
                </LayoutMobile>
              )}
          </MapContextProvider>
        </DrawerProvider>
      </CustomThemeProvider>
    </CacheProvider>
  );
}

export default TreetrackerApp;
