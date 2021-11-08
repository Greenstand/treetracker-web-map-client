import '../style.css';

import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';

import Layout from '../components/Layout';
import { MapContextProvider } from '../mapContext';
import appTheme from '../theme';

function TreetrackerApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}) {
  return (
    <CacheProvider value={emotionCache}>
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
