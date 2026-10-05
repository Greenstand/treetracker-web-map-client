import { Alert, Button } from '@mui/material';
import log from 'loglevel';
import { useRouter } from 'next/router';
import React from 'react';

function DefaultFallback({ reset, message = 'This section failed to load.' }) {
  return (
    <Alert
      severity="error"
      sx={{ m: 2 }}
      action={
        <Button color="inherit" size="small" onClick={reset}>
          Retry
        </Button>
      }
    >
      {message}
    </Alert>
  );
}

function keysChanged(prev = [], next = []) {
  return (
    prev.length !== next.length ||
    prev.some((key, i) => !Object.is(key, next[i]))
  );
}

/*
  Catch render errors in a subtree so they don't unmount the whole app (and
  the map with it). React 17 requires a class component for this.
*/
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidUpdate(prevProps) {
    const { error } = this.state;
    const { resetKeys } = this.props;
    if (error && keysChanged(prevProps.resetKeys, resetKeys)) {
      this.reset();
    }
  }

  componentDidCatch(error, info) {
    const { name } = this.props;
    log.error(`[ErrorBoundary:${name}]`, error?.message, {
      route: typeof window !== 'undefined' ? window.location.href : null,
      stack: error?.stack,
      componentStack: info?.componentStack,
    });
  }

  reset() {
    this.setState({ error: null });
  }

  render() {
    const { error } = this.state;
    const { fallback, children } = this.props;
    if (!error) return children;
    if (typeof fallback === 'function') {
      return fallback({ error, reset: this.reset });
    }
    if (fallback !== undefined) return fallback;
    return <DefaultFallback reset={this.reset} />;
  }
}

function renderPageFallback({ reset }) {
  return (
    <DefaultFallback
      reset={reset}
      message="This page failed to load. The map is still available."
    />
  );
}

/*
  boundary for the left panel page content, reset on navigation
*/
export function PageErrorBoundary({ children }) {
  const router = useRouter();
  return (
    <ErrorBoundary
      name="page"
      resetKeys={[router?.asPath]}
      fallback={renderPageFallback}
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;
