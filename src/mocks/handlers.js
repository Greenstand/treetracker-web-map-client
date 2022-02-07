import { rest } from 'msw';
import apiPaths from 'models/apiPaths';
import mockTree from '../../cypress/fixtures/tree186734.json';

const handlers = [
  rest.get(apiPaths.featuredTrees, (req, res, ctx) =>
    res(
      ctx.status(200, 'success'),
      ctx.json({
        trees: [{ ...mockTree }, { ...mockTree }, { ...mockTree }],
      }),
    ),
  ),

  rest.get(apiPaths.leaders, (req, res, ctx) =>
    res(
      ctx.status(200, 'success'),
      ctx.json({
        countries: true,
      }),
    ),
  ),
];
export default handlers;
