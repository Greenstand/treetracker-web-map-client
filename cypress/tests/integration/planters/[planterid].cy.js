import planter from '../../../../doc/examples/planters/940.json';
import { prepareNocks, clearNocks } from '../nockRoutes';

beforeEach(() => {
  clearNocks();
});

describe('Planter page', () => {
  it('getServerSideProps return mocks', () => {
    const path = `${Cypress.env('NEXT_PUBLIC_BASE')}/planters/${planter.id}`;
    prepareNocks({ planter });
    cy.visit(path, {
      failOnStatusCode: false,
    });
    cy.contains(planter.id);
    cy.get('.MuiTypography-h2').contains(/sebastian g/i);
    cy.screenshot();
  });
});
