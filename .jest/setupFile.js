import handlers from 'mocks/handlers';
import { setupServer } from 'msw/node';

const mockApiServer = setupServer(...handlers);
beforeAll(() => {
  mockApiServer.listen();
});
afterAll(() => mockApiServer.close());
