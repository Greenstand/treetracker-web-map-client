/* eslint-disable global-require */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
const fs = require('fs');
const http = require('http');
const next = require('next');
const nock = require('nock');
require('dotenv').config({ path: '.env.development' });

// start the Next.js server when Cypress starts
module.exports = async (on, config) => {
  require('cypress-watch-and-reload/plugins')(config);

  // A headless browser starts at 1280x720, and Chrome draws its own UI inside
  // that window. The page then gets less than the viewport of
  // cypress.config.js (1440x800), and each screenshot cuts the page. So open
  // the window at 1920x1080.
  // https://docs.cypress.io/api/node-events/browser-launch-api#Set-screen-size-when-running-headless
  on('before:browser:launch', (browser, launchOptions) => {
    if (!browser.isHeadless) {
      return launchOptions;
    }
    if (browser.name === 'electron') {
      return {
        ...launchOptions,
        preferences: {
          ...launchOptions.preferences,
          width: 1920,
          height: 1080,
        },
      };
    }
    if (browser.family === 'chromium') {
      launchOptions.args.push('--window-size=1920,1080');
    }
    return launchOptions;
  });

  // keep the video of a spec only when a test in the spec failed
  // https://docs.cypress.io/app/guides/screenshots-and-videos#Delete-videos-for-specs-without-failing-or-retried-tests
  on('after:spec', (spec, results) => {
    if (!results || !results.video) {
      return;
    }
    const failed = results.tests.some((test) =>
      test.attempts.some((attempt) => attempt.state === 'failed'),
    );
    if (!failed) {
      fs.unlinkSync(results.video);
    }
  });

  // copy env vars
  // eslint-disable-next-line no-param-reassign
  config.env.NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API;
  // eslint-disable-next-line no-param-reassign
  config.env.NEXT_PUBLIC_BASE = process.env.NEXT_PUBLIC_BASE;

  // exit if not using nock to mock nextjs ssr functions
  if (!config.env.nock) {
    console.warn("Cypress.env('nock') is not set, skipping nock preparation");
    return config;
  }

  const app = next({ dev: true });
  const handleNextRequests = app.getRequestHandler();
  await app.prepare();

  const customServer = new http.Server((req, res) =>
    handleNextRequests(req, res),
  );

  const axios = require('axios');
  const MockAdapter = require('axios-mock-adapter');
  // This sets the mock adapter on the default instance
  const mock = new MockAdapter(axios);

  await new Promise((resolve, reject) => {
    customServer.listen(3000, (err) => {
      if (err) {
        return reject(err);
      }
      console.log('> Ready on http://localhost:3000');
      return resolve();
    });
  });

  // register handlers for cy.task command
  // https://on.cypress.io/task
  on('task', {
    clearNock() {
      nock.restore();
      nock.cleanAll();

      return null;
    },

    nock({ hostname, method, path, statusCode, body }) {
      nock.activate();

      console.log(
        'nock will: %s %s%s respond with %d %o',
        method,
        hostname,
        path,
        statusCode,
        body,
      );

      // add one-time network stub like
      // nock('https://icanhazdadjoke.com').get('/').reply(200, ...)
      const methodString = method.toLowerCase();
      nock(hostname)[methodString](path).reply(statusCode, body);
      const url = `${hostname}${path}`;
      console.log('axios url:', url);
      mock.onGet(url).reply(statusCode, body);

      return null;
    },
    nockIntercept({ hostname, method, path, statusCode, body }) {
      console.log(
        'nock will: %s %s%s respond with %d %o',
        method,
        hostname,
        path,
        statusCode,
        body,
      );

      // add one-time network stub like
      // nock('https://icanhazdadjoke.com').get('/').reply(200, ...)
      const methodString = method.toLowerCase();
      nock(hostname)[methodString](path).reply(statusCode, body);
      const url = `${hostname}${path}`;
      console.log('axios url:', url);
      mock.onGet(url).reply(statusCode, body);
      return null;
    },
    nocks({ hostname, routes }) {
      nock.activate();

      let scope = nock(hostname);

      for (const route of routes) {
        const { method, path, statusCode, body } = route;

        console.log(
          'nock will: %s %s%s respond with %d',
          method,
          hostname,
          path,
          statusCode,
        );

        const methodString = method.toLowerCase();
        scope = scope.persist()[methodString](path).reply(statusCode, body);
        const url = `${hostname}${path}`;
        console.log('axios url2:', url);
        mock.onGet(url).reply(statusCode, body);
      }

      return null;
    },
  });

  return config;
};
