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
      // Most organizations have no map_name, so the map core has no filter
      // to find an initial view. The page must keep the world view without an
      // error (#1874).
      prepareNocks({ organization: { ...org, photo_url, map_name: null } });
    });

    cy.visit(path, {
      failOnStatusCode: false,
    });

    cy.url().should('include', '/organizations');
    cy.contains(org.name).should('be.visible');
    // Wait until the map shows, so that the screenshot shows the map.
    cy.get('.leaflet-control-attribution').should('be.visible');
    cy.screenshotPage();
  });
});
