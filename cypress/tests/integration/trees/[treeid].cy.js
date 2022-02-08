import exampleTreeData from '../../../../doc/examples/trees/186734.json';

it('Image cases', () => {
  const path = `/trees/${exampleTreeData.id}`;
  cy.visit(path);
  cy.contains(`${exampleTreeData.id}`);
});
