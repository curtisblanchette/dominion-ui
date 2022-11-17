describe('Login', () => {
  it('Should login as the system user', () => {
    // Arrange
    cy.visit('/login');
    cy.intercept({
      method: "GET",
      url: "**/api/v1/system/workspaces",
    }).as("getWorkspace");

    // Act
    cy.get('[data-qa="login-form"]').within(($form) => {
      cy.get('[data-qa="username"]').type('4iiz.system@4iiz.com')
      cy.get('[data-qa="password"]').type('$BeBetter911')
      cy.wrap($form).submit();
    });

    // Assert
    cy.wait("@getWorkspace");
    cy.getLocalStorage('state').then(state => {
      console.log(state);
      expect(state).to.be.not.null;
    });
  });
});
