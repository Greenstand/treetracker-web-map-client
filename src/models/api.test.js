import log from 'loglevel';
import { getOrgLinks } from './api';
import { requestAPI } from './utils';

jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  requestAPI: jest.fn(),
}));

describe('getOrgLinks', () => {
  const links = {
    featured_trees: '/trees?organization_id=1',
    associated_planters: '/planters?organization_id=1',
    species: '/species?organization_id=1',
  };

  beforeEach(() => {
    requestAPI.mockReset();
    jest.spyOn(log, 'error').mockImplementation(() => {});
    jest.spyOn(log, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('resolves every resource with no partial errors', async () => {
    requestAPI.mockImplementation((url) => Promise.resolve({ url }));
    const result = await getOrgLinks(links);
    expect(result).toEqual({
      featuredTrees: { url: links.featured_trees },
      species: { url: links.species },
      associatedPlanters: { url: links.associated_planters },
      partialErrors: [],
    });
  });

  it('returns null and a partial error for a failed resource', async () => {
    requestAPI.mockImplementation((url) => {
      if (url === links.species) {
        const err = new Error('Request failed with status code 500');
        err.response = { status: 500 };
        err.config = { url };
        return Promise.reject(err);
      }
      return Promise.resolve({ url });
    });
    const result = await getOrgLinks(links);
    expect(result.species).toBeNull();
    expect(result.featuredTrees).toEqual({ url: links.featured_trees });
    expect(result.associatedPlanters).toEqual({
      url: links.associated_planters,
    });
    expect(result.partialErrors).toEqual([
      {
        resource: 'species',
        message: 'Request failed with status code 500',
        status: 500,
        url: links.species,
        code: null,
      },
    ]);
  });

  it('does not request a missing url', async () => {
    requestAPI.mockImplementation((url) => Promise.resolve({ url }));
    const result = await getOrgLinks({
      featured_trees: links.featured_trees,
      species: links.species,
    });
    expect(requestAPI).toHaveBeenCalledTimes(2);
    expect(result.partialErrors).toEqual([]);
    expect(result).not.toHaveProperty('associatedPlanters');
  });
});
