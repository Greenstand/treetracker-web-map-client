import { mount } from '@cypress/react'
import React from 'react'
import Home from './index'

it('Renders page component', () => {
  mount(<Home />)
  cy.children()
})