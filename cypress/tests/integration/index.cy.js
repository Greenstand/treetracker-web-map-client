describe('home', () => {
  it('home page', () => {
    cy.visit('/');
    cy.contains('Come explore the global reforestation effort');
    cy.screenshot();
  });
});
