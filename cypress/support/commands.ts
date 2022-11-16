// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************

declare namespace Cypress {
  interface Chainable<Subject = any> extends CypressCustomCommands { }
}

class CypressCustomCommands {

  constructor() {
    // Add Custom Commands
    Cypress.Commands.add("appLogin", this.appLogin);
    Cypress.Commands.add("setAccount", this.setAccount);
    Cypress.Commands.add("callType", this.callType);
    Cypress.Commands.add("nextStep", this.nextStep);
    Cypress.Commands.add("finish", this.finish);
  }

  public appLogin() {

    // Arrange
    cy.visit('/login');
    cy.intercept({
      method: "GET",
      url: "**/api/v1/system/workspaces",
    }).as("getWorkspace");

    // Act
    cy.get('form[data-qa="login-form"]').within(($form) => {
      cy.get('[data-qa="username"]').type('4iiz.system@4iiz.com')
      cy.get('[data-qa="password"]').type('$BeBetter911')
      cy.wrap($form).submit();
    });

    // Assert
    cy.wait("@getWorkspace");
  }

  // Set Account
  public setAccount(name:string = 'demo'){
    cy.intercept({
      method: "GET",
      url: "**/api/v1/**",
    }).as("lookups");

    // Set Demo Account By Default
    cy.get('[data-qa="accounts-form"]').within(($form) => {
      cy.get('fiiz-dropdown').click();
    });
    cy.get('[data-qa="dropdown-items"]').within(($buttons) => {
      cy.wrap($buttons).each(($el, $index, $list) => {
        if( $el.find('button').text().trim() == name ){
          cy.wrap($el).click().wait(['@lookups']).wait(100);
        }
      });
    });
  }


  // Select Call Type
  public callType(type: string) {
    cy.get('[data-qa="call_direction"]').within(() => {
      cy.get('label').contains(type, { matchCase: false }).click();
    });
  }

  public nextStep(){
    cy.get('[data-qa="next"]').click();
  }

  public finish(){
    cy.get('[data-qa="finish-call"]').click();
  }
}

new CypressCustomCommands();

