import leader from '../../fixtures/countries/leader.json';
import tree186734 from '../../fixtures/tree186734.json';

describe('top', () => {
  beforeEach(() => {
    Cypress.env('nock') && cy.task('clearNock');
  });

  it('top page', () => {
    Cypress.env('nock') &&
      cy.task('nocks', {
        hostname: 'http://127.0.0.1:4010/mock',
        routes: [
          {
            method: 'GET',
            path: '/trees/featured',
            statusCode: 200,
            body: {
              trees: [{ ...tree186734 }],
            },
          },
          {
            method: 'GET',
            path: '/trees/186734',
            statusCode: 200,
            body: { ...tree186734 },
          },
          {
            method: 'GET',
            path: '/countries/leader',
            statusCode: 200,
            body: leader,
          },
        ],
      });

    cy.visit('/top');
    cy.contains('Featured Trees');
    cy.contains('Check out the global leaders in the tree planting effort');
    cy.contains(`${tree186734.id}`);
    cy.contains('Tanzania');
  });
});
