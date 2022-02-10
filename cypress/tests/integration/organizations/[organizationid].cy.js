import org from '../../../../doc/examples/organizations/1.json';
import { prepareNocks, clearNocks } from '../nockRoutes';

beforeEach(() => {
  clearNocks();
});

describe('Organizations', () => {
  const imageFixturePath = `images/organization.png`;
  return it(`organization test`, () => {
    const path = `/organizations/${org.id}`;
    cy.fixture(imageFixturePath).then((image) => {
      const blob = Cypress.Blob.base64StringToBlob(image, 'images/png');
      const photo_url = Cypress.Blob.createObjectURL(blob);
      prepareNocks({ organization: { ...org, photo_url } });
    });

    cy.visit(path, {
      failOnStatusCode: false,
    });

    cy.url().should('include', '/organizations');
    cy.contains(org.name);
  });
});
