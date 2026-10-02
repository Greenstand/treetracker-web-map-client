import apiPaths from './apiPaths';

describe('apiPaths', () => {
  afterEach(() => {
    // eslint-disable-next-line no-underscore-dangle
    delete window.__RUNTIME_ENV__;
  });

  it('uses the runtime NEXT_PUBLIC_API set after import', () => {
    // eslint-disable-next-line no-underscore-dangle
    window.__RUNTIME_ENV__ = { NEXT_PUBLIC_API: 'https://one.invalid/query' };
    expect(apiPaths.featuredTrees).toBe(
      'https://one.invalid/query/trees/featured',
    );
    expect(apiPaths.trees(5)).toBe('https://one.invalid/query/trees/5');

    // eslint-disable-next-line no-underscore-dangle
    window.__RUNTIME_ENV__ = { NEXT_PUBLIC_API: 'https://two.invalid/query' };
    expect(apiPaths.leaders).toBe(
      'https://two.invalid/query/countries/leaderboard',
    );
    expect(apiPaths.species).toBe('https://two.invalid/query/species');
  });
});
