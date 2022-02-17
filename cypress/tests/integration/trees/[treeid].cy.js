import exampleTreeData from '../../../fixtures/tree186734.json';
import { prepareNocks, clearNocks } from '../nockRoutes';

beforeEach(() => {
  clearNocks();
});

it(`treeid page`, () => {
  const treePath = `/trees/${exampleTreeData.id}`;
  cy.fixture('images/trees/1.jpg').then((image) => {
    const blob = Cypress.Blob.base64StringToBlob(image, 'image/jpg');
    const url = Cypress.Blob.createObjectURL(blob);
    prepareNocks({
      tree: { ...exampleTreeData, image_url: url },
    });
  });
  cy.visit(treePath);
  cy.contains(`${exampleTreeData.id}`);
});
