/*

resources:
- web-map-global-setting
- web-map-featured-trees-management
- organization-map-customization

*/
import { Box, Button, Typography, Divider } from '@mui/material';
import { useKeycloak } from '@react-keycloak/ssr';
import log from 'loglevel';
import Link from '../../components/Link';

export default function Index() {
  const { keycloak } = useKeycloak();
  log.warn('keycloak', keycloak);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          padding: 1,
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h5">Greenstand</Typography>
        </Box>
        <Box>
          {keycloak?.tokenParsed?.realm_access?.roles.includes(
            'web-map-manager',
          ) && (
            <Link href="/admin/global">
              <Button color="primary">Global</Button>
            </Link>
          )}
          {keycloak?.tokenParsed?.realm_access?.roles.includes(
            'web-map-manager',
          ) && <Button color="primary">Organization</Button>}
        </Box>
        <Box>
          {keycloak?.tokenParsed && (
            <Box>
              Hi, {keycloak.tokenParsed.given_name}
              {keycloak.tokenParsed.family_name}!
              <Button
                onClick={() => {
                  if (keycloak) {
                    window.location.href = keycloak.createLogoutUrl();
                  }
                }}
              >
                Logout
              </Button>
            </Box>
          )}
          {!keycloak?.tokenParsed && (
            <Box>
              <Button
                onClick={() => {
                  if (keycloak) {
                    window.location.href = keycloak.createLoginUrl();
                  }
                }}
              >
                Login
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      <Divider />
    </>
  );
}
