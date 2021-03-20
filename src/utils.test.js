import {parseMapName} from "./utils";

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
