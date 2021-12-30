import { Link } from '@mui/material';

const pageNotfound = () => (
  <div className="not-found">
    <h1>404</h1>
    <div className="not-found-background" />
    <h3>Looks like you&apos;re lost</h3>
    <p>Page you are looking for is missing.</p>
    <Link href="/">
      <a className="not-found-link">Go home</a>
    </Link>
  </div>
);

export default pageNotfound;
