import log from 'loglevel';

export function getPathWhenClickTree(tree, pathname, query) {
  const path = pathname.match(
    /^(\/(planters|organizations|wallets)\/([a-z0-9-]+))?(\/(trees|tokens)\/([a-z0-9-]+))?$/,
    // 1: (/planters/1234)
    // 2: (planters)
    // 3: (1234)
    // 4: (/tokens/1234)
    // 5: (tokens)
    // 6: (1234)
  );
  log.warn('parsed path:', path);

  const optionalParams = {
    ...(query.embed && { embed: query.embed }),
    ...(query.timeline && { timeline: query.timeline }),
  };

  let pathnameResult = pathname;
  if (path) {
    if (!path[1] && path[5] === 'tokens') {
      pathnameResult = path[4];
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
