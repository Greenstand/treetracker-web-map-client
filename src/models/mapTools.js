/*
 * Some tool for map calculation
 */
import expect from 'expect-runtime';
import log from 'loglevel';
import 'leaflet';

function go(direction, location, degree) {
  expect(direction).oneOf(['east', 'west', 'north', 'south']);
  expect(location).property('lat').number();
  expect(location).property('lng').number();
  expect(degree).number();
  const result = { lat: location.lat, lng: location.lng };
  if (direction === 'east') {
    result.lng += degree;
  } else if (direction === 'west') {
    result.lng -= degree;
  } else if (direction === 'north') {
    result.lat += degree;
  } else if (direction === 'south') {
    result.lat -= degree;
  }
  //correct
  if (direction === 'east' || direction === 'west') {
    if (result.lng > 180) {
      result.lng = (result.lng % 180) - 180;
    } else if (result.lng < -180) {
      result.lng = (result.lng % 180) + 180;
    }
  } else if (direction === 'north' || direction === 'south') {
    if (result.lat > 90) {
      result.lat = 90 - (result.lat % 90);
    } else if (result.lat < -90) {
      result.lat = (-result.lat % 90) - 90;
    }
  }
  return result;
}

function getAngleLng(east, west) {
  let angle = east - west;
  if (angle < 0) {
    angle += 360;
  }
  return angle;
}

function getAngleLat(north, south) {
  let angle = north - south;
  log.log('angle:', angle);
  angle = Math.abs(angle);
  return angle;
}

/*
 * To calculate the initial bounds for some points/clusters,
 * expressing(return value) by:
 * {
 *    center: {
 *      lat: number,
 *      lng: number,
 *    },
 *    zoomLevel: number,
 * }
 *
 *
 */
function getInitialBounds(locations, width, height) {
  expect(locations).lengthOf.above(0);
  //convert
  locations.forEach((location) => {
    location.lat = parseFloat(location.lat);
    location.lng = parseFloat(location.lng);
  });
  locations.every((location) => {
    expect(location).property('lat').number();
    expect(location).property('lng').number();
  });
  expect(width).above(0);
  expect(height).above(0);

  // If there is only a single cluster, create a bounding box centered on that cluster with a .1 degree latitude height and .1 degree longitude width
  if (locations.length === 1) {
    const location = locations[0];
    const degrees = 0.005;
    log.log(degrees);
    const cornerWestNorth = go('north', go('west', location, degrees), degrees);
    locations.push(cornerWestNorth);
    const cornerWestSouth = go('south', go('west', location, degrees), degrees);
    locations.push(cornerWestSouth);
    const cornerEastNorth = go('north', go('east', location, degrees), degrees);
    locations.push(cornerEastNorth);
    const cornerEastSouth = go('south', go('east', location, degrees), degrees);
    locations.push(cornerEastSouth);
  }

  const bounds = new window.L.latLngBounds();
  for (let location of locations) {
    bounds.extend(location);
  }
  log.log('bounds:', bounds);
  const center = {
    lat: bounds.getCenter().lat,
    lng: bounds.getCenter().lng,
  };
  //cal zoom
  let zoom;
  var GLOBE_WIDTH = 256; // a constant in Google's map projection
  {
    const west = bounds.getSouthWest().lng;
    const east = bounds.getNorthEast().lng;
    const angle = getAngleLng(east, west);
    zoom = Math.round(Math.log((width * 360) / angle / GLOBE_WIDTH) / Math.LN2);
    log.log('zoom1:', zoom);
  }
  let zoom2;
  {
    const south = bounds.getSouthWest().lat;
    const north = bounds.getNorthEast().lat;
    const angle = getAngleLat(north, south);
    log.log('angle:', angle);
    zoom2 = Math.round(
      Math.log((height * 360) / angle / GLOBE_WIDTH) / Math.LN2,
    );
    log.log('zoom2:', zoom2);
  }
  log.log('height:', height, 'width:', width);
  const zoomFinal = Math.min(zoom, zoom2) - 1; /* to give some padding*/
  log.log('zoom final:', zoomFinal);
  const result = {
    center,
    zoomLevel: zoomFinal,
  };
  log.log('result:', result);
  return result;
}

const TILE_SIZE = 256;
// The mapping between latitude, longitude and pixels is defined by the web
// mercator projection.
function project(latLng = google.maps.LatLng) {
  let siny = Math.sin((latLng.lat * Math.PI) / 180);

  // Truncating to 0.9999 effectively limits latitude to 89.189. This is
  // about a third of a tile past the edge of the world tile.
  siny = Math.min(Math.max(siny, -0.9999), 0.9999);

  return window.L.point(
    TILE_SIZE * (0.5 + latLng.lng / 360),
    TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)),
  );
}

function getLatLngCoordinateByPixel(top, left, map) {
  expect(top).number();
  expect(left).number();
  expect(map).defined();
  const northWest = window.L.latLng(
    map.getBounds().getNorthEast().lat,
    map.getBounds().getSouthWest().lng,
  );
  const northWestPixel = map.getProjection().fromLatLngToPoint(northWest);
  const pixelSize = Math.pow(2, -map.getZoom());
  const result = window.L.point(
    northWestPixel.x + left * pixelSize,
    northWestPixel.y + top * pixelSize,
  );
  const resultLatLng = map.getProjection().fromPointToLatLng(result);
  expect(resultLatLng).property('lat').a(expect.any(Function));
  return resultLatLng;
}

function getPixelCoordinateByLatLng(lat, lng, map) {
  expect(lat).number();
  expect(lng).number();
  expect(map).defined();
  const northWest = window.L.latLng(
    map.getBounds().getNorthEast().lat,
    map.getBounds().getSouthWest().lng,
  );
  const northWestPixel = map.getProjection().fromLatLngToPoint(northWest);
  const target = window.L.latLng(lat, lng);
  const targetPixel = map.getProjection().fromLatLngToPoint(target);
  const pixelSize = Math.pow(2, -map.getZoom());
  const result = {
    top: (targetPixel.y - northWestPixel.y) / pixelSize,
    left: (targetPixel.x - northWestPixel.x) / pixelSize,
  };
  expect(result).property('top').number();
  return result;
}

export {
  go,
  getAngleLat,
  getAngleLng,
  getInitialBounds,
  getLatLngCoordinateByPixel,
  getPixelCoordinateByLatLng,
};
