import { rest } from 'msw';
import mockTree from '../../cypress/fixtures/tree186734.json';
import leader from '../../doc/examples/countries/leader.json';
import organization from '../../doc/examples/organizations/1.json';
import planter from '../../doc/examples/planters/940.json';
import species from '../../doc/examples/species/1.json';

const handlers = [
  rest.get('*/trees*', (req, res, ctx) =>
    res(
      ctx.status(200, 'success'),
      ctx.json({
        trees: [{ ...mockTree }, { ...mockTree }, { ...mockTree }],
      }),
    ),
  ),

  rest.get('*/planters/*', (req, res, ctx) =>
    res(ctx.status(200, 'success'), ctx.json(planter)),
  ),

  rest.get('*/planters*', (req, res, ctx) =>
    res(
      ctx.status(200, 'success'),
      ctx.json({
        planters: [{ ...planter }, { ...planter }, { ...planter }],
      }),
    ),
  ),

  rest.get('*/species*', (req, res, ctx) =>
    res(
      ctx.status(200, 'success'),
      ctx.json({
        species: [{ ...species }, { ...species }, { ...species }],
      }),
    ),
  ),

  rest.get('*/countries/leaderboard', (req, res, ctx) =>
    res(ctx.status(200, 'success'), ctx.json(leader)),
  ),

  rest.get('*/organizations/*', (req, res, ctx) =>
    res(ctx.status(200, 'success'), ctx.json(organization)),
  ),
];
export default handlers;
