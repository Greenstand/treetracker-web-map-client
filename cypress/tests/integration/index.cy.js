describe('home', () => {
  it('home page', () => {
    cy.visit(Cypress.env('NEXT_PUBLIC_BASE'));
    cy.contains('Come explore the global reforestation effort');
    cy.screenshot();
  });
});
