import { urlJoin } from 'url-join-ts';

const host = process.env.NEXT_PUBLIC_API || '';
const apiPaths = {
  featuredTrees: urlJoin(host, '/trees/featured'),
  leaders: urlJoin(host, '/countries/leaderboard'),
  trees: (id = '') => urlJoin(host, `/trees/${id}`),
  planters: (id = '') => urlJoin(host, `/planters/${id}`),
  species: urlJoin(host, '/species'),
  organization: (id = '') => urlJoin(host, `/organizations/${id}`),
  wallets: (id = '') => urlJoin(host, `/wallets/${id}`),
  filterSpeciesByWalletId: (id = '') =>
    urlJoin(host, `/species?wallet_id=${id}`),
};

export default apiPaths;
