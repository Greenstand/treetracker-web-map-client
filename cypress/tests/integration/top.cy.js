import { prepareNocks, clearNocks } from './nockRoutes';
import leaders from '../../../doc/examples/countries/leader.json';
import tree186734 from '../../fixtures/tree186734.json';

describe('top', () => {
  beforeEach(() => {
    clearNocks();
  });

  it('top page', () => {
    prepareNocks({ tree: tree186734 });
    cy.intercept('GET', '**/countries/**', {
      statusCode: 200,
      body: leaders,
    });

    cy.visit(`${Cypress.env('NEXT_PUBLIC_BASE')}/top`);
    cy.contains('Featured trees this week');
    cy.contains('Check out the global leaders in the tree planting effort');
    cy.contains('Tanzania');
    cy.screenshot();
  });
});
