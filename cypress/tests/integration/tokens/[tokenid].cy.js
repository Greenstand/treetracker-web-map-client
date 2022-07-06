import token from '../../../../doc/examples/tokens/1.json';
import { prepareNocks, clearNocks } from '../nockRoutes';

beforeEach(() => {
  clearNocks();
});

describe('Token page', () => {
  it('getServerSideProps return mocks', () => {
    const path = `/tokens/${token.id}`;
    prepareNocks({ token });
    cy.visit(path, {
      failOnStatusCode: false,
    });
    cy.contains(token.id);
    cy.screenshot();
  });
});
