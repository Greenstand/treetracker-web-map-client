describe('Organizations', () => {
    it('', () => {
      // Start from the index page
      cy.visit('http://localhost:3000/organizations/3')
  
      // The new url should include "/about"
      cy.url().should('include', '/organizations')

      cy.get('h6').contains('Greenway International Foundation')
      cy.get('h6').contains('About the Organization')
      cy.get('h6').contains('Mission')
    })
  })