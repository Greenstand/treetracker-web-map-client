import log from 'loglevel';
import * as utils from './utils';

const MAP_URL_PATTERN =
  /^(\/(planters|organizations|wallets)\/([a-z0-9-]+))?(\/(trees|tokens)\/([a-z0-9-]+))?(\?.*)?$/;
// 1: (/planters/1234)
// 2: (planters)
// 3: (1234)
// 4: (/tokens/1234)
// 5: (tokens)
// 6: (1234)
// 7: (?embed=true&timeline=true)

// '/wallets/1f2a0862-66d1-4b42-8216-5a5cb9c6eca5/tokens?tree_id=95614',
const MAP_URL_PATTERN_2 = /^\/wallets\/([a-z0-9-]+)\/tokens$/;

function getPathWhenClickTree(tree, location, router, map, options = {}) {
  const pathname = utils.nextPathBaseDecode(
    location.pathname,
    options.base || '',
  );
  const path = pathname.match(MAP_URL_PATTERN);
  log.warn(
    'parsed path:',
    path,
    ' for location:',
    JSON.stringify(location, undefined, 2),
    ' tree:',
    tree,
    'router:',
    JSON.stringify(router, undefined, 2),
    'pathname:',
    pathname,
    'with options:',
    options,
  );
  log.warn(JSON.stringify(tree, undefined, 2));

  const optionalParams = {
    ...(router.query.embed && { embed: router.query.embed }),
    ...(router.query.timeline && { timeline: router.query.timeline }),
  };

  let pathnameResult = pathname;
  if (path) {
    log.warn('match pattern 1');
    if (!path[1] && path[5] === 'tokens') {
      pathnameResult = path[4];
    } else if (path[1] && path[5] === 'trees') {
      pathnameResult = `${path[1]}/trees/${tree.id}`;
    } else if (path[1] === undefined && path[5] === 'trees') {
      pathnameResult = `/trees/${tree.id}`;
    } else if (path[2] === 'wallets') {
      pathnameResult = `${path[1]}/tokens`;
      optionalParams.tree_id = tree.id;
    } else {
      pathnameResult = `${path[1] || ''}/${path[4] || 'trees'}/${
        path[5] === 'tokens' ? path[4] : tree.id
      }`;
    }
  } else {
    const match2 = pathname.match(/^\/wallets\/([a-z0-9-]+)\/tokens$/);
    if (match2) {
      pathnameResult = `/wallets/${match2[1]}/tokens`;
      optionalParams.tree_id = tree.id;
    } else {
      pathnameResult = `/trees/${tree.id}`;
    }
  }
  log.warn('pathname to push:', pathnameResult);

  return {
    pathname: pathnameResult,
    query: optionalParams,
  };
}

function updatePathWhenMapMoveEnd(location, map, router) {
  log.warn(
    'updatePathWhenMapMoveEnd: location:',
    location,
    ' map:',
    map,
    ' router:',
    router,
  );
  let result = `${location.pathname}?bounds=${map.getCurrentBounds()}${
    router.query.timeline ? `&timeline=${router.query.timeline}` : ''
  }${router.query.embed ? `&embed=true` : ''}`;
  if (router.query.tree_id) {
    result += `&tree_id=${router.query.tree_id}`;
  }
  return result;
}

function getContext(router, options = {}) {
  log.warn('to resolve context for:', router);
  const pathname = utils.nextPathBaseDecode(router.asPath, options.base || '');
  const match = pathname.match(MAP_URL_PATTERN);
  if (match) {
    const context = {
      name: match[2],
      id: match[3],
    };
    return context;
  }
  const match2 = pathname.match(/^\/wallets\/([a-z0-9-]+)\/tokens\?.*$/);
  const context = {
    name: 'wallets',
    id: match2[1],
  };
  return context;

  return null;
}

function getBounds(router) {
  return router.query.bounds;
}
export {
  getPathWhenClickTree,
  updatePathWhenMapMoveEnd,
  getContext,
  getBounds,
};
