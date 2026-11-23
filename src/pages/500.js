import { Link, Typography } from '@mui/material';
import HeadTag from 'components/HeadTag';

export default function somethingWentWrong() {
  return (
    <>
      <HeadTag title="Server Error" />
      <div className="not-found">
        <Typography variant="h1">500</Typography>
        <div className="not-found-background" />
        <Typography variant="h6">Something went wrong</Typography>
        <Link
          href="/"
          sx={{
            color: 'text.primary',
          }}
        >
          Go home
        </Link>
      </div>
    </>
  );
}
