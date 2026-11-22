import log from 'loglevel';

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
    view = await map.getInitialView();
  } catch (error) {
    log.warn('no initial view for the map, keep the current view:', error);
    return;
  }
  const zoomLevel = Math.max(view.zoomLevel, minZoom);
  await map.gotoView(view.center.lat, view.center.lon, zoomLevel);
}
