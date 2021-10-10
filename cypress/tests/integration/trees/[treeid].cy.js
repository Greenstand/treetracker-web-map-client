const tree = {
  id: 'testTree',
  photo_url:
    'https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2021.05.11.18.37.00_-4.91963284_38.52757506_adc35f9c-b76e-4798-b587-70f5fba06b89_IMG_20210511_101502_-1595081185.jpg',
  verified: true,
  token_id: 'c488301f-1117-48c3-8866-3c38f28d3f25',
  created_at: '5/17/2021, 9:31:17 PM',
  lat: -4.882294219999999,
  lon: 38.380733454,
  species: 'eucalyptus',
  planter_id: 5,
  organization_id: 1,
};

beforeEach(() => {
  cy.task('clearNock');
});

it('getServerSideProps returns mock', () => {
  const path = `/trees/${tree.id}`;
  cy.task('nock', {
    hostname: 'http://127.0.0.1:4010/mock',
    method: 'GET',
    path,
    statusCode: 200,
    body: {
      ...tree,
      status: 200,
    },
  });

  cy.visit(path);
  // nock has worked!
  cy.contains(`#${tree.id}`);
});
