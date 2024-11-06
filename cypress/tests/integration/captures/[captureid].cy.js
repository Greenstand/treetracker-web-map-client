import capture from '../../../fixtures/capture.json';

beforeEach(() => {
  if (Cypress.env('nock')) {
    cy.task('clearNock');
  }
});

it('getStaticProps returns mock data for capture', () => {
  const path = `/captures/${capture.id}`;

  if (Cypress.env('nock')) {
    cy.task('nock', {
      hostname: Cypress.env('NEXT_PUBLIC_API'),
      method: 'GET',
      path: `/query/v2/captures/${capture.id}`,
      statusCode: 200,
      body: capture,
    });
  }

  cy.visit(path);

  // Assertions
  cy.contains(`Capture #${capture.id}`);
  cy.contains(capture.species_name || 'Unknown Species');
  cy.contains(
    `Captured on ${new Date(capture.created_at).toLocaleDateString()}`,
  );
  cy.contains(capture.token_id ? 'Token issued' : 'Token not issued');
  cy.contains(capture.wallet_name || 'No wallet owns it');
});
