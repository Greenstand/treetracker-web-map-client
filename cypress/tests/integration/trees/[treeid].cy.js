import exampleTreeData from '../../../fixtures/tree186734.json';
import { prepareNocks, clearNocks } from '../nockRoutes';

beforeEach(() => {
  clearNocks();
});

describe('Tree page', () => {
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
    cy.contains(`${exampleTreeData.id}`).should('be.visible');
    // The page zooms the map to the tree, then marks the tree. Wait for the
    // mark, so that the screenshot shows the tree and not the world view.
    cy.get('.greenstand-point-selected', { timeout: 30000 }).should('exist');
    cy.screenshotPage();
  });
});
