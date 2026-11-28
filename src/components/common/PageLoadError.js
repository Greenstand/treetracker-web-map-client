import { Alert, Box, Button } from '@mui/material';
import log from 'loglevel';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import HeadTag from 'components/HeadTag';
import Crumbs from './Crumbs';

/*
  rendered by entity pages when getStaticProps failed to load the entity
  (props.loadError), so the panel degrades instead of crashing the app
*/
export default function PageLoadError({
  entityLabel,
  id,
  loadError = null,
  logTag,
}) {
  const router = useRouter();
  const tag = logTag || `[${entityLabel.toLowerCase()} page]`;

  useEffect(() => {
    log.error(`${tag} rendered without ${entityLabel.toLowerCase()}`, {
      id,
      loadError,
    });
  }, [tag, entityLabel, id, loadError]);

  function handleRetry() {
    router.replace(router.asPath);
  }

  return (
    <>
      <HeadTag title={`${entityLabel} ${id ?? ''}`.trim()} />
      <Box
        data-testid="page-load-error"
        sx={{
          padding: (t) => [t.spacing(0, 4), 6],
          width: 1,
          boxSizing: 'border-box',
        }}
      >
        <Crumbs
          items={[
            { name: 'Home', url: '/' },
            { name: `${entityLabel} ${id ?? ''}`.trim() },
          ]}
        />
        <Alert
          severity="warning"
          sx={{ mt: 4 }}
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              Retry
            </Button>
          }
        >
          {`We couldn't load this ${entityLabel.toLowerCase()}'s details right now. The map is still available.`}
        </Alert>
      </Box>
    </>
  );
}
