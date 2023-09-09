import log from 'loglevel';
import * as utils from './utils';

const MAP_URL_PATTERN =
  /^(\/(planters|organizations|wallets)\/([a-z0-9-]+))?(\/(trees|tokens)\/([a-z0-9-]+))?(\?.*)?$/;
// v2 api pattern
const MAP_URL_PATTERNV2 =
  /^(\/v2\/(planters|organizations|wallets)\/([a-z0-9-]+))?(\/v2\/(trees|tokens|captures)\/([a-z0-9-]+))?(\?.*)?$/;

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
      optionalParams.tree_id = tree.id.toString();
    } else {
      pathnameResult = `${path[1] || ''}/${path[4] || 'trees'}/${
        path[5] === 'tokens' ? path[4] : tree.id
      }`;
    }
  } else {
    const match2 = pathname.match(/^\/wallets\/([a-z0-9-]+)\/tokens$/);
    log.warn('match pattern 2', match2);
    if (match2) {
      pathnameResult = `/wallets/${match2[1]}/tokens`;
      optionalParams.tree_id = tree.id.toString();
    } else {
      pathnameResult = `/trees/${tree.id}`;
    }
  }
  log.warn('pathname to push:', pathnameResult, optionalParams);

  return {
    pathname: pathnameResult,
    query: optionalParams,
  };
}
/**
 * if {isView} is true,view's is used (lat,long,zoomLevel z)
 *
 * else bounds is used (southWestLng, southWestLat, northEastLng, northEastLat)
 * @returns string url
 */
function updatePathWhenMapMoveEnd(location, map, router, isView = true) {
  log.warn(
    'updatePathWhenMapMoveEnd: location:',
    location,
    ' map:',
    map,
    ' router:',
    router,
  );

  // determine to use which format to use for coordinate
  let coordinate = '';
  if (!isView) {
    coordinate = `bounds=${map.getCurrentBounds()}`;
  } else {
    const { center, zoomLevel } = map.getCurrentView();
    coordinate = `view=${center.lat},${center.lng},${zoomLevel}z`;
  }

  let result = `${location.pathname}?${coordinate}${
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
  const matchV2 = pathname.match(MAP_URL_PATTERNV2);

  if (match) {
    const context = {
      name: match[2],
      id: match[3],
    };
    return context;
  }

  if (matchV2) {
    const context = {
      name: matchV2[2],
      id: matchV2[3],
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

function getView(router) {
  const { view } = router.query;
  try {
    if (view) {
      const [lat, lon, zoomLevel] = view.split(',');
      return {
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        zoomLevel: parseFloat(zoomLevel.substring(0, zoomLevel.length - 1)),
      };
    }
  } catch (e) {
    console.warn("view's format is not correct");
  }
  return null;
}

export {
  getPathWhenClickTree,
  updatePathWhenMapMoveEnd,
  getContext,
  getBounds,
  getView,
};
