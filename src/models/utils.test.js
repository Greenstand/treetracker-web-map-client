import {parseDomain} from "./utils";

describe("parseDomain", () => {
  it("https://freetown.treetracker.org", () => {
    expect(parseDomain("https://freetown.treetracker.org")).toBe("freetown.treetracker.org");
  });

  it("http://freetown.treetracker.org", () => {
    expect(parseDomain("http://freetown.treetracker.org")).toBe("freetown.treetracker.org");
  });

  it("https://treetracker.org/", () => {
    expect(parseDomain("https://treetracker.org/")).toBe("treetracker.org");
  });

  it("https://treetracker.org", () => {
    expect(parseDomain("https://treetracker.org")).toBe("treetracker.org");
  });

  it("http://localhost:3000", () => {
    expect(parseDomain("https://localhost:3000")).toBe("localhost");
  });

  it("http://localhost", () => {
    expect(parseDomain("https://localhost")).toBe("localhost");
  });

  it("https://treetracker.org/?wallet=xxxx", () => {
    expect(parseDomain("https://treetracker.org/?wallet=xxxx")).toBe("treetracker.org");
  });

});
