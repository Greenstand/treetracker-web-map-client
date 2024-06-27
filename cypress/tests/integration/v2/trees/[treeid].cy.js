import grower from '../../../../../doc/examples/growers/100.json';
import treecaptures from '../../../../../doc/examples/trees/186734captures.json';
import tree from '../../../../fixtures/tree186734.json';
import { prepareNocks, clearNocks } from '../../nockRoutes';

const getStubbedImageUrl = (image) => {
  const blob = Cypress.Blob.base64StringToBlob(image, 'image/png');
  return Cypress.Blob.createObjectURL(blob);
};

beforeEach(() => {
  clearNocks();

  const stubs = {};
  cy.fixture('images/trees/10.jpg').then((image) => {
    stubs.tree = { ...tree, image_url: getStubbedImageUrl(image) };
  });
  cy.fixture('images/grower.png').then((image) => {
    stubs.grower = { ...grower, image_url: getStubbedImageUrl(image) };
  });
  cy.fixture('images/trees/1.jpg').then((image) => {
    stubs.tree1 = getStubbedImageUrl(image);
  });
  cy.fixture('images/trees/2.jpg').then((image) => {
    stubs.tree2 = getStubbedImageUrl(image);
  });
  cy.fixture('images/trees/3.jpg').then((image) => {
    stubs.tree3 = getStubbedImageUrl(image);
  });
  // Load mock JSON data
  const updatedCaptures = treecaptures.captures.map((capture, index) => ({
    ...capture,
    image_url: stubs[`tree${index + 1}`],
  }));
  stubs.treeCaptures = updatedCaptures;

  cy.wrap(null).then(() => {
    prepareNocks(stubs);
  });

  cy.visit(`/v2/trees/${tree.id}`, {
    failOnStatusCode: false,
  });
});

describe('V2 Tree Page', () => {
  it('renders with tree data', () => {
    cy.url().should('include', `/v2/trees/${tree.id}`);

    // check if the tree caputrues data correct

    // Wait for the tree captures data to be available
    cy.get('#tree-captures-data', { timeout: 10000 }).should('exist');

    // Check if the tree captures data is correct

    if (treecaptures.captures.length > 0) {
      cy.get('#tree-captures-data').should(
        'contain.text',
        `Captures of growth: ${treecaptures.captures.length}`,
      );
    } else {
      cy.get('#tree-captures-data').should('contain.text', 'No captures yet');
    }

    cy.get('#tree-title > .MuiTypography-root').should(
      'include.text',
      `${tree.id}`,
    );

    if (tree.species) {
      cy.get('#tree-species-data').should('include.text', `${tree.species}`);
    } else {
      cy.get('#tree-species-data').should('include.text', 'Unknown Species');
    }

    cy.screenshot();
  });

  it('timeline component render with correct date', () => {
    // Check the first capture's date
    cy.get(
      ':nth-child(1) > .MuiTypography-body1 > .MuiTypography-root > time',
    ).should(
      'have.text',
      new Date(treecaptures.captures[0].time_created).toLocaleDateString(),
    );

    // Check the second capture's date
    cy.get(
      ':nth-child(2) > .MuiTypography-body1 > .MuiTypography-root > time',
    ).should(
      'have.text',
      new Date(treecaptures.captures[1].time_created).toLocaleDateString(),
    );

    // Check the third capture's date
    cy.get(
      ':nth-child(3) > .MuiTypography-body1 > .MuiTypography-root > time',
    ).should(
      'have.text',
      new Date(treecaptures.captures[2].time_created).toLocaleDateString(),
    );
  });
});
