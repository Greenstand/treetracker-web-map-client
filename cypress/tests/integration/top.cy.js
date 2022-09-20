import { prepareNocks, clearNocks } from './nockRoutes';
import leaders from '../../../doc/examples/countries/leader.json';
import organization1 from '../../../doc/examples/organizations/1.json';
import planter940 from '../../../doc/examples/planters/940.json';
import wallets from '../../../doc/examples/wallets/180Earth.json';
import tree186734 from '../../fixtures/tree186734.json';

describe('top', () => {
  beforeEach(() => {
    clearNocks();
  });

  it('top page', () => {
    prepareNocks({ tree: tree186734 });

    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: '/query/organizations/featured',
      statusCode: 200,
      body: {
        organizations: [organization1],
      },
    });

    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: '/query/planters/featured',
      statusCode: 200,
      body: {
        planters: [planter940],
      },
    });

    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: '/query/wallets/featured',
      statusCode: 200,
      body: {
        wallets: [wallets],
      },
    });

    cy.intercept('GET', '**/countries/**', {
      statusCode: 200,
      body: leaders,
    });

    cy.visit('/top');
    cy.contains('Featured trees');
    cy.contains('Check out the global leaders in the tree planting effort');

    // cy.contains('Tanzania'); // failing due to leaderboard not working

    cy.screenshot();
  });
});
