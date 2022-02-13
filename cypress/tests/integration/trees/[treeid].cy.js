it('Image cases', () => {
  const path = '/trees/1';
  cy.visit(path);
  cy.contains(`Tree Verified`);
});
