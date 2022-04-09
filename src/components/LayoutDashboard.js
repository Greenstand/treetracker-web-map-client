// import dynamic from 'next/dynamic';
// import React from 'react';
import { SSRKeycloakProvider, SSRCookies } from '@react-keycloak/ssr';
import cookie from 'cookie';

const keycloakCfg = {
  url: 'http://localhost:8080/',
  realm: 'myrealm',
  clientId: 'myclient',
};

function Layout({ children, cookies }) {
  return (
    <SSRKeycloakProvider
      keycloakConfig={keycloakCfg}
      persistor={SSRCookies(cookies)}
    >
      <h1>admin frame</h1>
      {children}
    </SSRKeycloakProvider>
  );
}

function parseCookies(req) {
  if (!req || !req.headers) {
    return {};
  }
  return cookie.parse(req.headers.cookie || '');
}

Layout.getInitialProps = (context) => 
  // Extract cookies from AppContext
   ({
    cookies: parseCookies(context?.ctx?.req),
  })
;

export default Layout;
