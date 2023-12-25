import log from 'loglevel';

const oidcConfig = {
  authority: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
  client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
  redirect_uri: process.env.NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI,
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
  onSigninCallback: (res) => {
    console.log('onSigninCallback', res);
    localStorage.setItem('res', JSON.stringify(res));
  },
};

log.warn('oidcConfig', oidcConfig);

export default oidcConfig;
