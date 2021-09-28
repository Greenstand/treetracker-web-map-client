
describe('top', () => {
    it('top page', () => {
      cy.visit('/');
      cy.contains("top page");
    })
})
