import React from "react";
import { mount } from "cypress-react-unit-test";
import ImageShower from "./ImageShower";

describe("ImageShower", () => {
  it("ImageShower", () => {
    function Test(){
      const [isOpen, setOpen] = React.useState(false);
      return(
        <>
          <button onClick={() => setOpen(true)}>show</button>
          <ImageShower open={isOpen} src="xxxx" title="xxxxx" onClose={() => setOpen(false)}/>
        </>
      );
    }
    mount(<Test/>);
    cy.contains("show")
      .click();
  });
});


