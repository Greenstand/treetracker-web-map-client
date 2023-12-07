import { Button, Typography, Link } from '@mui/material';

function SignInButton({ auth, classes, isMobile }) {
  if (isMobile) {
    return (
      <Link
        sx={{
          textDecoration: 'none',
          color: ({ palette }) => palette.text.primary,
        }}
        onClick={auth.signinRedirect}
      >
        Sign in
      </Link>
    );
  }

  return (
    <Button>
      <Link
        sx={{
          textDecoration: 'none',
          '& :hover': {
            color: ({ palette }) => palette.text.primary,
          },
        }}
        className={classes.buttonStyle}
        onClick={auth?.signinRedirect}
      >
        <Typography className={classes.buttonStyle}>Sign in</Typography>
      </Link>
    </Button>
  );
}

export default SignInButton;
