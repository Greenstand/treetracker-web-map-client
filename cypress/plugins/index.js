/* eslint-disable global-require */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
const http = require('http');
const next = require('next');
const nock = require('nock');
require('dotenv').config();

// start the Next.js server when Cypress starts
module.exports = async (on, config) => {
  require('cypress-watch-and-reload/plugins')(config);

  // copy env vars
  // eslint-disable-next-line no-param-reassign
  config.env.NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API;

  // exit if not using nock to mock nextjs ssr functions
  if (!config.env.nock) return config;

  const app = next({ dev: true });
  const handleNextRequests = app.getRequestHandler();
  await app.prepare();

  const customServer = new http.Server((req, res) =>
    handleNextRequests(req, res),
  );

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
        scope = scope[methodString](path).reply(statusCode, body);
      }

      return null;
    },
  });

  return config;
};
