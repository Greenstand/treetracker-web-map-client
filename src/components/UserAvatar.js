import { Box, Link, Avatar } from '@mui/material';

function UserAvatar({ auth }) {
  return (
    <Box>
      <Avatar
        sx={{
          width: 20,
          height: 20,
          background: ({ palette }) => palette.background.greenGradient,
        }}
      >
        <Link
          href="https://dev-k8s.treetracker.org/keycloak/realms/treetracker/account/#/personal-info"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: ({ palette }) => palette.text.primary,
          }}
        >
          {auth.user?.profile.preferred_username[0] || null}
        </Link>
      </Avatar>
    </Box>
  );
}

export default UserAvatar;
