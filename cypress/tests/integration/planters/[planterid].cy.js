import planter from '../../../../doc/examples/planters/940.json';
import { getNockRoutes } from '../nockRoutes';

beforeEach(() => {
  Cypress.env('nock') && cy.task('clearNock'); // This will clear any mocks that have been set
});

describe('Planter page', () => {
  it('getServerSideProps return mocks', () => {
    const path = `/planters/${planter.id}`;

    Cypress.env('nock') &&
      cy.task('nocks', {
        hostname: Cypress.env('NEXT_PUBLIC_API'),
        routes: getNockRoutes({ planter }),
      });

    cy.visit(path, {
      failOnStatusCode: false,
    });
    cy.contains(planter.id);
    cy.get('.MuiTypography-h2').contains(/sebastian g/i);
  });
});
