import log from 'loglevel';

const MAP_URL_PATTERN =
  /^(\/(planters|organizations|wallets)\/([a-z0-9-]+))?(\/(trees|tokens)\/([a-z0-9-]+))?(\?.*)?$/;
// 1: (/planters/1234)
// 2: (planters)
// 3: (1234)
// 4: (/tokens/1234)
// 5: (tokens)
// 6: (1234)
// 7: (?embed=true&timeline=true)

function getPathWhenClickTree(tree, pathname, query) {
  const path = pathname.match(MAP_URL_PATTERN);
  log.warn('parsed path:', path, ' for pathname:', pathname);

  const optionalParams = {
    ...(query.embed && { embed: query.embed }),
    ...(query.timeline && { timeline: query.timeline }),
  };

  let pathnameResult = pathname;
  if (path) {
    if (!path[1] && path[5] === 'tokens') {
      pathnameResult = path[4];
    } else if (path[1] && path[5] === 'trees') {
      pathnameResult = `${path[1]}/trees/${tree.id}`;
    } else {
      pathnameResult = `${path[1] || ''}/${path[4] || 'trees'}/${
        path[5] === 'tokens' ? path[4] : tree.id
      }`;
    }
  } else {
    pathnameResult = `/trees/${tree.id}`;
  }
  log.warn('pathname to push:', pathnameResult);

  return {
    pathname: pathnameResult,
    query: optionalParams,
  };
}

function getContext(pathname) {
  log.warn('to resolve context for:', pathname);
  const match = pathname.match(MAP_URL_PATTERN);
  if (match) {
    const context = {
      name: match[2],
      id: match[3],
    };
    return context;
  }
  return null;
}

export { getPathWhenClickTree, getContext };
