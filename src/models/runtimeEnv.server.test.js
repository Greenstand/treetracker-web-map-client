/** @jest-environment node */
import { getEnv } from './runtimeEnv';

describe('runtimeEnv on the server', () => {
  const saved = { ...process.env };

  afterEach(() => {
    process.env = { ...saved };
  });

  it('has no window', () => {
    expect(typeof window).toBe('undefined');
  });

  it('getEnv reads process.env at call time', () => {
    process.env.NEXT_PUBLIC_API = 'https://one.invalid/query';
    expect(getEnv('NEXT_PUBLIC_API')).toBe('https://one.invalid/query');
    process.env.NEXT_PUBLIC_API = 'https://two.invalid/query';
    expect(getEnv('NEXT_PUBLIC_API')).toBe('https://two.invalid/query');
  });

  it('getEnv falls back to the build-time value when unset or empty', () => {
    const buildTime = getEnv('NEXT_PUBLIC_IMAGE_API');
    process.env.NEXT_PUBLIC_IMAGE_API = '';
    expect(getEnv('NEXT_PUBLIC_IMAGE_API')).toBe(buildTime);
  });

  it('getEnv still throws for non-allowlisted keys', () => {
    process.env.FAKE_SECRET = 'hunter2';
    expect(() => getEnv('FAKE_SECRET')).toThrow();
    expect(() => getEnv('NEXT_PUBLIC_BASE')).toThrow();
  });
});
