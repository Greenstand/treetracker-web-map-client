import '../style.css';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import log from 'loglevel';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import LayoutDashboard from '../components/LayoutDashboard';
import LayoutEmbed from '../components/LayoutEmbed';
import LayoutMobile from '../components/LayoutMobile';
import LayoutMobileB from '../components/LayoutMobileB';
import LayoutMobileC from '../components/LayoutMobileC';
import SpinnerOverlay from '../components/SpinnerOverlay';
import { DrawerProvider } from '../context/DrawerContext';
import { CustomThemeProvider } from '../context/themeContext';
import { useLocalStorage, useMobile, useEmbed } from '../hooks/globalHooks';
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
  const router = useRouter();
  const embedLocalStorage = useLocalStorage('embed', false);
  const nextExtraIsDesktop = !useMobile();
  const nextExtraIsEmbed = useEmbed() === true ? true : embedLocalStorage[0];
  const nextExtraKeyword = router.query.keyword;
  const [loading, setLoading] = useState(false);

  log.warn('app: isDesktop: ', nextExtraIsDesktop);
  log.warn('app: component: ', Component);
  // log.warn('app: component: ', Component);
  log.warn('app: component: isBLayout', Component.isBLayout);
  log.warn('router:', router);

  useEffect(() => {
    const handleRouteChange = (url) =>
      setTimeout(() => {
        if (url !== router.asPath) {
          setLoading(true);
        }
      }, '500');

    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', () => setLoading(false));
    router.events.on('routeChangeError', () => setLoading(false));

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', () => setLoading(false));
      router.events.off('routeChangeError', () => setLoading(false));
    };
  });

  const extraProps = {
    nextExtraIsEmbed,
    nextExtraIsEmbedCallback: embedLocalStorage[1],
    nextExtraIsDesktop,
    nextExtraKeyword,
    loading,
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
              <LayoutMobileB loading={loading}>
                <Component {...pageProps} {...extraProps} />
              </LayoutMobileB>
            )}
            {!nextExtraIsDesktop && Component.isCLayout && (
              <LayoutMobileC loading={loading}>
                <Component {...pageProps} {...extraProps} />
              </LayoutMobileC>
            )}
            {!nextExtraIsDesktop &&
              !Component.isBLayout &&
              !Component.isCLayout && (
                <LayoutMobile loading={loading}>
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
