describe('Logout', () => {
  it('Should logout of the app', () => {
    // Arrange
    cy.visit('/dashboard');

    // Act
    cy.get('[data-qa="logout"]').within(($logout) => {
      cy.wrap($logout).click();
    });
  });
});
