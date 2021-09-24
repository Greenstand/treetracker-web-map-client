import * as tools from "./tools";

describe("Tools", () => {

  it("scale(...)", () => {
    console.log(tools.scale("3"));
    console.log(tools.scale("30"));
    console.log(tools.scale("300"));
    console.log(tools.scale("3000"));
    console.log(tools.scale("30000"));
    console.log(tools.scale("300000"));
  });

  it("scaleFontSize(...)", () => {
    console.log(tools.scaleFontSize("3"));
    console.log(tools.scaleFontSize("30"));
    console.log(tools.scaleFontSize("300"));
    console.log(tools.scaleFontSize("3000"));
    console.log(tools.scaleFontSize("30000"));
    console.log(tools.scaleFontSize("300000"));
  });

});

