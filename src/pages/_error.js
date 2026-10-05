import log from 'loglevel';
import { useEffect } from 'react';
import ErrorPage500 from './500';

export default function Error({ statusCode, message }) {
  useEffect(() => {
    log.error('[_error] rendered error page', { statusCode, message });
  }, [statusCode, message]);
  return <ErrorPage500 />;
}

Error.getInitialProps = ({ res, err }) => ({
  statusCode: res?.statusCode ?? err?.statusCode ?? 404,
  message: err?.message ?? null,
});
