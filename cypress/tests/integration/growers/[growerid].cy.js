import grower from '../../../../doc/examples/growers/100.json';
import tree from '../../../fixtures/tree186734.json';
import { prepareNocks, clearNocks } from '../nockRoutes';

const getStubbedImageUrl = (image) => {
  const blob = Cypress.Blob.base64StringToBlob(image, 'image/png');
  return Cypress.Blob.createObjectURL(blob);
};

beforeEach(() => {
  clearNocks();

  const stubs = {};
  cy.fixture('images/grower.png').then((image) => {
    stubs.grower = { ...grower, image_url: getStubbedImageUrl(image) };
  });
  cy.fixture('images/trees/10.jpg').then((image) => {
    stubs.tree = { ...tree, image_url: getStubbedImageUrl(image) };
  });
  cy.wrap(null).then(() => {
    prepareNocks(stubs);
  });

  cy.visit(`/growers/${grower.id}`, {
    failOnStatusCode: false,
  });
});

describe('Grower Page', () => {
  it('renders with grower data', () => {
    cy.url().should('include', `/growers/${grower.id}`);
    cy.get('h6').eq(2).should('contain', 'Stanley K.');
    cy.get('h2').first().should('have.text', 'Stanley K.');
    cy.get('h2').eq(1).should('have.text', '1');
    cy.get('h2').eq(2).should('have.text', '1');
    cy.get('time').should('have.text', ' April 17, 2024');
    cy.get('h6').eq(5).should('have.text', 'Capture - da4d...fb10');
    cy.get('p').eq(13).should('have.text', grower.about);

    // check that grower and tree images are present, but stubbed
    cy.get('img')
      .eq(1)
      .invoke('attr', 'src')
      .should('include', 'blob:http://localhost:3000/');
    cy.get('img')
      .eq(2)
      .invoke('attr', 'src')
      .should('include', 'blob:http://localhost:3000/');
    cy.get('img')
      .eq(3)
      .invoke('attr', 'src')
      .should('include', 'localhost:3000/');

    cy.screenshot();
  });
});
