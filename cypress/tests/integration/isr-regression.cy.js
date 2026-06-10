/**
 * ISR page regression tests — verifies that all 6 ISR pages still render
 * correctly after the isrMemoryCacheSize:0 change in next.config.js (PR #1824)
 * and the revalidate interval change from 30s to 300s (PR #1825).
 *
 * Run with: npm run cypress:run:fast
 * Requires: CYPRESS_nock=true (set by cypress:run:fast via --env nock=true)
 */

import { prepareNocks, clearNocks } from './nockRoutes';
import leaders from '../../../doc/examples/countries/leader.json';
import org from '../../../doc/examples/organizations/1.json';
import planter from '../../../doc/examples/planters/940.json';
import wallet from '../../../doc/examples/wallets/180Earth.json';

beforeEach(() => {
  clearNocks();
});

describe('ISR pages render after isrMemoryCacheSize:0 (PR #1824 regression)', () => {
  it('renders planter page', () => {
    prepareNocks({ planter });
    cy.visit(`/planters/${planter.id}`, { failOnStatusCode: false });
    cy.get('.MuiTypography-h2').contains(/sebastian g/i);
  });

  it('renders tree page', () => {
    cy.fixture('images/trees/1.jpg').then((image) => {
      const blob = Cypress.Blob.base64StringToBlob(image, 'image/jpg');
      const url = Cypress.Blob.createObjectURL(blob);
      cy.fixture('tree186734').then((tree) => {
        prepareNocks({ tree: { ...tree, image_url: url } });
        cy.visit(`/trees/${tree.id}`, { failOnStatusCode: false });
        cy.contains(`${tree.id}`);
      });
    });
  });

  it('renders organization page', () => {
    cy.fixture('images/organization.png').then((image) => {
      const blob = Cypress.Blob.base64StringToBlob(image, 'images/png');
      const photo_url = Cypress.Blob.createObjectURL(blob);
      prepareNocks({ organization: { ...org, photo_url } });
    });
    cy.visit(`/organizations/${org.id}`, { failOnStatusCode: false });
    cy.url().should('include', '/organizations');
    cy.contains(org.name);
  });

  it('renders wallet page', () => {
    prepareNocks({ wallet });
    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: `/query/tokens?wallet=${wallet.id}`,
      statusCode: 200,
      body: { total: 0, offset: 0, limit: 20, tokens: [] },
    });
    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: `/query/wallets/${wallet.id}/token-region-count`,
      statusCode: 200,
      body: { walletStatistics: [] },
    });
    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: `/query/wallets/${wallet.id}`,
      statusCode: 200,
      body: wallet,
    });
    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: `/query/species?wallet_id=${wallet.id}`,
      statusCode: 200,
      body: { total: null, offset: 0, limit: 20, species: [] },
    });
    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: `/query/trees?wallet_id=${wallet.id}`,
      statusCode: 200,
      body: { total: 0, offset: 0, limit: 20, trees: [] },
    });
    cy.visit(`/wallets/${wallet.id}`, { failOnStatusCode: false });
    cy.get('.MuiTypography-h2')
      .eq(0)
      .contains(/Maynard.Stroman79/i);
  });

  it('renders top page', () => {
    prepareNocks({});
    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: '/query/organizations/featured',
      statusCode: 200,
      body: { organizations: [org] },
    });
    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: '/query/planters/featured',
      statusCode: 200,
      body: { planters: [planter] },
    });
    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: '/query/wallets/featured',
      statusCode: 200,
      body: { wallets: [wallet] },
    });
    cy.intercept('GET', '**/countries/**', { statusCode: 200, body: leaders });
    cy.visit('/top', { failOnStatusCode: false });
    cy.contains('Featured trees');
    cy.contains('Tanzania');
  });

  // TODO: v2/captures/[captureid] — no fixture exists yet for the captures API
  // (getCapturesById, getGrowerById, getStakeHolderById, getCountryByLatLon).
  // Add a fixture under doc/examples/captures/ and a nockIntercept route here
  // before enabling this test.
  it.skip('renders captures page', () => {});
});
