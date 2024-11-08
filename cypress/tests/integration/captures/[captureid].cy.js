import moment from 'moment';
import capture from '../../../fixtures/capture.json';
import country from '../../../fixtures/country.json';
import grower from '../../../fixtures/grower.json';
import { prepareNocks, clearNocks } from '../nockRoutes';

beforeEach(() => {
  clearNocks();
});

describe('Capture page', () => {
  it('getStaticProps returns mocks', () => {
    const path = `/captures/${capture.id}`;

    // Prepare mocks using intercepts
    prepareNocks({ capture, grower, country });

    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: `/query/v2/captures/${capture.id}`,
      statusCode: 200,
      body: capture,
    });

    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: `/query/v2/growers/${capture.grower_account_id}`,
      statusCode: 200,
      body: grower,
    });

    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: `/query/v2/countries?lat=${capture.lat}&lon=${capture.lon}`,
      statusCode: 200,
      body: country,
    });

    const organizationId =
      capture.planting_organization_id || grower.organization_id;
    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: `/stakeholder/stakeholders/${organizationId}`,
      statusCode: 200,
      body: {}, // Mocking an empty response
    });

    cy.visit(path);

    // Assertions
    cy.contains(`Capture #${capture.id}`);
    cy.contains(capture.species_name || 'Unknown Species');
    cy.contains(
      `Captured on ${moment(capture.created_at).format('MMMM Do, YYYY')}`,
    );
    cy.contains(capture.token_id ? 'Token issued' : 'Token not issued');
    cy.screenshot();
  });
});
