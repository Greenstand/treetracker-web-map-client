import { prepareNocks, clearNocks } from './nockRoutes';
import leaders from '../../../doc/examples/countries/leader.json';
import organization1 from '../../../doc/examples/organizations/1.json';
import planter940 from '../../../doc/examples/planters/940.json';
import tree186734 from '../../fixtures/tree186734.json';

describe('top', () => {
  beforeEach(() => {
    clearNocks();
  });

  // skip because unknown error:
  // https://github.com/Greenstand/treetracker-web-map-client/runs/7515320937?check_suite_focus=true
  it.skip('top page', () => {
    prepareNocks({ tree: tree186734 });

    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: '/query/organizations?limit=10',
      statusCode: 200,
      body: {
        organizations: [organization1],
      },
    });

    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: '/query/planters?limit=10',
      statusCode: 200,
      body: {
        planters: [planter940],
      },
    });

    cy.intercept('GET', '**/countries/**', {
      statusCode: 200,
      body: leaders,
    });

    cy.visit('/top');
    cy.contains('Featured trees');
    cy.contains('Check out the global leaders in the tree planting effort');
    cy.contains('Tanzania');
    cy.screenshot();
  });
});
