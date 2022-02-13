/* eslint-disable global-require */

// use correct mock depending on environment
if (typeof window === 'undefined') {
  // mock api calls from nextjs server
  const { server } = require('./server');
  server.listen({ onUnhandledRequest: 'bypass' });
} else {
  // mock api calls from nextjs client
  const { worker } = require('./browser');
  worker.start({ onUnhandledRequest: 'bypass' });
}
