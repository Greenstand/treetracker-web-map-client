import log from 'loglevel';
import gotoInitialView from './mapView';

function fakeMap(getInitialView) {
  return {
    getInitialView: jest.fn(getInitialView),
    gotoView: jest.fn(() => Promise.resolve()),
  };
}

describe('gotoInitialView', () => {
  it('moves the map to the initial view of the map core', async () => {
    const map = fakeMap(() =>
      Promise.resolve({ center: { lat: -3.36, lon: 36.84 }, zoomLevel: 9 }),
    );
    await gotoInitialView(map);
    expect(map.gotoView).toHaveBeenCalledWith(-3.36, 36.84, 9);
  });

  it.each([
    [1, 2],
    [2, 2],
    [9, 9],
  ])(
    'with minZoom 2, moves to zoom level %p as %p',
    async (zoomLevel, expected) => {
      const map = fakeMap(() =>
        Promise.resolve({ center: { lat: -3.36, lon: 36.84 }, zoomLevel }),
      );
      await gotoInitialView(map, { minZoom: 2 });
      expect(map.gotoView).toHaveBeenCalledWith(-3.36, 36.84, expected);
    },
  );

  // The errors that the map core 2.7.4 gives on the planter, wallet and
  // organization pages (issue #1874).
  it.each([
    ['the webmap API has no tree', new Error('Can not find any data')],
    [
      'the webmap API request fails',
      new Error('Request failed with status code 503'),
    ],
    [
      'the filter has no field that the map core knows',
      new TypeError("Cannot read properties of undefined (reading 'center')"),
    ],
  ])('keeps the current view when %s', async (_case, error) => {
    const warn = jest.spyOn(log, 'warn').mockImplementation(() => {});
    const map = fakeMap(() => Promise.reject(error));
    await expect(gotoInitialView(map)).resolves.toBeUndefined();
    expect(map.gotoView).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(expect.any(String), error);
    warn.mockRestore();
  });
});
