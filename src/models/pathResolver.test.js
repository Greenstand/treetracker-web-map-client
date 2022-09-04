import * as pathResolver from './pathResolver';

describe('Test pathResolver', () => {
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
});
