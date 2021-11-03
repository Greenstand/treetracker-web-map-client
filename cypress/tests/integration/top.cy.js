import tree186734 from '../../fixtures/tree186734.json';

describe('top', () => {
  beforeEach(() => {
    cy.task('clearNock');
  });

  it('top page', () => {
    cy.task('nock', {
      hostname: 'http://127.0.0.1:4010/mock',
      method: 'GET',
      path: '/trees/featured',
      statusCode: 200,
      body: {
        trees: [{ ...tree186734 }],
      },
    });
    cy.visit('/top');
    cy.contains('Featured Trees');
    cy.contains('Check out the global leaders in the tree planting effort');
    cy.contains(`${tree186734.id  }`);
  });
});
