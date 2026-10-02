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

  it('getEnv returns the runtime value when set', () => {
    // eslint-disable-next-line no-underscore-dangle
    window.__RUNTIME_ENV__ = {
      NEXT_PUBLIC_TILE_SERVER_URL: 'https://runtime.invalid/{s}/',
    };
    expect(getEnv('NEXT_PUBLIC_TILE_SERVER_URL')).toBe(
      'https://runtime.invalid/{s}/',
    );
  });

  it('getEnv falls back to the build-time value without the global', () => {
    expect(getEnv('NEXT_PUBLIC_TILE_SERVER_URL')).toBe(
      process.env.NEXT_PUBLIC_TILE_SERVER_URL,
    );
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

  it('getEnv throws for a non-allowlisted key', () => {
    expect(() => getEnv('NEXT_PUBLIC_API')).toThrow();
  });

  describe('getRuntimeEnvFromProcess', () => {
    const saved = { ...process.env };

    afterEach(() => {
      process.env = { ...saved };
    });

    it('returns only allowlisted keys', () => {
      process.env.NEXT_PUBLIC_TILE_SERVER_URL = 'https://a.invalid/';
      process.env.NEXT_PUBLIC_TILE_SERVER_SUBDOMAINS = 'a,b';
      process.env.NEXT_PUBLIC_TILE_SERVER_WEBMAP_API = 'https://w.invalid/';
      process.env.NEXT_PUBLIC_API = 'https://api.invalid/';
      process.env.FAKE_SECRET = 'hunter2';
      const env = getRuntimeEnvFromProcess();
      expect(Object.keys(env).sort()).toEqual([...RUNTIME_ENV_KEYS].sort());
      expect(env.NEXT_PUBLIC_TILE_SERVER_SUBDOMAINS).toBe('a,b');
      expect(JSON.stringify(env)).not.toContain('hunter2');
    });

    it('omits undefined keys', () => {
      delete process.env.NEXT_PUBLIC_TILE_SERVER_WEBMAP_API;
      expect(getRuntimeEnvFromProcess()).not.toHaveProperty(
        'NEXT_PUBLIC_TILE_SERVER_WEBMAP_API',
      );
    });
  });
});
