import MapModel from "./MapModel";
import axios from "axios";

jest.mock("axios");

describe("MapModel", () => {

  beforeEach(async () => {
    //mock jQuery
    global.$ = () => ({
      addClass: jest.fn(),
      removeClass: jest.fn(),
      css: jest.fn(),
      show: jest.fn(),
    });
    //mock google map
    global.google = {
      maps: {
        geometry: {
          spherical: {
            computeDistanceBetween: jest.fn()
              .mockReturnValueOnce(800)
              .mockReturnValueOnce(0),
          },
        },
        LatLng: jest.fn(),
      },
    };
  });

  afterAll(() => {
    jest.clearAllMock();
    global.$ = undefined;
    global.google = undefined;
  });

  it.skip("checkArrow", async () => {
    axios.get = jest.fn(() => ({
      status: 200,
      data: {
        nearest: {
          type: "cluster",
          coordinates: [0, 20]
        },
      },
    }));
    const mapModel = new MapModel("/api/web/");
    jest.spyOn(mapModel, "showArrow");
    expect(mapModel).toBeInstanceOf(MapModel);
    mapModel.markers = [];
    mapModel.map = {
      getCenter: () => ({
        lat: () => 0,
        lng: () => 0,
        toJSON: () => ({lat:0,lng:0}),
      }),
      getBounds: () => ({
        contains: () => false,
      }),
      getZoom: () => 15,
    };
    await mapModel.checkArrow();
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/web\/nearest\?zoom_level=15&lat=0&lng=0/),
      expect.anything(),
    );
    expect(mapModel.showArrow).toHaveBeenCalledWith("north");
  });

  describe("Simulate slow API request, and previous request was canceled", () => {
    let cancel = jest.fn();

    beforeEach(() => {
      axios.get = jest.fn()
        //slow api
        .mockImplementationOnce(() => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(true);
            }, 10000);
          });
        })
        .mockImplementationOnce(() => ({
          status: 200,
          data: {
            nearest: {
              type: "cluster",
              coordinates: [0, 20]
            },
          },
      }));
      //mock axios cancel
      axios.CancelToken = jest.fn()
        .mockImplementation((newFn) => {
          newFn(cancel);
        });
    });


    it.skip("", (done) => {
      const mapModel = new MapModel("/api/web");
      jest.spyOn(mapModel, "showArrow");
      expect(mapModel).toBeInstanceOf(MapModel);
      mapModel.markers = [];
      mapModel.map = {
        getCenter: () => ({
          lat: () => 0,
          lng: () => 0,
          toJSON: () => ({lat:0,lng:0}),
        }),
        getBounds: () => ({
          contains: () => false,
        }),
        getZoom: () => 15,
      };
      mapModel.checkArrow();
      setTimeout(() => {
        mapModel.checkArrow()
          .then(() => {
            expect(cancel).toHaveBeenCalledTimes(1);
            done();
          });
      }, 10);
//      expect(axios.get).toHaveBeenCalledWith(
//        expect.stringMatching(/\/api\/web\/nearest\?zoom_level=15&lat=0&lng=0/)
//      );
//      expect(mapModel.showArrow).toHaveBeenCalledWith("north");
    });
  });



//  it("module defined", async () => {
//    console.log("entity:", entity);
//    expect(entity).toMatchObject({
//      name: "entity",
//    });
//    expect(entity.getById).toBeDefined();
//    expect(entity.getByWallet).toBeDefined();
//  });
//
//  it("getById(1)", async () => {
//    axios.get = jest.fn(() => ({
//      status: 200,
//      data: {
//        id: 1,
//        name: "Zaven",
//        logoUrl: "http://logo",
//      },
//    }));
//    const e = await entity.getById(1);
//    expect(axios.get).toHaveBeenCalledWith("/api/web/entities/1");
//    expect(e).toMatchObject({
//      id: 1,
//      name: "Zaven",
//      logoUrl: "http://logo",
//    });
//  });
//
//  it("getByWallet('Zaven')", async () => {
//    axios.get = jest.fn(() => ({
//      status: 200,
//      data: [{
//        id: 1,
//        name: "Zaven",
//        logoUrl: "http://logo",
//      }],
//    }));
//    const e = await entity.getByWallet("Zaven");
//    expect(axios.get).toHaveBeenCalledWith("/api/web/entities?wallet=Zaven");
//    expect(e).toMatchObject([{
//      id: 1,
//      name: "Zaven",
//      logoUrl: "http://logo",
//    }]);
//  });
});
