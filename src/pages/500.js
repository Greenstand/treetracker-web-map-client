import { Link } from '@mui/material';
import HeadTag from 'components/HeadTag';

export default function somethingWentWrong() {
  return (
    <>
      <HeadTag title="Server Error" />
      <div className="not-found">
        <h1>500</h1>
        <div className="not-found-background" />
        <h3>Something went wrong</h3>
        <Link href="/">
          <a className="not-found-link">Go home</a>
        </Link>
      </div>
    </>
  );
}
