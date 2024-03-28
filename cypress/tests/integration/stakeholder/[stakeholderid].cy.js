import stakeholder from '../../../../doc/examples/organizations/1.json';
import { prepareNocks, clearNocks } from '../nockRoutes';

beforeEach(() => {
  clearNocks();
});

describe('Organizations', () => {
  const imageFixturePath = `images/organization.png`;
  return it(`organization test`, () => {
    const path = `/stakeholder/${stakeholder.id}`;
    cy.fixture(imageFixturePath).then((image) => {
      const blob = Cypress.Blob.base64StringToBlob(image, 'images/png');
      const photo_url = Cypress.Blob.createObjectURL(blob);
      prepareNocks({ stakeholder: { ...stakeholder, photo_url } });
    });

    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: '/query/v2/stakeholder/1',
      statusCode: 200,
      body: stakeholder,
    });

    cy.visit(path, {
      failOnStatusCode: false,
    });

    cy.url().should('include', '/stakeholder');
    cy.contains(stakeholder.name);
    cy.screenshot();
  });
});
