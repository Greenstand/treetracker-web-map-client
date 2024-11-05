import { urlJoin } from 'url-join-ts';

const host = process.env.NEXT_PUBLIC_API || '';
const hostV2 = process.env.NEXT_PUBLIC_API_V2 || '';
const hostStakeholder = process.env.NEXT_PUBLIC_STAKEHOLDER_API || '';
const apiPaths = {
  featuredTrees: urlJoin(host, 'trees/featured'),
  featuredGrowers: urlJoin(hostV2, 'growers/featured'),
  getCaptures: urlJoin(hostV2, 'captures'),
  countriesLatLon: (lat = '', lon = '') =>
    urlJoin(host, `/countries?lat=${lat}&lon=${lon}`),
  leaders: urlJoin(host, '/countries/leaderboard'),
  trees: (id = '') => urlJoin(host, `/trees/${id}`),
  getCapturesByTreeId: (treeid = '') =>
    urlJoin(hostV2, `/captures?tree_id=${treeid}`),
  captures: (id = '') => urlJoin(hostV2, `captures/${id}`),
  growers: (id = '') => urlJoin(hostV2, `growers/${id}`),
  stakeHolders: (id = '') => urlJoin(hostStakeholder, `/stakeholders/${id}`),
  species: urlJoin(host, '/species'),
  organization: (id = '') => urlJoin(host, `/organizations/${id}`),
  wallets: (id = '') => urlJoin(host, `/wallets/${id}`),
  filterSpeciesByWalletId: (id = '') =>
    urlJoin(host, `/species?wallet_id=${id}`),
  tokens: (id = '') => urlJoin(host, `/tokens/${id}`),
  featuredOrganizations: urlJoin(host, '/organizations/featured'),
  featuredWallets: urlJoin(host, '/wallets/featured'),
};

export default apiPaths;
