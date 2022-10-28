import '../style.css';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { LinearProgress, Box, useTheme, useMediaQuery } from '@mui/material';
import log from 'loglevel';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../components/Layout';
import LayoutDashboard from '../components/LayoutDashboard';
import LayoutEmbed from '../components/LayoutEmbed';
import LayoutMobile from '../components/LayoutMobile';
import LayoutMobileB from '../components/LayoutMobileB';
import LayoutMobileC from '../components/LayoutMobileC';
import { DrawerProvider } from '../context/DrawerContext';
import { CustomThemeProvider } from '../context/themeContext';
import { useLocalStorage, useEmbed } from '../hooks/globalHooks';
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
  log.warn('!!!! render the _app');
  const router = useRouter();
  const theme = useTheme();

  const embedLocalStorage = useLocalStorage('embed', false);
  const nextExtraIsDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  const nextExtraIsEmbed = useEmbed() === true ? true : embedLocalStorage[0];
  const nextExtraKeyword = router.query.keyword;
  const [nextExtraLoading, setNextExtraLoading] = React.useState(false);

  log.warn('app: isDesktop: ', nextExtraIsDesktop);
  log.warn('app: component: ', Component);
  // log.warn('app: component: ', Component);
  log.warn('app: component: isBLayout', Component.isBLayout);
  log.warn('router:', router);

  React.useEffect(() => {
    const handleRouteChange = (url) => {
      log.warn('handleRouteChange:', url);
      // setTimeout(() => {
      //   if (url !== router.asPath) {
      setNextExtraLoading(true);
      //   }
      // }, '500');
    };

    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', () => {
      log.warn('handleRouteChangeComplete::');
      setNextExtraLoading(false);
    });
    router.events.on('routeChangeError', (...arg) => {
      log.warn('handleChangeError:', ...arg);
      setNextExtraLoading(false);
    });

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', () => {
        log.warn('off routeChangeComplete:');
        setNextExtraLoading(false);
      });
      router.events.off('routeChangeError', (...arg) => {
        log.warn('off routerChangeError', ...arg);
        setNextExtraLoading(false);
      });
    };
  });

  const extraProps = {
    nextExtraIsEmbed,
    nextExtraIsEmbedCallback: embedLocalStorage[1],
    nextExtraIsDesktop,
    nextExtraKeyword,
    nextExtraLoading,
  };

  const isAdmin = !!router.asPath.match(/admin/);
  if (isAdmin) {
    return (
      <LayoutDashboard>
        <Component {...pageProps} />
      </LayoutDashboard>
    );
  }

  return (
    <>
      <CacheProvider value={muiCache ?? createMuiCache()}>
        <CustomThemeProvider>
          <DrawerProvider>
            <MapContextProvider>
              {nextExtraIsDesktop && !nextExtraIsEmbed && (
                <Layout {...extraProps}>
                  <Component {...pageProps} {...extraProps} />
                </Layout>
              )}
              {nextExtraIsDesktop && nextExtraIsEmbed && (
                <LayoutEmbed
                  {...extraProps}
                  isFloatingDisabled={Component.isFloatingDisabled}
                >
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
      {nextExtraLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            zIndex: 9999,
            width: '100%',
          }}
        >
          <LinearProgress />
        </Box>
      )}
    </>
  );
}

export default TreetrackerApp;
