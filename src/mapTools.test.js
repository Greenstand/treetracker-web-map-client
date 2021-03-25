import * as mapTools from "./mapTools";

describe("MapTools", () => {

  describe("go('east/west...')", () => {
    it("{0,0} go east 1deg => {1,0}", () => {
      expect(mapTools.go("east", {lat:0, lng:0}, 1)).toMatchObject({
        lat: 0,
        lng: 1,
      });
    });

    it("{180,0} go east 1deg => {179,0}", () => {
      expect(mapTools.go("east", {lat:0, lng:180}, 1)).toMatchObject({
        lat: 0,
        lng: -179,
      });
    });

    it("{-180,0} go west 1deg => {179,0}", () => {
      expect(mapTools.go("west", {lat:0, lng:-180}, 1)).toMatchObject({
        lat: 0,
        lng: 179,
      });
    });

    it("{0,90} go north 1deg => {89,0}", () => {
      expect(mapTools.go("north", {lat:90, lng:0}, 1)).toMatchObject({
        lat: 89,
        lng: 0,
      });
    });

    it("{0,-90} go south 1deg => {89,0}", () => {
      expect(mapTools.go("south", {lat:-90, lng:0}, 1)).toMatchObject({
        lat: -89,
        lng: 0,
      });
    });
  });

  describe("getAngleLng", () => {

    it("(19, 10) => 9", () => {
      expect(mapTools.getAngleLng(19, 10)).toBe(9);
    });

    it("(1, -1) => 2", () => {
      expect(mapTools.getAngleLng(1, -1)).toBe(2);
    });

    it("(-179, 179) => 2", () => {
      expect(mapTools.getAngleLng(-179, 179)).toBe(2);
    });

  });

  describe("getAngleLat", () => {

    it("(1, -1) => 2", () => {
      expect(mapTools.getAngleLat(1, -1)).toBe(2);
    });

    it("(10, 2) => 8", () => {
      expect(mapTools.getAngleLat(10, 2)).toBe(8);
    });

    it.skip("(89, 89) => 2", () => {
      expect(mapTools.getAngleLng(89, 89)).toBe(2);
    });

  });



});

describe("getInitialBounds", () => {

  beforeAll(() => {
  });


  it("getInitialBounds(0,0)", () => {
    const result = mapTools.getInitialBounds([{lat:0, lng:0}], 500, 500);
    expect(result).toMatchObject({
      center: {
        lat: 0,
        lng: 0,
      },
      zoomLevel: expect.anything(),
    });
  });
});
