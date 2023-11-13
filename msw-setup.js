// msw-setup.js
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  // Define your API request handlers and their mock responses here
  rest.post('/api/register', (req, res, ctx) => {
    // Simulate a successful registration response
    return res(ctx.status(200));
  })
);

// Start the msw server before your tests
beforeAll(() => {
  server.listen();
});

// Clean up the msw server after your tests
afterAll(() => {
  server.close();
});
