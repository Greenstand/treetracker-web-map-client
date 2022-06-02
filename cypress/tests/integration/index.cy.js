describe('home', () => {
  it('home page', () => {
    cy.visit(Cypress.env('urlPath'));
    cy.contains('Come explore the global reforestation effort');
    cy.screenshot();
  });
});
