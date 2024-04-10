import grower from '../../../../doc/examples/growers/100.json';
import { prepareNocks, clearNocks } from '../nockRoutes';

beforeEach(() => {
  clearNocks();
});

describe('Grower Page', () => {
  it('renders with grower data', () => {
    const path = `/growers/${grower.id}`;
    prepareNocks({ grower });

    cy.visit(path, {
      failOnStatusCode: false,
    });

    cy.url().should('include', '/growers');
    cy.contains(grower.first_name);
    cy.screenshot();
  });
});
