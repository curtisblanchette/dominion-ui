describe('Inbound Call Flow - Existing Lead - Take Notes', () => {

    it('Login to Application', () => {
        cy.visit('/')
        cy.get('#username').type('4iiz.system@4iiz.com')
        cy.get('#password').type('$BeBetter911')
        cy.get('#login-form').submit().then( (res) => {
            console.log('Login Completed');
        });
        cy.wait(2000)
    })

    it('set Demo Account and start call flow', () => {
        // Set Demo Account
        cy.wait(2000)
        cy.get('#actingFor').click()
        cy.get('.dropdown-menu__items').eq(0).click()
        cy.get('#accounts-form').submit()
        cy.wait(5000)

        // Go to Flow Page
        cy.visit('/flow')

        // Select Inbound and proceed
        cy.get('label[for="call_direction_inbound"]').click()
        cy.get('#next').click()

        // Search For a Lead
        cy.get('#search_module').type('Raj kumar')
        cy.wait(2000)
        cy.get('.flex-table__row').first().click()
        cy.get('#next').click()

        // Review Lead Info
        cy.get('#next').click()

        // Select Deal
        cy.get('.flex-table__row').eq(0).click()
        cy.get('#next').click()

        // Review Opportunity
        cy.get('#next').click()

        // Reason For Call
        cy.get('fiiz-radio label').eq(3).click()
        cy.get('#next').click()

        // Take Notes
        cy.get('iframe').its('0.contentDocument.body').then(cy.wrap).type('This is a test note')
        cy.get('#next').click()

        // Finish Call
        cy.get('#finish_call').click()

    })

})