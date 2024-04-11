import grower from '../../../../doc/examples/growers/100.json';
import { prepareNocks, clearNocks } from '../nockRoutes';

beforeEach(() => {
  clearNocks();
});

describe('Grower Page', () => {
  it('renders with grower data', () => {
    const path = `/growers/${grower.id}`;
    const imageFixturePath = `images/grower.png`;
    cy.fixture(imageFixturePath).then((image) => {
      const blob = Cypress.Blob.base64StringToBlob(image, 'image/png');
      const image_url = Cypress.Blob.createObjectURL(blob);
      prepareNocks({ grower: { ...grower, image_url } });
    });

    cy.visit(path, {
      failOnStatusCode: false,
    });

    cy.url().should('include', '/growers');
    cy.contains(grower.first_name);
    cy.screenshot();
  });
});
