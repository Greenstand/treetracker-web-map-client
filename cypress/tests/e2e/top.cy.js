describe('Top Page', () => {
  it('timeline', () => {
    cy.visit('/top');
    cy.contains('Filters').click();
    // cypress to find the date type of input, choose the first one, and input the date
    cy.get('input[type=date]').first().type('2008-01-01');
    // find the second date type of input, choose the second one, and input the date
    cy.get('input[type=date]').eq(1).type('2020-01-02');
    cy.contains(/submit/i).click();
  });

  it.only('mobile', () => {
    cy.viewport('iphone-6');
    cy.visit('/top');
    cy.contains('Filters').click();
    // cypress to find the date type of input, choose the first one, and input the date
    cy.contains('label', 'Start Date')
      .parent()
      .find('input')
      .type('2008-01-01');
    // find the second date type of input, choose the second one, and input the date
    cy.contains('label', 'End Date').parent().find('input').type('2020-01-02');
    cy.contains(/submit/i).click();
  });
});
