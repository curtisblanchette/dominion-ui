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
    Cypress.Commands.add("login", this.login);
    Cypress.Commands.add("logout", this.logout);
    Cypress.Commands.add("setAccount", this.setAccount);

    // flow
    Cypress.Commands.add("callType", this.callType);
    Cypress.Commands.add("nextStep", this.nextStep);
    Cypress.Commands.add("finish", this.finish);
  }

  public login(username: string, password: string, { cacheSession = true } = {}) {
    const _login = () => {
      cy.visit('/login');
      cy.intercept({
        method: "GET",
        url: "**/api/v1/system/workspaces",
      }).as("getWorkspace");

      // Act
      cy.get('[data-qa="login-form"]').within(($form) => {
        cy.get('[data-qa="username"]').type(username);
        cy.get('[data-qa="password"]').type(password);
        cy.root().submit();
      });

      // Assert
      cy.wait("@getWorkspace");
      cy.getLocalStorage('state').then(res => {
        let state = JSON.parse(res || '');
        expect(state.login.user).to.be.not.null; // this is an e2e test assertion
        expect(state.login.user.roles).to.include('system'); // this is an integration test assertion
      });

      cy.visit('/system');

      cy.intercept({
        method: "GET",
        url: "**/api/v1/**",
      }).as("lookups");

      // Set Demo Account By Default
      cy.get('[data-qa="accounts-dropdown"]').within(($el) => {
        cy.wrap($el).click().then(() => {
          cy.get('.dropdown-menu').should('be.visible');
        });
      });
      cy.get('[data-qa="dropdown-items"]').within(($buttons) => {
        cy.wrap($buttons).each(($el, $index, $list) => {
          if( $el.find('button').text().trim() == name ){
            cy.wrap($el)
              .click()
              .wait(['@lookups'])
              .wait(1000); // give app .1s to store api responses to State
          }
        });
      });
    };

    if (cacheSession) {
      cy.session([username, password], _login, {
        cacheAcrossSpecs: true,
        validate: () => {
          cy.getLocalStorage('state').then(res => {
            let state = JSON.parse(res || '');

            cy.request({
              url: Cypress.env('API_URL') + '/users/me',
              method: 'GET',
              headers: {
                'x-access-token': state.login.user.access_token,
                'x-id-token': state.login.user.id_token,
                'x-acting-for': state.system.actingFor.id
              }
            }).its('status').should('eq', 200);
          });
        }
      });
    } else {
      _login();
    }
  }

  public logout() {
    // Arrange
    cy.visit('/dashboard');

    // Act
    cy.get('[data-qa="logout"]').within(($logout) => {
      cy.wrap($logout).click();
    });
  }

  // Set Account
  public setAccount(name:string = 'demo'){
    cy.visit('/system');
    cy.intercept({
      method: "GET",
      url: "**/api/v1/**",
    }).as("lookups");

    // Set Demo Account By Default
    cy.get('[data-qa="accounts-dropdown"]').within(($el) => {
      cy.wrap($el).click().then(() => {
        cy.get('.dropdown-menu').should('be.visible');
      });
    });
    cy.get('[data-qa="dropdown-items"]').within(($buttons) => {
      cy.wrap($buttons).each(($el, $index, $list) => {
        if( $el.find('button').text().trim() == name ){
          cy.wrap($el)
            .click()
            .wait(['@lookups'])
            .wait(100); // give app .1s to store api responses to State
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

