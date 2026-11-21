describe('home', { defaultCommandTimeout: 5000 }, () => {
  it('home page', () => {
    cy.visit('/');
    cy.contains('Come explore the global reforestation effort').should(
      'be.visible',
    );
    // The hero image is a CSS background, and without it the white heading
    // is not visible on the screenshot. The browser adds a resource entry
    // when the download of the image is complete.
    cy.window().should((win) => {
      const heroLoaded = win.performance
        .getEntriesByType('resource')
        .some((entry) => entry.name.endsWith('/images/bg.webp'));
      expect(heroLoaded, 'hero image loaded').to.equal(true);
    });
    cy.screenshotPage();
  });
});
