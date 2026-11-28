import log from 'loglevel';

/**
 * Ask the map core for the initial view, and ask one more time when the
 * first request was cancelled.
 *
 * The map core 2.7.4 uses one canceller for all its requests. Its request for
 * the nearest tree can start while the request of getInitialView() is still
 * open (for example when the tree tiles come from the browser cache). It then
 * cancels that request, and getInitialView() fails with a TypeError on the
 * empty answer (each browser has its own message). The other failures (no
 * tree, a failed request) are not a TypeError, so they get no second request.
 *
 * @param {any} map - the map core instance (treetracker-web-map-core)
 */
async function getInitialViewWithRetry(map) {
  try {
    return await map.getInitialView();
  } catch (error) {
    if (!(error instanceof TypeError)) throw error;
    log.warn('the initial view request of the map failed, ask again:', error);
    return map.getInitialView();
  }
}

/**
 * Move the map to the view of the trees that the filter selects.
 *
 * The map core rejects when it cannot find that view: the webmap API has no
 * tree for the filter, the request fails, or the filter has no field that the
 * core knows (an organization without `map_name`). Then the map keeps its
 * current view, and the page does not get an unhandled rejection (#1874).
 *
 * @param {any} map - the map core instance (treetracker-web-map-core)
 * @param {{ minZoom?: number }} [options] - minZoom: the map does not zoom out
 *   further than this level
 */
export default async function gotoInitialView(map, { minZoom = 0 } = {}) {
  let view;
  try {
    view = await getInitialViewWithRetry(map);
  } catch (error) {
    log.warn('no initial view for the map, keep the current view:', error);
    return;
  }
  const zoomLevel = Math.max(view.zoomLevel, minZoom);
  await map.gotoView(view.center.lat, view.center.lon, zoomLevel);
}
