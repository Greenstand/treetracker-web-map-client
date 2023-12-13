import { Box, Link, Avatar, Typography } from '@mui/material';

function UserAvatar({ auth }) {
  if (!auth?.isAuthenticated) {
    return null;
  }
  return (
    <Box>
      <Link
        href="https://dev-k8s.treetracker.org/keycloak/realms/treetracker/account/#/personal-info"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          color: ({ palette }) => palette.text.primary,
        }}
      >
        <Avatar
          sx={{
            width: 24,
            height: 24,
            background: ({ palette }) => palette.background.greenGradient,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              textTransform: 'uppercase',
              fontSize: 16,
              textDecoration: 'none',
              color: ({ palette }) => palette.text.contrast,
            }}
          >
            {auth?.user?.profile.preferred_username[0] || null}
          </Typography>
        </Avatar>
      </Link>
    </Box>
  );
}

export default UserAvatar;
