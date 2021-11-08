// eslint-disable-next-line import/no-extraneous-dependencies
import { mount } from '@cypress/react';
import { ThemeProvider } from '@mui/material';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import * as React from 'react';

import appTheme from '../theme';

export const mockRouter = {
  pathname: '/testPath',
  route: '/testPath',
  query: {},
  asPath: '/testPath',
  components: {},
  isFallback: false,
  basePath: '',
  events: { emit: () => {}, off: () => {}, on: () => {} },
  push: () => {},
  replace: () => {},
  reload: () => {},
  back: () => {},
  prefetch: () => ({ catch: () => {} }),
  beforePopState: () => {},
};

export function mountWithTheme(element) {
  return mount(<ThemeProvider theme={appTheme}>{element}</ThemeProvider>);
}

export function mountWithThemeAndRouter(children, config = mockRouter) {
  return mountWithTheme(
    <RouterContext.Provider value={config}>{children}</RouterContext.Provider>,
  );
}
