describe('Login', () => {
  it('Should login as the system user', () => {
    cy.appSystemLogin();
  });
});
