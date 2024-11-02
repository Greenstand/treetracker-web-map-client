import { rest } from 'msw';
import mockTree from '../../cypress/fixtures/tree186734.json';
import leader from '../../doc/examples/countries/leader.json';
import grower from '../../doc/examples/growers/100.json';
import organization from '../../doc/examples/organizations/1.json';
import species from '../../doc/examples/species/1.json';

const trees = { trees: [mockTree, mockTree, mockTree] };
const host = process.env.NEXT_PUBLIC_API || '';

const handlers = [
  rest.get(`${host}/trees/featured`, (req, res, ctx) =>
    res(ctx.status(200, 'success'), ctx.json(trees)),
  ),

  rest.get(`${host}/trees/:id`, (req, res, ctx) =>
    res(ctx.status(200, 'success'), ctx.json(mockTree)),
  ),

  rest.get(`${host}/trees*`, (req, res, ctx) =>
    res(ctx.status(200, 'success'), ctx.json(trees)),
  ),

  rest.get(`${host}/growers/featured`, (req, res, ctx) =>
    res(
      ctx.status(200, 'success'),
      ctx.json({
        growers: [grower, grower, grower],
      }),
    ),
  ),

  rest.get(`${host}/growers/:id`, (req, res, ctx) =>
    res(ctx.status(200, 'success'), ctx.json(grower)),
  ),

  rest.get(`${host}/organizations/featured`, (req, res, ctx) =>
    res(
      ctx.status(200, 'success'),
      ctx.json({
        organizations: [organization, organization, organization],
      }),
    ),
  ),

  rest.get(`${host}/organizations/:id`, (req, res, ctx) =>
    res(ctx.status(200, 'success'), ctx.json(organization)),
  ),

  rest.get(`${host}/species*`, (req, res, ctx) =>
    res(
      ctx.status(200, 'success'),
      ctx.json({
        species: [species, species, species],
      }),
    ),
  ),

  rest.get(`${host}/countries/leaderboard`, (req, res, ctx) =>
    res(ctx.status(200, 'success'), ctx.json(leader)),
  ),
];

export default handlers;
