import React from "react";
import { mount } from "@cypress/react";
import Footer from "./Footer.js";

describe('Footer', () => {
    it('Footer', () => {
        mount(<Footer />)
    })
})