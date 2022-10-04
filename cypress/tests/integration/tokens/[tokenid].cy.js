import token from '../../../../doc/examples/tokens/1.json';
import { prepareNocks, clearNocks } from '../nockRoutes';

beforeEach(() => {
  clearNocks();
});

describe('Token page', () => {
  it('getServerSideProps return mocks', () => {
    const path = `/tokens/${token.id}`;
    prepareNocks({ token });
    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: '/query/tokens/6c85c551-ed63-456f-ba0f-8d632897f560',
      statusCode: 200,
      body: {
        id: '6c85c551-ed63-456f-ba0f-8d632897f560',
        capture_id: 'b5304d34-c9a9-4b4c-8b30-701135c44ec5',
        wallet_id: 'eecdf253-05b6-419a-8425-416a3e5fc9a0',
        transfer_pending: false,
        transfer_pending_id: null,
        created_at: '2021-11-14T22:49:28.495Z',
        updated_at: '2021-11-14T22:49:28.495Z',
        claim: false,
        tree_id: 951836,
        tree_image_url:
          'https://treetracker-production-images.s3.eu-central-1.amazonaws.com/2021.03.26.03.04.00_8.442396096679852_-13.234358212401096_90318a55-0f01-436f-8c0a-f29e7059caff_IMG_20210310_131020_6428924620633541327.jpg',
        tree_species_name: 'apple',
      },
    });
    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: '/query/wallets/eecdf253-05b6-419a-8425-416a3e5fc9a0',
      statusCode: 200,
      body: {
        id: 'eecdf253-05b6-419a-8425-416a3e5fc9a0',
        name: 'Malinda51',
        password:
          '5572699d74738b523aa874720701e97134b5e7c7c6da5cafce348580cc6edf2bd43aff14c966cdd1d92f5462b679334634da9d256e0c0875477c4b87f2f2660b',
        salt: 'xL8i1Mlj_l2EEqh',
        logo_url: null,
        created_at: '2021-10-07T22:33:20.732Z',
      },
    });
    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: '/query/transactions?token_id=6c85c551-ed63-456f-ba0f-8d632897f560',
      statusCode: 200,
      body: {
        transactions: [],
      },
    });
    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: '/query/trees/951836',
      statusCode: 200,
      body: {
        id: 951836,
        planter_id: 940,
      },
    });

    cy.visit(path, {
      failOnStatusCode: false,
    });
    cy.contains(token.id);
    cy.screenshot();
  });
});
