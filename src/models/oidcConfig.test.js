import getOidcConfig from './oidcConfig';

describe('getOidcConfig', () => {
  afterEach(() => {
    // eslint-disable-next-line no-underscore-dangle
    delete window.__RUNTIME_ENV__;
  });

  it('reflects window.__RUNTIME_ENV__', () => {
    // eslint-disable-next-line no-underscore-dangle
    window.__RUNTIME_ENV__ = {
      NEXT_PUBLIC_KEYCLOAK_URL: 'https://kc.invalid/realms/x/',
      NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: 'public-client',
      NEXT_PUBLIC_KEYCLOAK_REALM: 'x',
      NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI: 'https://app.invalid/',
    };
    expect(getOidcConfig()).toMatchObject({
      authority: 'https://kc.invalid/realms/x/',
      client_id: 'public-client',
      realm: 'x',
      redirect_uri: 'https://app.invalid/',
    });
    expect(typeof getOidcConfig().onSigninCallback).toBe('function');
  });
});
