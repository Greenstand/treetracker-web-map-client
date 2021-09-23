describe('home', () => {
    it('should navigate to home page', () => {
      cy.visit('/')
      cy.url().should('include', '/')
    })
})