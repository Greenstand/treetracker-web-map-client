// eslint-disable-next-line import/extensions
import '../style.css';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';

import Layout from '../components/Layout';
import { MapContextProvider } from '../mapContext';
import appTheme from '../theme';

let muiCache;

export const createMuiCache = () =>
  (muiCache = createCache({
    key: 'mui',
    prepend: true,
  }));

function TreetrackerApp({ Component, pageProps }) {
  return (
    <CacheProvider value={muiCache ?? createMuiCache()}>
      <ThemeProvider theme={appTheme}>
        <MapContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MapContextProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default TreetrackerApp;
