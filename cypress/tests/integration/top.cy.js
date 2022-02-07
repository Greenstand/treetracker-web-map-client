import tree186734 from '../../fixtures/tree186734.json';

describe('top', () => {
  it('top page', () => {
    cy.visit('/top');
    cy.contains('Featured Trees');
    cy.contains('Check out the global leaders in the tree planting effort');
    cy.contains(`${tree186734.id}`);
    cy.contains('Tanzania');
  });
});
