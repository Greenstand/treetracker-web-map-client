import React from "react"
import { mount } from "cypress-react-unit-test";
import Logo from "./Logo"

describe("Logo", () => {
  it("it shows logo", () => {
    const testSrc = "test-source";
    mount(<Logo logoSrc={testSrc} logoLoaded={true}/>);
    cy.get("img")
      .should("be.visible")
      .should("have.attr", "src", testSrc);
    cy.get("a").should("not.exist");
  });
  it("links to greenstand when greenstand logo is used", () => {
    const testSrc = require("../images/logo_floating_map.svg");
    mount(<Logo logoSrc={testSrc} logoLoaded={true}/>)
    cy.get("a > img")
      .should("be.visible")
      .should("have.attr", "src", testSrc);
    cy.get("a")
      .should("exist")
      .should("have.attr", "href", "https://greenstand.org/")
      cy.viewport(800, 500)
  })
});
