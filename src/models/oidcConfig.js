import log from 'loglevel';
import { getEnv } from 'models/runtimeEnv';

const onSigninCallback = (res) => {
  console.log('onSigninCallback', res);
  localStorage.setItem('res', JSON.stringify(res));
};

let logged = false;

// A function rather than a module-level object so the Keycloak settings are
// read at runtime (see models/runtimeEnv).
export default function getOidcConfig() {
  const oidcConfig = {
    authority: getEnv('NEXT_PUBLIC_KEYCLOAK_URL'),
    client_id: getEnv('NEXT_PUBLIC_KEYCLOAK_CLIENT_ID'),
    redirect_uri: getEnv('NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI'),
    realm: getEnv('NEXT_PUBLIC_KEYCLOAK_REALM'),
    onSigninCallback,
  };
  if (!logged) {
    log.warn('oidcConfig', oidcConfig);
    logged = true;
  }
  return oidcConfig;
}
