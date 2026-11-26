describe('404 page', () => {
  it('uses the theme typography', () => {
    cy.visit('/not-a-page', { failOnStatusCode: false });

    cy.contains('h1', '404')
      .should('be.visible')
      .and(($heading) => {
        expect(getComputedStyle($heading[0]).fontFamily).to.contain(
          'Montserrat',
        );
      });

    cy.contains('h3', "Looks like you're lost")
      .should('be.visible')
      .and(($heading) => {
        expect(getComputedStyle($heading[0]).fontFamily).to.contain(
          'Montserrat',
        );
      });

    cy.contains('p', 'Page you are looking for is missing.')
      .should('be.visible')
      .and(($paragraph) => {
        expect(getComputedStyle($paragraph[0]).fontFamily).to.contain('Lato');
      });
  });
});
