import { urlJoin } from 'url-join-ts';

const host = process.env.NEXT_PUBLIC_API || '';
const hostV2 = process.env.NEXT_PUBLIC_API_V2 || '';
const apiPaths = {
  featuredTrees: urlJoin(host, 'trees/featured'),
  featuredGrowers: urlJoin(host, 'growers/featured'),
  getCaptures: urlJoin(host, 'captures'),
  countriesLatLon: (lat = '', lon = '') =>
    urlJoin(host, `/countries?lat=${lat}&lon=${lon}`),
  leaders: urlJoin(host, '/countries/leaderboard'),
  trees: (id = '') => urlJoin(host, `/trees/${id}`),
  // getCapturesByTreeId: (treeid = '') => urlJoin(host, `/captures?tree_id=${treeid}`),
  // comment in when captures in v2 database have valid tree_id's.
  captures: (id = '') => urlJoin(host, `captures/${id}`),
  growers: (id = '') => urlJoin(host, `growers/${id}`),
  planters: (id = '') => urlJoin(host, `planters/${id}`),
  stakeHolders: (id = '') => urlJoin(hostV2, `/stakeholder/stakeholders/${id}`),
  species: urlJoin(host, '/species'),
  organization: (id = '') => urlJoin(host, `/organizations/${id}`),
  wallets: (id = '') => urlJoin(host, `/wallets/${id}`),
  filterSpeciesByWalletId: (id = '') =>
    urlJoin(host, `/species?wallet_id=${id}`),
  tokens: (id = '') => urlJoin(host, `/tokens/${id}`),
};

export default apiPaths;
