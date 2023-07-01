import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import { CustomThemeProvider } from 'context/themeContext';

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
  return cy.mount(<CustomThemeProvider>{element}</CustomThemeProvider>);
}

export function mountWithThemeAndRouter(children, config = mockRouter) {
  return mountWithTheme(
    <MemoryRouterProvider value={config}>{children}</MemoryRouterProvider>,
  );
}
