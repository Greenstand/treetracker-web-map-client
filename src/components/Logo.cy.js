import React from "react"
import { mount } from "@cypress/react";

import logo from "../images/greenstand_logo_full.png"
import Logo from "./Logo"

describe("Logo", () => {
  it("it shows logo", () => {
    mount(<Logo/>)
    cy.get("a > img")
      .should("be.visible")
      .should("have.attr", "src", logo);
    cy.get("a")
      .should("exist")
      .should("have.attr", "href", "https://greenstand.org/")
  })
});
