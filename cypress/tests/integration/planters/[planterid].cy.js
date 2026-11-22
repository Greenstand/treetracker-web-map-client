import planter from '../../../../doc/examples/planters/940.json';
import { prepareNocks, clearNocks } from '../nockRoutes';

beforeEach(() => {
  clearNocks();
});

describe('Planter page', () => {
  it('getServerSideProps return mocks', () => {
    const path = `/planters/${planter.id}`;
    prepareNocks({ planter });
    // The webmap API has no tree for this planter, so the map has no initial
    // view. The page must keep the world view without an error (#1874).
    cy.intercept('GET', /\/webmap\/trees\?/, {
      headers: { 'access-control-allow-origin': '*' },
      body: { data: [] },
    }).as('webmapTrees');
    cy.visit(path, {
      failOnStatusCode: false,
    });
    cy.wait('@webmapTrees');
    cy.get('.MuiTypography-h2')
      .contains(/sebastian g/i)
      .should('be.visible');
    cy.screenshotPage();
  });

  it('keeps the page when the webmap API fails', () => {
    const path = `/planters/${planter.id}`;
    prepareNocks({ planter });
    cy.intercept('GET', /\/webmap\/trees\?/, {
      statusCode: 503,
      headers: { 'access-control-allow-origin': '*' },
      body: 'no healthy upstream',
    }).as('webmapTrees');
    cy.visit(path, {
      failOnStatusCode: false,
    });
    cy.wait('@webmapTrees');
    cy.get('.MuiTypography-h2')
      .contains(/sebastian g/i)
      .should('be.visible');
  });
});
