import { useTheme } from '@emotion/react';
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
        <CustomLink />
      </div>
    </>
  );
}

function CustomLink() {
  const theme = useTheme();
  return (
    <Link href="/">
      <a style={{ color: theme.palette.text.primary }}>Go home</a>
    </Link>
  );
}
