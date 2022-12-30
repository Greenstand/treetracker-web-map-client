import { Link, Button } from '@mui/material';
import HeadTag from 'components/HeadTag';

const pageNotfound = () => (
  <>
    <HeadTag title="Page Not Found" />
    <div className="not-found">
      <h1>404</h1>
      <div className="not-found-background" />
      <h3>Looks like you&apos;re lost</h3>
      <p>Page you are looking for is missing.</p>
      <Button component={Link} variant="contained" href="/" color="primary">
        Go home
      </Button>
    </div>
  </>
);

export default pageNotfound;
