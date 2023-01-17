import '../style.css';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { LinearProgress, Box, useTheme, useMediaQuery } from '@mui/material';
import log from 'loglevel';
import App from 'next/app';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { userAgentFromString } from 'next/server';
import React from 'react';
import packageJson from '../../package.json';
import Layout from '../components/Layout';
import LayoutDashboard from '../components/LayoutDashboard';
import LayoutEmbed from '../components/LayoutEmbed';
import LayoutMobile from '../components/LayoutMobile';
import LayoutMobileB from '../components/LayoutMobileB';
import LayoutMobileC from '../components/LayoutMobileC';
import { DrawerProvider } from '../context/DrawerContext';
import { defaultConfig } from '../context/configContext';
import { CustomThemeProvider } from '../context/themeContext';
import { useLocalStorage, useEmbed } from '../hooks/globalHooks';
import { MapContextProvider } from '../mapContext';
import { wrapper } from '../models/utils';

log.warn(`Web Map Client version ${packageJson.version}`);

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

export function reportWebVitals({ name, delta, value, id, label }) {
  const deployed = process.env.NODE_ENV === 'production';
  if (label === 'web-vital' && deployed) {
    window.gtag('event', name, {
      value: delta,
      metric_id: id,
      metric_value: value,
      metric_delta: delta,
    });
  }
}

function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      gtag('js', new Date());
  
      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
    `}
      </Script>
    </>
  );
}

function TreetrackerApp({ Component, pageProps, device, config }) {
  log.warn('!!!! render the _app');
  log.warn('webmap config', config);
  const router = useRouter();
  const theme = useTheme();
  const layoutRef = React.useRef();

  const embedLocalStorage = useLocalStorage('embed', false);
  const clientSideQuery = useMediaQuery(theme.breakpoints.up('sm'));
  const onServer = typeof window === 'undefined';

  const nextExtraIsDesktop = onServer ? device === 'desktop' : clientSideQuery;
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
      if (layoutRef.current) {
        layoutRef.current.scrollTop = 0;
      }
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
    config,
  };

  const isAdmin = !!router.asPath.match(/admin/);
  if (isAdmin) {
    return (
      <>
        <GoogleAnalytics />
        <LayoutDashboard>
          <Component {...pageProps} />
        </LayoutDashboard>
      </>
    );
  }

  return (
    <>
      <GoogleAnalytics />
      <CacheProvider value={muiCache ?? createMuiCache()}>
        <CustomThemeProvider>
          <DrawerProvider>
            <MapContextProvider>
              {nextExtraIsDesktop && !nextExtraIsEmbed && (
                <Layout {...extraProps} ref={layoutRef}>
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
                  <LayoutMobile ref={layoutRef}>
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

// Detect device from user agent header
TreetrackerApp.getInitialProps = async (context) => {
  const props = await App.getInitialProps(context);
  const userAgent = context?.ctx.req
    ? context.ctx.req.headers['user-agent']
    : window.navigator.userAgent;

  const device = userAgentFromString(userAgent)?.device.type || 'desktop';

  const mapConfigRequest = await fetch(
    // TODO: use the ENV var, currently results in a bug with the theme editor
    // `${process.env.NEXT_PUBLIC_CONFIG_API}/config`,
    `https://dev-k8s.treetracker.org/map_config/config`,
  );
  const mapConfig = await mapConfigRequest.json();
  const config =
    mapConfig.find((item) => item.name === 'testing-config')?.data ||
    defaultConfig;

  return {
    props,
    config,
    device,
  };
};

export default TreetrackerApp;
