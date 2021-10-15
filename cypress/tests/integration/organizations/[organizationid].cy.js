const organization = {
    id: 1,
    name: "180Earth",
    photo_url: "https://180.earth/wp-content/uploads/2020/01/Asset-1.png",
    area: "Shirimatunda",
    country: "Tanzania",
    created_at: "November 11, 2019",
    about: "Greenway is a Youth-Driven Environmental Protection Organization providing alternative solutions to single-use plastic and planting carbon-sucking trees for socio-economic development and reducing climate crisis. Our social work includes reforestation, landscape restoration, climate education, awareness campaign, conducting research, outreach activities, and collaborating with key stakeholders to implement sustainable solutions.",
    mission: "To combat climate change, desertification, land degradation, carbon emission by inspiring healthier communities affected by severe climate disorder and modestly reducing pollution by 2050."
}

describe('Organizations', () => {
    it('organization test', () => {
      // Start from the index page
      cy.visit('http://localhost:3000/organizations/1', {
        failOnStatusCode: false,
        onBeforeLoad: (win) => {
          let nextData

          //inject serverside props into test
          Object.defineProperty(win, '__NEXT_DATA__', {
            set(o) { 
              o.props.pageProps.organization = organization
              nextData= o
            },
            get() {
              return nextData
            }
          })
        }
      })
  
      cy.url().should('include', '/organizations')
      cy.get('h6').contains('180Earth')
      cy.get('h6').contains('About the Organization')
      cy.get('div').contains('Planter since November 11, 2019')
      cy.get('h6').contains('Mission')
    })
  })