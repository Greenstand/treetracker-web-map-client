import * as pathResolver from './pathResolver';

describe('Test pathResolver', () => {
  describe('getPathWhenClickTree', () => {
    it('get path when click tree icon on page: /tokens/6c85c551-ed63-456f-ba0f-8d632897f560', () => {
      const result = pathResolver.getPathWhenClickTree(
        {},
        '/tokens/6c85c551-ed63-456f-ba0f-8d632897f560',
        {},
      );
      expect(result).toMatchObject({
        pathname: '/tokens/6c85c551-ed63-456f-ba0f-8d632897f560',
      });
    });

    it('click on /organizations/178/trees/735592', () => {
      const result = pathResolver.getPathWhenClickTree(
        {
          id: 706648,
        },
        '/organizations/178/trees/735592',
        {},
      );
      expect(result).toMatchObject({
        pathname: '/organizations/178/trees/706648',
      });
    });

    it('click on /trees/1017648', () => {
      const result = pathResolver.getPathWhenClickTree(
        {
          id: 1017681,
        },
        '/trees/1017648',
        {},
      );
      expect(result).toMatchObject({
        pathname: '/trees/1017681',
      });
    });

    it('click on /wallets/0cdf4219-869a-41ce-953a-a8421d8353f7', () => {
      const result = pathResolver.getPathWhenClickTree(
        {
          id: 14615,
          token_id: '3a53e2a6-ac17-43a5-a3aa-31fd04786cba',
        },
        '/wallets/0cdf4219-869a-41ce-953a-a8421d8353f7',
        {},
      );

      expect(result).toMatchObject({
        pathname: '/wallets/0cdf4219-869a-41ce-953a-a8421d8353f7/tokens',
        query: {
          tree_id: 14615,
        },
      });
    });
  });

  describe('updatePathWhenMapMoveEnd', () => {
    it('update path when ', () => {
      const result = pathResolver.updatePathWhenMapMoveEnd(
        {
          pathname: '/wallets/0cdf4219-869a-41ce-953a-a8421d8353f7',
        },
        {
          getCurrentBounds: () =>
            '37.44990348815919,-3.315482794386477,37.46535301208497,-3.307471024919109',
        },
        {
          query: {},
        },
      );
      expect(result).toBe(
        '/wallets/0cdf4219-869a-41ce-953a-a8421d8353f7?bounds=37.44990348815919,-3.315482794386477,37.46535301208497,-3.307471024919109',
      );
    });

    it('update path when /wallets/1f2a0862-66d1-4b42-8216-5a5cb9c6eca5/tokens?tree_id=14615', () => {
      const result = pathResolver.updatePathWhenMapMoveEnd(
        {
          pathname: '/wallets/0cdf4219-869a-41ce-953a-a8421d8353f7',
        },
        {
          getCurrentBounds: () =>
            '37.44990348815919,-3.315482794386477,37.46535301208497,-3.307471024919109',
        },
        {
          query: {
            tree_id: 14615,
          },
        },
      );
      expect(result).toBe(
        '/wallets/0cdf4219-869a-41ce-953a-a8421d8353f7?bounds=37.44990348815919,-3.315482794386477,37.46535301208497,-3.307471024919109&tree_id=14615',
      );
    });
  });

  describe('getContext', () => {
    it('org context', () => {
      const result = pathResolver.getContext('/organizations/178/trees/735592');
      expect(result).toMatchObject({
        name: 'organizations',
        id: '178',
      });
    });

    it('org context with query', () => {
      const result = pathResolver.getContext(
        '/organizations/178/trees/735592?bounds=38.97374153137208,-5.511957953599709,38.98919105529786,-5.504397012212283',
      );
      expect(result).toMatchObject({
        name: 'organizations',
        id: '178',
      });
    });

    it('wallet context', () => {
      const result = pathResolver.getContext(
        '/wallets/1f2a0862-66d1-4b42-8216-5a5cb9c6eca5/tokens?tree_id=95614',
      );
      expect(result).toMatchObject({
        name: 'wallets',
        id: '1f2a0862-66d1-4b42-8216-5a5cb9c6eca5',
      });
    });

    it('wallet context case2', () => {
      const result = pathResolver.getContext(
        '/wallets/1f2a0862-66d1-4b42-8216-5a5cb9c6eca5/tokens/3a53e2a6-ac17-43a5-a3aa-31fd04786cba',
      );
      expect(result).toMatchObject({
        name: 'wallets',
        id: '1f2a0862-66d1-4b42-8216-5a5cb9c6eca5',
      });
    });
  });
});
