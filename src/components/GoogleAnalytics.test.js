import { render, waitFor } from '@testing-library/react';
import GoogleAnalytics from './GoogleAnalytics';

const gtagScript = () =>
  document.querySelector('script[src*="googletagmanager.com"]');

describe('GoogleAnalytics', () => {
  afterEach(() => {
    // eslint-disable-next-line no-underscore-dangle
    delete window.__RUNTIME_ENV__;
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
    // eslint-disable-next-line no-underscore-dangle
    window.__RUNTIME_ENV__ = { NEXT_PUBLIC_GA_ID: 'G-TEST123' };
    render(<GoogleAnalytics />);
    await waitFor(() => expect(gtagScript()).not.toBeNull());
    expect(gtagScript().getAttribute('src')).toBe(
      'https://www.googletagmanager.com/gtag/js?id=G-TEST123',
    );
    expect(document.documentElement.innerHTML).toContain(
      `gtag('config', "G-TEST123")`,
    );
  });
});
