import { Box, Button, Typography, Link, Avatar } from '@mui/material';

function SignOutButton({ auth, classes, isMobile }) {
  if (isMobile) {
    return (
      <Link
        sx={{
          textDecoration: 'none',
          color: ({ palette }) => palette.text.primary,
        }}
        onClick={auth?.removeUser}
      >
        Sign Out
      </Link>
    );
  }

  return (
    <Box>
      <Button>
        <Link
          className={classes.buttonStyle}
          sx={{
            textDecoration: 'none',
            '& :hover': {
              color: ({ palette }) => palette.text.primary,
            },
          }}
          onClick={auth?.removeUser}
        >
          <Typography className={classes.buttonStyle}>Sign Out</Typography>
        </Link>
      </Button>
    </Box>
  );
}

export default SignOutButton;
