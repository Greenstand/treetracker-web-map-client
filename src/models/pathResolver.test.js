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
  });
});
