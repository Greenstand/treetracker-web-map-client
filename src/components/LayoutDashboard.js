// import dynamic from 'next/dynamic';
// import React from 'react';
import { SSRKeycloakProvider, SSRCookies } from '@react-keycloak/ssr';
import cookie from 'cookie';
import log from 'loglevel';

const keycloakCfg = {
  url: 'https://dev-k8s.treetracker.org/auth',
  realm: 'treetracker',
  clientId: 'webmap',
  // realm: 'quickstart',
  // clientId: 'webmap-client',
};

function Layout({ children, cookies }) {
  return (
    <SSRKeycloakProvider
      keycloakConfig={keycloakCfg}
      persistor={SSRCookies(cookies)}
    >
      {children}
    </SSRKeycloakProvider>
  );
}

function parseCookies(req) {
  if (!req || !req.headers) {
    log.warn('no cookie');
    return {};
  }
  log.warn('cookie:', req.headers.cookie);
  return cookie.parse(req.headers.cookie || '');
}

Layout.getInitialProps = (context) =>
  // Extract cookies from AppContext
  ({
    cookies: parseCookies(context?.ctx?.req),
  });

export default Layout;
