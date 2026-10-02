import {
  getEnv,
  getRuntimeEnvFromProcess,
  RUNTIME_ENV_KEYS,
} from './runtimeEnv';

describe('runtimeEnv', () => {
  afterEach(() => {
    // eslint-disable-next-line no-underscore-dangle
    delete window.__RUNTIME_ENV__;
  });

  it('allowlists exactly the public runtime keys', () => {
    expect([...RUNTIME_ENV_KEYS].sort()).toEqual(
      [
        'NEXT_PUBLIC_API',
        'NEXT_PUBLIC_TILE_SERVER_URL',
        'NEXT_PUBLIC_TILE_SERVER_SUBDOMAINS',
        'NEXT_PUBLIC_TILE_SERVER_WEBMAP_API',
        'NEXT_PUBLIC_IMAGE_API',
        'NEXT_PUBLIC_COUNTRY_LEADER_BOARD_DISABLED',
        'NEXT_PUBLIC_SERVER_CONFIG_DISABLED',
        'NEXT_PUBLIC_KEYCLOAK_URL',
        'NEXT_PUBLIC_KEYCLOAK_CLIENT_ID',
        'NEXT_PUBLIC_KEYCLOAK_REALM',
        'NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI',
      ].sort(),
    );
  });

  it('getEnv returns the runtime value when set', () => {
    // eslint-disable-next-line no-underscore-dangle
    window.__RUNTIME_ENV__ = {
      NEXT_PUBLIC_TILE_SERVER_URL: 'https://runtime.invalid/{s}/',
      NEXT_PUBLIC_API: 'https://runtime.invalid/query',
    };
    expect(getEnv('NEXT_PUBLIC_TILE_SERVER_URL')).toBe(
      'https://runtime.invalid/{s}/',
    );
    expect(getEnv('NEXT_PUBLIC_API')).toBe('https://runtime.invalid/query');
  });

  it('getEnv falls back to the build-time value without the global', () => {
    expect(getEnv('NEXT_PUBLIC_TILE_SERVER_URL')).toBe(
      process.env.NEXT_PUBLIC_TILE_SERVER_URL,
    );
  });

  it('getEnv ignores process.env in the browser', () => {
    const before = getEnv('NEXT_PUBLIC_IMAGE_API');
    const saved = process.env.NEXT_PUBLIC_IMAGE_API;
    process.env.NEXT_PUBLIC_IMAGE_API = 'https://changed.invalid/';
    try {
      expect(getEnv('NEXT_PUBLIC_IMAGE_API')).toBe(before);
    } finally {
      if (saved === undefined) delete process.env.NEXT_PUBLIC_IMAGE_API;
      else process.env.NEXT_PUBLIC_IMAGE_API = saved;
    }
  });

  it('getEnv falls back when the key is missing or empty', () => {
    // eslint-disable-next-line no-underscore-dangle
    window.__RUNTIME_ENV__ = { NEXT_PUBLIC_TILE_SERVER_SUBDOMAINS: '' };
    expect(getEnv('NEXT_PUBLIC_TILE_SERVER_SUBDOMAINS')).toBe(
      process.env.NEXT_PUBLIC_TILE_SERVER_SUBDOMAINS,
    );
    expect(getEnv('NEXT_PUBLIC_TILE_SERVER_WEBMAP_API')).toBe(
      process.env.NEXT_PUBLIC_TILE_SERVER_WEBMAP_API,
    );
  });

  it('getEnv throws for non-allowlisted keys', () => {
    expect(() => getEnv('NEXT_PUBLIC_BASE')).toThrow();
    expect(() => getEnv('NEXT_PUBLIC_GA_ID')).toThrow();
  });

  describe('getRuntimeEnvFromProcess', () => {
    const saved = { ...process.env };

    afterEach(() => {
      process.env = { ...saved };
    });

    it('returns only allowlisted keys', () => {
      RUNTIME_ENV_KEYS.forEach((key) => {
        process.env[key] = `value-of-${key}`;
      });
      process.env.NEXT_PUBLIC_TILE_SERVER_SUBDOMAINS = 'a,b';
      process.env.NEXT_PUBLIC_BASE = '/base';
      process.env.FAKE_SECRET = 'hunter2';
      const env = getRuntimeEnvFromProcess();
      expect(Object.keys(env).sort()).toEqual([...RUNTIME_ENV_KEYS].sort());
      expect(env.NEXT_PUBLIC_TILE_SERVER_SUBDOMAINS).toBe('a,b');
      expect(JSON.stringify(env)).not.toContain('hunter2');
      expect(env).not.toHaveProperty('NEXT_PUBLIC_BASE');
    });

    it('omits undefined keys', () => {
      delete process.env.NEXT_PUBLIC_TILE_SERVER_WEBMAP_API;
      expect(getRuntimeEnvFromProcess()).not.toHaveProperty(
        'NEXT_PUBLIC_TILE_SERVER_WEBMAP_API',
      );
    });
  });
});
