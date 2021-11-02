import {boundsToString, parseMapName, roundNumber} from "./utils";

describe("parseMapName", () => {

  it("freetown.treetracker.org should return freetown", () => {
    expect(parseMapName("freetown.treetracker.org")).toBe("freetown");
  });
  it("treetracker.org should return undefined", () => {
    expect(parseMapName("treetracker.org")).toBeUndefined();
  });

  it("treetracker.org should return undefined", () => {
    expect(parseMapName("treetracker.org")).toBeUndefined();
  });

  it("test.treetracker.org should return undefined", () => {
    expect(parseMapName("test.treetracker.org")).toBeUndefined();
  });

  it("dev.treetracker.org should return undefined", () => {
    expect(parseMapName("dev.treetracker.org")).toBeUndefined();
  });

  it("localhost should return undefined", () => {
    expect(parseMapName("localhost")).toBeUndefined();
  });


  it("http://dev.treetracker.org should throw error", () => {
    expect(() => {
      parseMapName("http://dev.treetracker.org");
    }).toThrow();
  });

  it("127.17.0.225 should return undefined", () => {
    expect(parseMapName("127.17.0.225")).toBeUndefined();
  });

  it("wallet.treetracker.org should return undefined", () => {
    expect(parseMapName("wallet.treetracker.org")).toBeUndefined();
  });

  it("ready.treetracker.org should return undefined", () => {
    expect(parseMapName("ready.treetracker.org")).toBeUndefined();
  });

});

describe("roundNumber", () => {
  it("rounds numbers", () => {
    const testCases = [
      {number: 1.005, places: 2, expected: 1.01},
      {number: 5.23424634123, places: 6, expected: 5.234246},
      {number: 25, places: 1, expected: 25}
    ];
    testCases.forEach(testCase => {
      expect(roundNumber(testCase.number, testCase.places)).toBe(testCase.expected);
    });
  })
})

describe("boundsToString", () => {
  it("returns a string given map bounds", () => {
    const bounds = {
      getWest: () => 5.24312934982,
      getSouth: () => 3.7249235230,
      getEast: () => 4.430,
      getNorth: () => 25
    }
    expect(boundsToString(bounds)).toBe("5.243129,3.724924,4.43,25")
  })
})
