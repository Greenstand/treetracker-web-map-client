import { mount } from "cypress-react-unit-test";
import React from "react";
import Share from "./Share";

describe("Share", () => {

  before(() => {
  });

  it("Share", () => {
    mount(
      <Share 
        shareUrl="https://treetracker.org/?treeid=300556"
      />
    );
    cy.get(".MuiButtonBase-root")
      .click();
    cy.get("#EmbedButton")
      .click();
    cy.contains(/copy/i)
      .click();
  });
});

