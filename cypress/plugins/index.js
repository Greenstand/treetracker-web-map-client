const nock = require('nock');
const http = require('http');
const next = require('next');

// start the Next.js server when Cypress starts
module.exports = async (on, config) => {
  require('cypress-watch-and-reload/plugins')(config);
  const app = next({ dev: true });
  const handleNextRequests = app.getRequestHandler();
  await app.prepare();

  const customServer = new http.Server(async (req, res) =>
    handleNextRequests(req, res),
  );

  await new Promise((resolve, reject) => {
    customServer.listen(3000, (err) => {
      if (err) {
        return reject(err);
      }
      console.log('> Ready on http://localhost:3000');
      resolve();
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

    async nock({ hostname, method, path, statusCode, body }) {
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
      method = method.toLowerCase();
      nock(hostname)[method](path).reply(statusCode, body);

      return null;
    },
  });

  return config;
};
