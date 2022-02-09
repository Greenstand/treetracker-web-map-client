import { getNockRoutes } from './nockRoutes';
import leaders from '../../../doc/examples/countries/leader.json';
import tree186734 from '../../fixtures/tree186734.json';

describe('top', () => {
  beforeEach(() => {
    Cypress.env('nock') && cy.task('clearNock');
  });

  it('top page', () => {
    Cypress.env('nock') &&
      cy.task('nocks', {
        hostname: Cypress.env('NEXT_PUBLIC_API'),
        routes: getNockRoutes({ tree: tree186734 }),
      });

    cy.intercept('GET', '**/countries/**', {
      statusCode: 200,
      body: leaders,
    });

    cy.visit('/top');
    cy.contains('Featured Trees');
    cy.contains('Check out the global leaders in the tree planting effort');
    cy.contains(`${tree186734.id}`);
    cy.contains('Tanzania');
  });
});
