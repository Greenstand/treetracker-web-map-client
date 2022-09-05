describe('home', { defaultCommandTimeout: 5000 }, () => {
  it('home page', () => {
    cy.visit('/');
    cy.contains('Come explore the global reforestation effort');
    cy.screenshot();
  });
});
