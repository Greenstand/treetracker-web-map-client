import log from 'loglevel';
import {
  hideLastName,
  formatDateString,
  parseDomain,
  parseMapName,
  requestAPI,
  nextPathBaseDecode,
  nextPathBaseEncode,
  getLocationString,
  wrapper,
} from './utils';

describe('hideLastName', () => {
  it('Dadior Chen should return Dadior C', () => {
    expect(hideLastName('Dadior Chen')).toBe('Dadior C');
  });
});

describe('parseMapName', () => {
  it('freetown.treetracker.org should return freetown', () => {
    expect(parseMapName('freetown.treetracker.org')).toBe('freetown');
  });
  it('treetracker.org should return undefined', () => {
    expect(parseMapName('treetracker.org')).toBeUndefined();
  });

  it('treetracker.org should return undefined', () => {
    expect(parseMapName('treetracker.org')).toBeUndefined();
  });

  it('test.treetracker.org should return undefined', () => {
    expect(parseMapName('test.treetracker.org')).toBeUndefined();
  });

  it('dev.treetracker.org should return undefined', () => {
    expect(parseMapName('dev.treetracker.org')).toBeUndefined();
  });

  it('localhost should return undefined', () => {
    expect(parseMapName('localhost')).toBeUndefined();
  });

  it('http://dev.treetracker.org should throw error', () => {
    expect(() => {
      parseMapName('http://dev.treetracker.org');
    }).toThrow();
  });

  it('127.17.0.225 should return undefined', () => {
    expect(parseMapName('127.17.0.225')).toBeUndefined();
  });

  it('wallet.treetracker.org should return undefined', () => {
    expect(parseMapName('wallet.treetracker.org')).toBeUndefined();
  });

  it('ready.treetracker.org should return undefined', () => {
    expect(parseMapName('ready.treetracker.org')).toBeUndefined();
  });
});

describe('parseDomain', () => {
  it('https://freetown.treetracker.org', () => {
    expect(parseDomain('https://freetown.treetracker.org')).toBe(
      'freetown.treetracker.org',
    );
  });

  it('http://freetown.treetracker.org', () => {
    expect(parseDomain('http://freetown.treetracker.org')).toBe(
      'freetown.treetracker.org',
    );
  });

  it('https://treetracker.org/', () => {
    expect(parseDomain('https://treetracker.org/')).toBe('treetracker.org');
  });

  it('https://treetracker.org', () => {
    expect(parseDomain('https://treetracker.org')).toBe('treetracker.org');
  });

  it('http://localhost:3000', () => {
    expect(parseDomain('https://localhost:3000')).toBe('localhost');
  });

  it('http://localhost', () => {
    expect(parseDomain('https://localhost')).toBe('localhost');
  });

  it('https://treetracker.org/?wallet=xxxx', () => {
    expect(parseDomain('https://treetracker.org/?wallet=xxxx')).toBe(
      'treetracker.org',
    );
  });
});

describe('requestAPI', () => {
  it('should the request failed (code 404) with a wrong URL end point.', async () => {
    try {
      await requestAPI('wrong_end_point');
    } catch (ex) {
      expect(ex.message).toBeTruthy();
    }
  });
});

it('format date string', () => {
  const unformattedDate = '2020-10-19T06:46:40.000Z';
  const formattedDate = formatDateString(unformattedDate);
  expect(['18/10/2020', '19/10/2020']).toContain(formattedDate);
});

describe('nextPathBaseEnocode/Decode', () => {
  it('/web-map-beta/demo/trees/123 with base: /web-map-beta/demo should decode as /trees/123', () => {
    expect(
      nextPathBaseDecode('/web-map-beta/demo/trees/123', '/web-map-beta/demo'),
    ).toBe('/trees/123');
  });

  it("/trees/123 with base: '' should decode as /trees/123", () => {
    expect(nextPathBaseDecode('/trees/123', '')).toBe('/trees/123');
  });

  it("/trees/123 with base: '' should encode as /trees/123", () => {
    expect(nextPathBaseEncode('/trees/123', '')).toBe('/trees/123');
  });

  it('/trees/123 with base: /web-map-beta/demo should encode as /web-map-beta-demo/trees/123', () => {
    expect(nextPathBaseEncode('/trees/123', '/web-map-beta-demo')).toBe(
      '/web-map-beta-demo/trees/123',
    );
  });
});

describe('getLocationString', () => {
  describe('given the country and continent exists', () => {
    it('should return both country and continent', () => {
      const result = getLocationString('Country', 'Continent');
      expect(result).toBe('Country, Continent');
    });
  });

  describe('given the continent exists and country does not exists', () => {
    it('should return only the continent', () => {
      const result = getLocationString(null, 'Continent');
      expect(result).toBe('Continent');
    });
  });

  describe('given the country and continent do not exists', () => {
    it('should return Unknown', () => {
      const result = getLocationString(null, null);
      expect(result).toBe('Unknown');
    });
  });
});

describe('wrapper', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    process.env = { ...OLD_ENV, NEXT_CACHE_REVALIDATION_OVERRIDE: '43200' };
    jest.spyOn(log, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    process.env = OLD_ENV;
    jest.restoreAllMocks();
  });

  function axiosError(status) {
    const err = new Error(`Request failed with status code ${status}`);
    err.response = { status };
    err.config = { url: 'https://example.org/organizations/11' };
    err.code = 'ERR_BAD_RESPONSE';
    return err;
  }

  function hasUndefined(obj) {
    return Object.values(obj).some(
      (v) =>
        v === undefined ||
        (v && typeof v === 'object' && !Array.isArray(v) && hasUndefined(v)),
    );
  }

  it('passes through the callback result', async () => {
    const result = { props: { a: 1 }, revalidate: 300 };
    const getStaticProps = wrapper(() => Promise.resolve(result));
    await expect(getStaticProps({ params: {} })).resolves.toBe(result);
  });

  it('returns notFound on a 404', async () => {
    const getStaticProps = wrapper(() => {
      throw axiosError(404);
    });
    await expect(
      getStaticProps({ params: { organizationid: '11' } }),
    ).resolves.toEqual({ notFound: true });
  });

  it('returns loadError props with a short revalidate on other errors', async () => {
    const getStaticProps = wrapper(() => {
      throw axiosError(500);
    });
    const result = await getStaticProps({ params: { organizationid: '11' } });
    expect(result).toEqual({
      props: {
        loadError: {
          message: 'Request failed with status code 500',
          status: 500,
          url: 'https://example.org/organizations/11',
          code: 'ERR_BAD_RESPONSE',
          params: { organizationid: '11' },
        },
      },
      revalidate: 30,
    });
  });

  it('has no undefined values in loadError for non-axios errors', async () => {
    const getStaticProps = wrapper(() => {
      throw new Error('boom');
    });
    const result = await getStaticProps({});
    expect(result.revalidate).toBe(30);
    expect(result.props.loadError.message).toBe('boom');
    expect(hasUndefined(result.props.loadError)).toBe(false);
  });

  it('omits revalidate when isr is false', async () => {
    const getServerSideProps = wrapper(
      () => {
        throw new Error('boom');
      },
      { isr: false },
    );
    const result = await getServerSideProps({});
    expect(result).not.toHaveProperty('revalidate');
    expect(result.props.loadError.message).toBe('boom');
  });
});
