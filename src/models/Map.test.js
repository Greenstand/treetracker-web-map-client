import Map from "./Map";
import Requester from "./Requester";
import response from "../../cypress/fixtures/tile/zoom_level=10&userid=1.json";
jest.mock("./Requester");

describe("Map", () => {

  it("getInitialView", async () => {
    const request = jest.fn(() => response);
    Requester.mockImplementation(() => ({
      request,
    }));
    const map = new Map({
      userid: "1",
      width: 1440,
      height: 510,
    });

    const view = await map.getInitialView();
    expect(request).toHaveBeenCalled();
    expect(view).toMatchObject({
      center: {
        lat: 18.788082619896404,
        lng: -61.031384143776386,
      },
      zoomLevel: 3
    });
  });

});
