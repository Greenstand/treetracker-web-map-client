import wallet from '../../../../doc/examples/wallets/180Earth.json';
import { prepareNocks, clearNocks } from '../nockRoutes';

beforeEach(() => {
  clearNocks();
});

describe('Planter page', () => {
  it('getServerSideProps return mocks', () => {
    const path = `/wallets/${wallet.id}`;
    prepareNocks({ wallet });
    cy.visit(path, {
      failOnStatusCode: false,
    });
    cy.contains(wallet.id);
    cy.get('.MuiTypography-h2')
      .eq(0)
      .contains(/Maynard.Stroman79/i);
    cy.screenshot();
  });
});
