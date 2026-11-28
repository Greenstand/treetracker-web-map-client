import { Link, Button, Typography } from '@mui/material';
import HeadTag from 'components/HeadTag';

const pageNotfound = () => (
  <>
    <HeadTag title="Page Not Found" />
    <div className="not-found">
      <Typography variant="h1" component="h1">
        404
      </Typography>
      <div className="not-found-background" />
      <Typography variant="h3" component="h3">
        Looks like you&apos;re lost
      </Typography>
      <Typography variant="body1" component="p">
        Page you are looking for is missing.
      </Typography>
      <Button component={Link} variant="contained" href="/" color="primary">
        Go home
      </Button>
    </div>
  </>
);

export default pageNotfound;
