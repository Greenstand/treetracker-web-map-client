import response from "../../cypress/fixtures/tile/zoom_level=10&userid=1.json";
import Map from "./Map";
import Requester from "./Requester";

jest.mock("./Requester");

describe("Map", () => {

  beforeEach(() => {
    Requester.mockClear();
  })

  it("loadInitialView", async () => {
    const request = jest.fn(() => response);
    Requester.mockImplementation(() => ({
      request,
    }));
    const view = {};
    const map = new Map({
      userid: "1",
      width: 1440,
      height: 510,
      moreEffect: false,
      filters: {
        wallet: "mayeda",
      },
      map: {
        setView: jest.fn((center, zoomLevel, animate) => {
          view.center = center;
          view.zoomLevel = zoomLevel;
          view.animate = animate;
        })
      }
    });
    expect(Requester).toHaveBeenCalledTimes(1);

    await map.loadInitialView();
    expect(request).toHaveBeenCalled();
    expect(view).toMatchObject({
      center: {
        lat: 18.788082619896404,
        lng: -61.031384143776386,
      },
      zoomLevel: 3,
    });
  });

});
