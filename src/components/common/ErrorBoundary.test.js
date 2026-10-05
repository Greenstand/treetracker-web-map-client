import { fireEvent, render, screen } from '@testing-library/react';
import log from 'loglevel';
import ErrorBoundary from './ErrorBoundary';

let shouldThrow;
function Child() {
  if (shouldThrow) throw new Error('kaboom');
  return <div>child content</div>;
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    shouldThrow = true;
    jest.spyOn(log, 'error').mockImplementation(() => {});
    // react logs caught render errors to console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the fallback and logs the error when a child throws', () => {
    render(
      <ErrorBoundary name="test-section">
        <Child />
      </ErrorBoundary>,
    );
    expect(screen.getByText('This section failed to load.')).toBeTruthy();
    expect(screen.queryByText('child content')).toBeNull();
    expect(log.error).toHaveBeenCalledTimes(1);
    const [label, message, details] = log.error.mock.calls[0];
    expect(label).toBe('[ErrorBoundary:test-section]');
    expect(message).toBe('kaboom');
    expect(details.componentStack).toContain('Child');
  });

  it('re-renders the children after reset', () => {
    render(
      <ErrorBoundary name="test-section">
        <Child />
      </ErrorBoundary>,
    );
    shouldThrow = false;
    fireEvent.click(screen.getByText('Retry'));
    expect(screen.getByText('child content')).toBeTruthy();
  });

  it('supports a render-function fallback and resets on resetKeys change', () => {
    const { rerender } = render(
      <ErrorBoundary
        name="test-section"
        resetKeys={['/a']}
        fallback={({ error }) => <div>custom: {error.message}</div>}
      >
        <Child />
      </ErrorBoundary>,
    );
    expect(screen.getByText('custom: kaboom')).toBeTruthy();
    shouldThrow = false;
    rerender(
      <ErrorBoundary
        name="test-section"
        resetKeys={['/b']}
        fallback={({ error }) => <div>custom: {error.message}</div>}
      >
        <Child />
      </ErrorBoundary>,
    );
    expect(screen.getByText('child content')).toBeTruthy();
  });
});
