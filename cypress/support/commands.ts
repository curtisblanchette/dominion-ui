// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************

declare namespace Cypress {
  interface Chainable<Subject = any> {
    login : typeof appLogin,
    account : typeof SetAccount,
    calltype : typeof callType,
    nextstep : typeof nextstep,
    finish : typeof finish
  }
}
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// Login
function appLogin(){
    cy.get('[data-qa="login-form"]').within(($form) => {
        cy.get('[data-qa="username"]').type('4iiz.system@4iiz.com')
        cy.get('[data-qa="password"]').type('$BeBetter911')
        cy.wrap($form).submit()
    })
}

// Set Account
function SetAccount(name:string = 'demo'){
    // Set Demo Account By Default
    cy.get('[data-qa="accounts-form"]').within(($form) => {
        cy.get('fiiz-dropdown').click()
    })
    cy.get('[data-qa="dropdown-items"]').within(($buttons) => {
        cy.wrap($buttons).each(($el, $index, $list) => {
            if( $el.find('button').text().trim() == name ){
                cy.wrap($el).click()
            }
        })
    })
}

// Select Call Type
function callType(type:string){
    cy.get('[data-qa="call_direction"]').within(() => {
        cy.get('label').contains(type).click()
    })    
}

function nextstep(){
    cy.get('[data-qa="next"]').click()
}

function finish(){
    cy.get('[data-qa="finish-call"]').click()
}

// Add Custom Commands
Cypress.Commands.add("login", appLogin)
Cypress.Commands.add("account", SetAccount)
Cypress.Commands.add("calltype", callType)
Cypress.Commands.add("nextstep", nextstep)
Cypress.Commands.add("finish", finish)