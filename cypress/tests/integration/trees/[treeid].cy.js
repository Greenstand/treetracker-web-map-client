import exampleTreeData from '../../../fixtures/tree186734.json';
import { prepareNocks, clearNocks } from '../nockRoutes';

const imageFixturesDir = 'images/trees/';
const imageFixtureNames = ['1'];

const testImage = (fileName, imageType = 'image/jpg') => {
  const imageFixturePath = `${imageFixturesDir}${fileName}`;
  return it(`Image case - ${fileName}`, () => {
    const treePath = `/trees/${exampleTreeData.id}`;
    cy.fixture(imageFixturePath).then((image) => {
      const blob = Cypress.Blob.base64StringToBlob(image, imageType);
      const url = Cypress.Blob.createObjectURL(blob);
      prepareNocks({
        tree: { ...exampleTreeData, image_url: url },
      });
    });
    cy.visit(treePath);
    cy.contains(`${exampleTreeData.id}`);
  });
};

beforeEach(() => {
  clearNocks();
});

describe('Image cases', () => {
  imageFixtureNames.forEach(testImage);
});
