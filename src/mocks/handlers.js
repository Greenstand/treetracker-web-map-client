import { rest } from 'msw';
import mockTree from '../../cypress/fixtures/tree186734.json';
import leader from '../../doc/examples/countries/leader.json';

const handlers = [
  rest.get('*/trees/featured', (req, res, ctx) =>
    res(
      ctx.status(200, 'success'),
      ctx.json({
        trees: [{ ...mockTree }, { ...mockTree }, { ...mockTree }],
      }),
    ),
  ),

  rest.get('*/countries/leaderboard', (req, res, ctx) =>
    res(ctx.status(200, 'success'), ctx.json(leader)),
  ),
];
export default handlers;
