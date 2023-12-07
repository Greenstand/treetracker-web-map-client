const oidcConfig = {
  authority: 'https://dev-k8s.treetracker.org/keycloak/realms/treetracker/',
  client_id: 'raw-client',
  redirect_uri: 'http://localhost:3000/',
  realm: 'treetracker',
  onSigninCallback: (res) => {
    console.log('onSigninCallback', res);
    localStorage.setItem('res', JSON.stringify(res));
  },
};

export default oidcConfig;
