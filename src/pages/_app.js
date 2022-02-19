import '../style.css';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import log from 'loglevel';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import LayoutEmbed from '../components/LayoutEmbed';
import LayoutMobile from '../components/LayoutMobile';
import LayoutMobileB from '../components/LayoutMobileB';
import useEmbed from '../hooks/useEmbed';
import { MapContextProvider } from '../mapContext';
import appTheme from '../theme';

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
  const nextExtraIsDesktop = useMediaQuery(appTheme.breakpoints.up('sm'));
  const nextExtraIsEmbed = useEmbed();
  log.warn('app: isDesktop: ', nextExtraIsDesktop);
  log.warn('app: component: ', Component);
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
      <ThemeProvider theme={appTheme}>
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
          {!nextExtraIsDesktop && !Component.isBLayout && (
            <LayoutMobile>
              <Component {...pageProps} {...extraProps} />
            </LayoutMobile>
          )}
          {!nextExtraIsDesktop && Component.isBLayout && (
            <LayoutMobileB>
              <Component {...pageProps} {...extraProps} />
            </LayoutMobileB>
          )}
        </MapContextProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default TreetrackerApp;
