/** @jest-environment node */
import handler from './runtime-env';

function mockRes() {
  const res = { headers: {}, statusCode: undefined, body: undefined };
  res.setHeader = (name, value) => {
    res.headers[name.toLowerCase()] = value;
  };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.send = (body) => {
    res.body = body;
    return res;
  };
  res.end = () => res;
  return res;
}

function run(req) {
  const res = mockRes();
  handler({ method: 'GET', query: {}, headers: {}, ...req }, res);
  return res;
}

function evaluate(body) {
  const fakeWindow = {};
  // eslint-disable-next-line no-new-func
  new Function('window', body)(fakeWindow);
  // eslint-disable-next-line no-underscore-dangle
  return fakeWindow.__RUNTIME_ENV__;
}

describe('/api/runtime-env', () => {
  const saved = { ...process.env };
  const values = {
    NEXT_PUBLIC_API: 'https://example.invalid/query',
    NEXT_PUBLIC_TILE_SERVER_URL: 'https://example.invalid/{s}/',
    NEXT_PUBLIC_TILE_SERVER_SUBDOMAINS: 'a,b',
    NEXT_PUBLIC_TILE_SERVER_WEBMAP_API: 'https://example.invalid/webmap/',
    NEXT_PUBLIC_IMAGE_API: 'https://example.invalid/images',
    NEXT_PUBLIC_COUNTRY_LEADER_BOARD_DISABLED: 'true',
    NEXT_PUBLIC_SERVER_CONFIG_DISABLED: 'true',
    NEXT_PUBLIC_KEYCLOAK_URL: 'https://example.invalid/realms/x/',
    NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: 'public-client',
    NEXT_PUBLIC_KEYCLOAK_REALM: 'x',
    NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI: 'https://example.invalid/',
  };

  beforeEach(() => {
    Object.assign(process.env, values);
    process.env.NEXT_PUBLIC_BASE = '/base';
    process.env.NEXT_PUBLIC_GA_ID = 'G-NOTALLOWED';
    process.env.FAKE_SECRET = 'hunter2';
  });

  afterEach(() => {
    process.env = { ...saved };
  });

  it('responds with a no-store javascript body', () => {
    const res = run();
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toBe(
      'application/javascript; charset=utf-8',
    );
    expect(res.headers['cache-control']).toBe('no-store');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('defines window.__RUNTIME_ENV__ with exactly the allowlisted keys', () => {
    const env = evaluate(run().body);
    expect(env).toEqual(values);
  });

  it('escapes values that could break out of the script', () => {
    const evil = '</script><script>alert(1)</script>\u2028\u2029';
    process.env.NEXT_PUBLIC_TILE_SERVER_URL = evil;
    const { body } = run();
    expect(body).not.toContain('</script>');
    expect(body).not.toContain('\u2028');
    expect(body).not.toContain('\u2029');
    expect(evaluate(body).NEXT_PUBLIC_TILE_SERVER_URL).toBe(evil);
  });

  it('ignores request input', () => {
    const plain = run().body;
    const withQuery = run({
      query: { key: 'PATH' },
      headers: { 'x-key': 'FAKE_SECRET' },
      body: { key: 'FAKE_SECRET' },
    }).body;
    expect(withQuery).toBe(plain);
    expect(withQuery).not.toContain('hunter2');
  });

  it('returns 405 for POST', () => {
    const res = run({ method: 'POST' });
    expect(res.statusCode).toBe(405);
    expect(res.headers.allow).toBe('GET, HEAD');
  });
});
