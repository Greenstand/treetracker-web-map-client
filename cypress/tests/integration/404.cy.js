describe('404 page', { defaultCommandTimeout: 5000 }, () => {
  it('renders heading in Montserrat and text in Lato', () => {
    cy.visit('/not-a-page', { failOnStatusCode: false });
    cy.contains('404')
      .should('have.css', 'font-family')
      .and('include', 'Montserrat');
    cy.contains("Looks like you're lost")
      .should('have.css', 'font-family')
      .and('include', 'Lato');
    cy.contains('Page you are looking for is missing.')
      .should('have.css', 'font-family')
      .and('include', 'Lato');
  });
});
