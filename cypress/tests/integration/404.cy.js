describe('error pages', () => {
  it('uses the theme fonts on the 404 page', () => {
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
        expect(getComputedStyle($heading[0]).fontFamily).to.contain('Lato');
      });

    cy.contains('p', 'Page you are looking for is missing.')
      .should('be.visible')
      .and(($paragraph) => {
        expect(getComputedStyle($paragraph[0]).fontFamily).to.contain('Lato');
      });
  });

  it('uses the theme fonts on the 500 page', () => {
    cy.visit('/500');

    cy.contains('h1', '500')
      .should('be.visible')
      .and(($heading) => {
        expect(getComputedStyle($heading[0]).fontFamily).to.contain(
          'Montserrat',
        );
      });

    cy.contains('h3', 'Something went wrong')
      .should('be.visible')
      .and(($heading) => {
        expect(getComputedStyle($heading[0]).fontFamily).to.contain('Lato');
      });
  });
});
