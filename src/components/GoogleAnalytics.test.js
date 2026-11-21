import { render, waitFor } from '@testing-library/react';
import GoogleAnalytics from './GoogleAnalytics';

// The test gives the id. Without this mock, getEnv falls back to
// process.env.NEXT_PUBLIC_GA_ID, so the result would depend on the shell.
// src/models/runtimeEnv.test.js tests getEnv itself.
let mockGaId;
jest.mock('models/runtimeEnv', () => ({
  getEnv: (key) => (key === 'NEXT_PUBLIC_GA_ID' ? mockGaId : undefined),
}));

const gtagScript = () =>
  document.querySelector('script[src*="googletagmanager.com"]');

describe('GoogleAnalytics', () => {
  afterEach(() => {
    mockGaId = undefined;
  });

  it('loads no Google Analytics script when the id is not set', async () => {
    render(<GoogleAnalytics />);
    // give effects a chance to run before asserting the absence
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });
    expect(gtagScript()).toBeNull();
    expect(document.documentElement.innerHTML).not.toContain('undefined');
  });

  it('loads the Google Analytics script with the runtime id', async () => {
    mockGaId = 'G-TEST123';
    render(<GoogleAnalytics />);
    await waitFor(() => expect(gtagScript()).not.toBeNull());
    expect(gtagScript()?.getAttribute('src')).toBe(
      'https://www.googletagmanager.com/gtag/js?id=G-TEST123',
    );
    expect(document.documentElement.innerHTML).toContain(
      `gtag('config', "G-TEST123")`,
    );
  });
});
