import wallet from '../../../../doc/examples/wallets/180Earth.json';
import { prepareNocks, clearNocks } from '../nockRoutes';

beforeEach(() => {
  clearNocks();
});

describe('Planter page', () => {
  it('getServerSideProps return mocks', () => {
    const path = `/wallets/${wallet.id}`;
    prepareNocks({ wallet });

    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: '/query/v2/tokens?wallet=ba95a148-7ff8-42bb-8028-99b747b86ae1',
      statusCode: 200,
      body: {
        total: 10,
        offset: 0,
        limit: 20,
        tokens: [
          {
            id: '516e3583-f058-4f00-98e2-15c1d6353361',
            capture_id: '676352ca-b6b4-4548-916e-d5bdc2563889',
            wallet_id: 'ba95a148-7ff8-42bb-8028-99b747b86ae1',
            transfer_pending: false,
            transfer_pending_id: null,
            created_at: '2021-06-29T05:00:02.762Z',
            updated_at: '2021-06-29T05:00:02.762Z',
            claim: false,
          },
          {
            id: 'a2392450-0788-4af4-80b0-fcc9825bc804',
            capture_id: 'f4e6a4bf-db7b-4469-bc33-b0641a4a22d8',
            wallet_id: 'ba95a148-7ff8-42bb-8028-99b747b86ae1',
            transfer_pending: false,
            transfer_pending_id: null,
            created_at: '2021-06-29T05:00:02.762Z',
            updated_at: '2021-06-29T05:00:02.762Z',
            claim: false,
          },
          {
            id: 'c4434b1a-c569-46e0-aaf9-c4482405f832',
            capture_id: 'c8d5da55-0046-4397-afbc-bd7f377933af',
            wallet_id: 'ba95a148-7ff8-42bb-8028-99b747b86ae1',
            transfer_pending: false,
            transfer_pending_id: null,
            created_at: '2021-06-29T05:00:02.762Z',
            updated_at: '2021-06-29T05:00:02.762Z',
            claim: false,
          },
          {
            id: '060c1127-b67c-435c-a031-0e04c5189f53',
            capture_id: '0f0733e0-8438-4bcf-bf1e-abda99e7fa6f',
            wallet_id: 'ba95a148-7ff8-42bb-8028-99b747b86ae1',
            transfer_pending: false,
            transfer_pending_id: null,
            created_at: '2021-06-29T05:00:02.762Z',
            updated_at: '2021-06-29T05:00:02.762Z',
            claim: false,
          },
          {
            id: 'eb112988-3e51-4829-8448-53c8f9d07b96',
            capture_id: '89846ef9-6fcd-4b09-9c82-28c033949df4',
            wallet_id: 'ba95a148-7ff8-42bb-8028-99b747b86ae1',
            transfer_pending: false,
            transfer_pending_id: null,
            created_at: '2021-06-29T05:00:02.762Z',
            updated_at: '2021-06-29T05:00:02.762Z',
            claim: false,
          },
          {
            id: '4655b62d-dbb6-455a-9c24-b83e25aca3bd',
            capture_id: '89a86943-cf3f-42f2-8f53-567266af657b',
            wallet_id: 'ba95a148-7ff8-42bb-8028-99b747b86ae1',
            transfer_pending: false,
            transfer_pending_id: null,
            created_at: '2021-06-29T05:00:02.762Z',
            updated_at: '2021-06-29T05:00:02.762Z',
            claim: false,
          },
          {
            id: '9066d6aa-50ab-4732-ba83-30166734da54',
            capture_id: '483d9ab3-8b06-4d4c-a1ff-9096d59e9f26',
            wallet_id: 'ba95a148-7ff8-42bb-8028-99b747b86ae1',
            transfer_pending: false,
            transfer_pending_id: null,
            created_at: '2021-06-29T05:00:02.762Z',
            updated_at: '2021-06-29T05:00:02.762Z',
            claim: false,
          },
          {
            id: '0aee4e20-9670-46b9-a311-17db5f3d147a',
            capture_id: 'e0e366c2-c238-4364-8389-28e42332bb4c',
            wallet_id: 'ba95a148-7ff8-42bb-8028-99b747b86ae1',
            transfer_pending: false,
            transfer_pending_id: null,
            created_at: '2021-06-29T05:00:02.762Z',
            updated_at: '2021-06-29T05:00:02.762Z',
            claim: false,
          },
          {
            id: '59b858bb-227f-4f48-b052-ed851f0f4bf4',
            capture_id: '5bb827e4-db33-41af-a280-dd98a95ed9a5',
            wallet_id: 'ba95a148-7ff8-42bb-8028-99b747b86ae1',
            transfer_pending: false,
            transfer_pending_id: null,
            created_at: '2021-06-29T05:00:02.762Z',
            updated_at: '2021-06-29T05:00:02.762Z',
            claim: false,
          },
          {
            id: '63e854e9-d18e-49a4-90ce-9c528a72ef2f',
            capture_id: '16ba99a4-66c3-4cef-b94b-6d99600e5fae',
            wallet_id: 'ba95a148-7ff8-42bb-8028-99b747b86ae1',
            transfer_pending: false,
            transfer_pending_id: null,
            created_at: '2021-06-29T05:00:02.762Z',
            updated_at: '2021-06-29T05:00:02.762Z',
            claim: false,
          },
        ],
      },
    });
    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: '/query/v2/wallets/ba95a148-7ff8-42bb-8028-99b747b86ae1/token-region-count',
      statusCode: 200,
      body: { walletStatistics: [{ continent: 'Africa', token_count: '10' }] },
    });
    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: '/query/v2/wallets/ba95a148-7ff8-42bb-8028-99b747b86ae1',
      statusCode: 200,
      body: wallet,
    });
    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: '/query/v2/species?wallet_id=ba95a148-7ff8-42bb-8028-99b747b86ae1',
      statusCode: 200,
      body: { total: null, offset: 0, limit: 20, species: [] },
    });
    cy.task('nockIntercept', {
      hostname: 'https://dev-k8s.treetracker.org',
      method: 'get',
      path: '/query/v2/trees?wallet_id=ba95a148-7ff8-42bb-8028-99b747b86ae1',
      statusCode: 200,
      body: { total: 10, offset: 0, limit: 20, trees: [] },
    });
    cy.visit(path);
    cy.get('.MuiTypography-h2')
      .eq(0)
      .contains(/Maynard.Stroman79/i);
    cy.screenshot();
  });
});
