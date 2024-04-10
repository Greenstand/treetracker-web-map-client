import species from '../../../../doc/examples/species/1.json';
import stakeholder from '../../../../doc/examples/stakeholders/180Earth.json';
import planter from '../../../fixtures/940.json';
import exampleTreeData from '../../../fixtures/tree186734.json';
import { prepareNocks, clearNocks } from '../nockRoutes';

beforeEach(() => {
  clearNocks();
});

describe('Stakeholder', () => {
  const imageFixturePath = `images/organization.png`;
  return it(`stakeholder test`, () => {
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

    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: '/query/v2/trees?stakeholder_id=1',
      statusCode: 200,
      body: { total: 1, offset: 0, limit: 4, trees: [exampleTreeData] },
    });

    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: '/query/v2/planters?stakeholder_id=1',
      statusCode: 200,
      body: { total: 1, offset: 0, limit: 4, planters: [planter] },
    });

    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: '/query/v2/species?stakeholder_id=1',
      statusCode: 200,
      body: { total: 1, offset: 0, limit: 4, species: [species] },
    });

    cy.visit(path, {
      failOnStatusCode: false,
    });

    cy.url().should('include', '/stakeholder');
    cy.screenshot();
  });
});
