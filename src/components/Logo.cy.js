import React from "react"
import { mount } from "cypress-react-unit-test";
import Logo from "./Logo"

describe("Logo", () => {
  it("links to greenstand when greenstand logo is used", () => {
    const testSrc = require("../images/greenstand_logo_full.png");
    mount(<Logo logoSrc={testSrc} logoLoaded={true}/>)
    cy.get("a > img")
      .should("be.visible")
      .should("have.attr", "src", testSrc);
    cy.get("a")
      .should("exist")
      .should("have.attr", "href", "https://greenstand.org/")
  })
});
