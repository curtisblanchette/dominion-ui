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
    Cypress.Commands.add("fillFlowAppointmentStep", this.fillFlowAppointmentStep);

    Cypress.Commands.add("searchLeads", this.searchLeads);

    Cypress.Commands.overwrite('request', (originalFn, ...args:Array<any>) => {

      const localStorageData:any = localStorage.getItem('state');
      const parsed = JSON.parse(localStorageData);

      if( parsed?.login?.user ){
        let headers:{ [key:string] : string} = {
          'x-access-token' : parsed.login.user.access_token,
          'x-id-token' : parsed.login.user.id_token
        }

        if( parsed?.system?.actingFor?.id ){
          headers['x-acting-for'] = parsed?.system?.actingFor?.id;
        }

        const defaults = { headers };
        // console.log('args',args);
        // let options:any;
        // if (typeof args[0] === 'object' && args[0] !== null) {
        //   [options] = args[0];
        // } else if (args.length === 1) {
        //   [options["url"]] = args;
        // } else if (args.length === 2) {
        //   [options["method"], options["url"]] = args;
        // } else if (args.length === 3) {
        //   [options["method"], options["url"], options["body"]] = args;
        // }
        // console.log('options',options);
        // console.log({...defaults, ...args[0], ...{headers:defaults.headers}});
        return originalFn({...defaults, ...args[0], ...{headers:defaults.headers}});

      }

    });

    Cypress.Commands.add('getIframe', this.getIframe);

  }

  public login(username: string, password: string, { cacheSession = true } = {}) {
    const _login = () => {
      cy.visit('/login');
      cy.intercept({
        method: "GET",
        url: "**/api/v1/system/workspaces",
      }).as("getWorkspace");

      // Act
      cy.get('[data-qa="login-form"]').should('be.visible').find('button').should('be.disabled');
      cy.get('[data-qa="login-form"]').within(($form) => {
        cy.get('[data-qa="input:username"]').type(username);
        cy.get('[data-qa="input:password"]').type(password);
        cy.get('button').should('be.enabled');
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
      cy.get('[data-qa="dropdown:workspace"]').within(($el) => {
        cy.root().click();
        cy.get('[data-qa="dropdown-item"]').contains('demo').click().then(($buttons) => {

            cy.wrap($el).click()
            cy.wait(['@lookups']).then((res) => {
              // hack to allow javascript a second to process the request into localStorage
              cy.wait(5000);
              cy.getLocalStorage('state').then(res => {
                let state = JSON.parse(res || '');
                expect(state.app.lookups, 'Lookups should not be null.').to.be.not.null;
              });
            });

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

  public expectFlowVariable(key: string) {

  }

  // Select Call Type
  public callType(type: string) {
    cy.get('[data-template="call-direction"]').within(() => {
      cy.get('label').contains(type, { matchCase: false }).click();
    });
  }

  public nextStep() {
    cy.get('[data-qa="next"]').within($fiizButton => {
      cy.get('button').should('not.be.disabled').click();
    });
  }

  public finish() {
    cy.get('[data-qa="finish-call"]').should('be.visible').click();
  }

  public fillFlowAppointmentStep(){
    cy.get('[data-qa="step:set-appointment"]').within(($form) => {
      cy.fixture('initial-consultation').then(event => {
        cy.get('[data-qa="input:title"]').type(event.title);

        cy.get('[data-qa="dropdown:officeId"]').click();
        cy.get('[data-qa="dropdown-item"]').first().next().click();

        cy.get('[data-qa="dropdown:typeId"]').click();
        cy.get('[data-qa="dropdown-item"]').first().click();

        //.find('textarea')
        cy.get('[data-qa="textarea:description"]').type(event.description);

        cy.get('[data-qa="regular-slots"]').find('[data-qa="slot-time"]').first().click();
      });
    });
  }

  public searchLeads(name:string){
    cy.get('[data-qa="step:lead-search"]').should('exist').find('form input#search_module').type(name);
    cy.intercept({
      method: "GET",
      url: "**/api/v1/leads/?**",
    }).as("searchLeads")
    cy.wait("@searchLeads")
    cy.get('[data-qa="table-row"]').should('be.visible').should('have.length.at.least',1).first().click();
  }

  public getIframe(selector:string):any{
    return cy.get(selector).should('exist').find('iframe').then(($iframe) => {
      return cy.wrap($iframe[0]).its('0.contentDocument.body');
    });
  }

}

new CypressCustomCommands();

