/**
 * ISR cache-header tests — asserts that ISR pages return Cache-Control with
 * s-maxage=300 (PR #1825) and that a second request is served from disk cache
 * rather than regenerated (PR #1824: isrMemoryCacheSize:0 uses disk cache).
 *
 * IMPORTANT: ISR only activates in production mode. Run against a production
 * build, not the dev server:
 *
 *   npm run build
 *   npm run start
 *   cypress run --spec cypress/tests/e2e/isr-cache-headers.cy.js
 *
 * The page IDs below (940, 186734, 1, 180Earth) are real records in the
 * production/staging API. These tests will fail against a dev environment
 * that does not have these records. In that case, replace the IDs with ones
 * that exist in your target environment.
 */

const ISR_PAGES = [
  '/planters/940',
  '/trees/186734',
  '/organizations/1',
  '/wallets/180Earth',
  '/top',
];

describe('ISR Cache-Control headers reflect 300s revalidation (PR #1825)', () => {
  ISR_PAGES.forEach((path) => {
    it(`${path} — Cache-Control includes s-maxage=300 (or NEXT_CACHE_REVALIDATION_OVERRIDE if set)`, () => {
      const expected = Cypress.env('NEXT_CACHE_REVALIDATION_OVERRIDE') || 300;
      cy.request(path).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.headers['cache-control']).to.match(
          new RegExp(`s-maxage=${expected}`),
        );
      });
    });
  });
});

describe('ISR disk cache is active after isrMemoryCacheSize:0 (PR #1824)', () => {
  ISR_PAGES.forEach((path) => {
    it(`${path} — second request served from disk cache (HIT or STALE)`, () => {
      cy.request(path);
      cy.request(path).then((response) => {
        expect(response.status).to.eq(200);
        // HIT  = page was in the cache window, served from disk
        // STALE = beyond the window, served stale while regen runs in background
        // Either confirms disk cache is working; MISS would mean caching is broken
        expect(response.headers['x-nextjs-cache']).to.match(/HIT|STALE/);
      });
    });
  });
});
