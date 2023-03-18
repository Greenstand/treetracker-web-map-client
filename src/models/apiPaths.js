import { urlJoin } from 'url-join-ts';

const host = process.env.NEXT_PUBLIC_API || '';
const hostV2 = process.env.NEXT_PUBLIC_API_V2 || '';
const apiPaths = {
  featuredTrees: urlJoin(host, 'v2/trees/featured'),
  featuredGrowers: urlJoin(host, 'v2/growers/featured'),
  getCaptures: urlJoin(host, 'v2/captures'),
  countriesLatLon: (lat = '', lon = '') =>
    urlJoin(host, `/countries?lat=${lat}&lon=${lon}`),
  leaders: urlJoin(host, '/countries/leaderboard'),
  trees: (id = '') => urlJoin(host, `/trees/${id}`),
  captures: (id = '') => urlJoin(host, `/v2/captures/${id}`),
  growers: (id = '') => urlJoin(host, `/grower-accounts/${id}`),
  planters: (id = '') => urlJoin(host, `/planters/${id}`),
  stakeHolders: (id = '') => urlJoin(hostV2, `/stakeholder/stakeholders/${id}`),
  species: urlJoin(host, '/species'),
  organization: (id = '') => urlJoin(host, `/organizations/${id}`),
  wallets: (id = '') => urlJoin(host, `/wallets/${id}`),
  filterSpeciesByWalletId: (id = '') =>
    urlJoin(host, `/species?wallet_id=${id}`),
  tokens: (id = '') => urlJoin(host, `/tokens/${id}`),
};

export default apiPaths;
