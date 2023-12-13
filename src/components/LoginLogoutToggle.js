import { useAuth } from 'react-oidc-context';
import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';

function LoginLogoutToggle({ classes, isMobile }) {
  const auth = useAuth();

  if (auth?.isAuthenticated) {
    return <SignOutButton auth={auth} classes={classes} isMobile={isMobile} />;
  }
  return <SignInButton auth={auth} classes={classes} isMobile={isMobile} />;
}

export default LoginLogoutToggle;
